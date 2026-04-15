import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  INSTAGRAM_URL,
  SCHEDULING_URL,
  SUBSTACK_PUBLICATION_SUBSCRIBE_URL,
} from "@/lib/data/site";

type TallyField = {
  key: string;
  label: string;
  type: string;
  value: unknown;
};

function valueToText(v: unknown): string {
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    const parts = v.map((item) => valueToText(item)).filter(Boolean);
    return parts.join(" ").trim();
  }
  if (v && typeof v === "object") {
    const candidateKeys = ["email", "value", "text", "label", "name"];
    for (const key of candidateKeys) {
      const candidate = (v as Record<string, unknown>)[key];
      const asText = valueToText(candidate);
      if (asText) return asText;
    }
  }
  return "";
}

/** Resolve submitter email and first name from Tally `data.fields`. */
function extractEmailAndFirstName(fields: TallyField[]): { email: string; firstName: string } | null {
  let email = "";
  let firstName = "";
  const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  const labelNorm = (s: unknown) => (typeof s === "string" ? s.trim().toLowerCase() : "");

  for (const f of fields) {
    if (f.type === "INPUT_EMAIL") {
      const v = valueToText(f.value);
      if (isEmail(v)) email = v;
    }
  }

  if (!email) {
    for (const f of fields) {
      const lbl = labelNorm(f.label);
      const v = valueToText(f.value);
      if (!v) continue;
      if (isEmail(v) || lbl.includes("email")) {
        email = v;
        break;
      }
    }
  }

  for (const f of fields) {
    const lbl = labelNorm(f.label);
    const v = valueToText(f.value);
    if (!v) continue;
    if (lbl === "first name" || lbl === "firstname") {
      firstName = v.split(/\s+/)[0] ?? v;
      break;
    }
  }

  if (!firstName) {
    for (const f of fields) {
      const lbl = labelNorm(f.label);
      const v = valueToText(f.value);
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
      const v = valueToText(f.value);
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
  rawBody: string,
  receivedB64: string | null,
  secret: string,
): boolean {
  if (!receivedB64) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
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
    if (!verifyTallySignature(rawBody, received, signingSecret)) {
      return NextResponse.json(
        {
          error: "Invalid or missing signature",
          code: "TALLY_SIGNATURE_INVALID",
          hasSignatureHeader: Boolean(received),
          hasSigningSecret: Boolean(signingSecret),
        },
        { status: 401 },
      );
    }
  }

  if (payload.eventType && payload.eventType !== "FORM_RESPONSE") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const fields = payload.data?.fields;
  if (!Array.isArray(fields)) {
    return NextResponse.json(
      {
        error: "Invalid payload",
        code: "TALLY_FIELDS_INVALID",
        hasData: Boolean(payload.data),
        fieldsType: typeof payload.data?.fields,
      },
      { status: 400 },
    );
  }

  const extracted = extractEmailAndFirstName(fields);
  if (!extracted) {
    return NextResponse.json(
      {
        error: "No email in submission",
        code: "TALLY_EMAIL_MISSING",
        fieldTypes: fields.map((f) => f.type),
        fieldLabels: fields.map((f) => f.label),
      },
      { status: 400 },
    );
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
  const text = [
    greeting,
    "",
    "Thank you for joining the Forever Table waitlist. I'm genuinely glad this spoke to you.",
    "",
    "Forever Table is something I hold very close. It's an intimate dinner for 6–10 couples: real food, real conversation, and the kind of honesty that only happens when the room is small enough to feel safe. No panels. No presentations. Just couples sitting together and letting the walls come down.",
    "",
    "These dinners happen 4–6 times a year, and places are always limited. Being on this list means you'll receive a personal invitation before it goes public.",
    "",
    "While you wait, here are some ways to stay close:",
    "",
    "→ Follow me on Instagram: honest marriage moments, reflections, and what I'm building. @MrsTobiYusuf",
    INSTAGRAM_URL,
    "",
    "→ Read the Sunday reflections: weekly writing about the patterns I see in real marriages. Subscribe on Substack.",
    SUBSTACK_PUBLICATION_SUBSCRIBE_URL,
    "",
    "→ Book a Marriage Reflection Call: if you and your partner need a conversation now, not later. 60 minutes. Private. Honest. £295/couple.",
    SCHEDULING_URL,
    "",
    "→ Listen to the Love Reset Audio: a free 5-day audio experience to help you both press pause and reconnect.",
    "https://lctobiyusuf.systeme.io/935600f7",
    "",
    "The next table is coming. I'll be in touch.",
    "",
    "With warmth,",
    "Tobi",
  ].join("\n");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    replyTo: "tobi@tobiyusuf.com",
    subject: "Your seat is saved.",
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
