import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  INSTAGRAM_URL,
  SUBSTACK_PUBLICATION_SUBSCRIBE_URL,
} from "@/lib/data/site";

type TallyField = {
  key: string;
  label: string;
  type: string;
  value: unknown;
};

function stringVal(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Resolve submitter email and first name from Tally `data.fields`. */
function extractEmailAndFirstName(fields: TallyField[]): { email: string; firstName: string } | null {
  let email = "";
  let firstName = "";

  for (const f of fields) {
    if (f.type === "INPUT_EMAIL") {
      const v = stringVal(f.value);
      if (v.includes("@")) email = v;
    }
  }

  const labelNorm = (s: unknown) => (typeof s === "string" ? s.trim().toLowerCase() : "");

  for (const f of fields) {
    const lbl = labelNorm(f.label);
    const v = stringVal(f.value);
    if (!v) continue;
    if (lbl === "first name" || lbl === "firstname") {
      firstName = v.split(/\s+/)[0] ?? v;
      break;
    }
  }

  if (!firstName) {
    for (const f of fields) {
      const lbl = labelNorm(f.label);
      const v = stringVal(f.value);
      if (!v || v.includes("@")) continue;
      if (lbl === "name" || lbl === "full name") {
        firstName = v.split(/\s+/)[0] ?? v;
        break;
      }
    }
  }

  if (!firstName) {
    for (const f of fields) {
      if (f.type !== "INPUT_TEXT") continue;
      const v = stringVal(f.value);
      if (!v || v.includes("@")) continue;
      if (email && v === email) continue;
      firstName = v.split(/\s+/)[0] ?? v;
      break;
    }
  }

  if (!email) return null;
  return { email, firstName: firstName || "" };
}

/** Tally signs `JSON.stringify(webhookPayload)` per https://tally.so/help/webhooks */
function verifyTallySignature(
  payload: unknown,
  receivedB64: string | null,
  secret: string,
): boolean {
  if (!receivedB64) return false;
  const body = JSON.stringify(payload);
  const expected = createHmac("sha256", secret).update(body, "utf8").digest("base64");
  try {
    const a = Buffer.from(receivedB64, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const signingSecret = process.env.TALLY_WEBHOOK_SIGNING_SECRET?.trim();
  const rawBody = await request.text();

  let payload: { eventType?: string; data?: { fields?: TallyField[] } };
  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (signingSecret) {
    const received = request.headers.get("tally-signature");
    if (!verifyTallySignature(payload, received, signingSecret)) {
      return NextResponse.json({ error: "Invalid or missing signature" }, { status: 401 });
    }
  }

  if (payload.eventType && payload.eventType !== "FORM_RESPONSE") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const fields = payload.data?.fields;
  if (!Array.isArray(fields)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const extracted = extractEmailAndFirstName(fields);
  if (!extracted) {
    return NextResponse.json({ error: "No email in submission" }, { status: 400 });
  }

  const { email, firstName } = extracted;
  const apiKey = process.env.MY_RESEND_API?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Email is not configured (MY_RESEND_API / RESEND_FROM)." },
      { status: 503 },
    );
  }

  const greeting = firstName ? `Hi ${firstName},` : "Hi,";
  const gladLine = firstName
    ? `I'm glad you're taking this step, ${firstName}.`
    : "I'm glad you're taking this step.";
  const text = [
    greeting,
    "",
    "Thank you for registering your interest in Forever & A Day. The fact that you're here thinking about your marriage before (or just after) the wedding tells me something important about the kind of partnership you want to build.",
    "",
    "Forever & A Day is a guided experience for engaged and newly married couples. Over 4 sessions (or a 1-day intensive), we explore the things that most couples don't talk about until they become arguments: emotional patterns, cultural expectations, family dynamics, unspoken contracts, and the vision for the life you're building together.",
    "",
    "It's not therapy. It's not a course. It's honest, intentional preparation guided by someone who has been married for 14 years and has sat with couples at every stage.",
    "",
    "Available as:",
    "",
    "→ Private couples experience — 4 × 90-minute sessions or 1-day intensive. From £997/couple.",
    "→ Group cohort — 6 sessions with up to 8 couples. From £497/couple.",
    "",
    "I'll be in touch to learn more about where you are and which format might be the right fit.",
    "",
    "In the meantime:",
    "",
    "→ Follow me on Instagram: honest conversations about marriage, daily. @MrsTobiYusuf",
    INSTAGRAM_URL,
    "",
    "→ Read the Sunday reflections: weekly writing about the real patterns inside marriage. Subscribe on Substack.",
    SUBSTACK_PUBLICATION_SUBSCRIBE_URL,
    "",
    "→ Listen to the Love Reset Audio: a free 5-day audio experience for you and your partner.",
    "https://www.tobiyusuf.com/",
    "",
    gladLine,
    "The marriage is what matters most and you're already investing in it.",
    "",
    "With warmth,",
    "Tobi",
  ].join("\n");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    replyTo: "tobi@tobiyusuf.com",
    subject: "This is where it begins.",
    text,
  });

  if (error) {
    return NextResponse.json(
      {
        error: "Failed to send email",
        detail:
          typeof error === "object" && error && "message" in error
            ? String((error as { message: unknown }).message)
            : error,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
