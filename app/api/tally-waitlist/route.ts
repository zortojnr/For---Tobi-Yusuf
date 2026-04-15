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
    "Thank you for joining the Choosing Us waitlist. That decision - to put your name down for a community that's about honesty, not performance - already says something about the kind of marriage you're building.",
    "",
    "Choosing Us is a monthly community for couples and individuals who want ongoing, honest conversation about the real patterns inside marriage. Not a course. Not a programme with an end date. A room that stays open.",
    "",
    "What you'll get as a member:",
    "",
    "-> Monthly live conversation hosted by me - honest, guided, no scripts.",
    "-> Weekly reflection prompts and discussion.",
    "-> Access to past recordings and audio reflections.",
    "-> A community of people who understand - because they're living it too.",
    "-> Early access to Intentional Space, Forever Table, and new experiences.",
    "",
    "Founding members will receive a special rate when the doors open. Because you're on this list, you'll hear before anyone else.",
    "",
    "While you wait, here are some ways to stay close to the conversation:",
    "",
    "-> Follow me on Instagram - daily honest moments about marriage and womanhood. @MrsTobiYusuf",
    INSTAGRAM_URL,
    "",
    "-> Read the Sunday reflections - weekly writing about the quiet patterns inside real marriages. Subscribe on Substack.",
    SUBSTACK_PUBLICATION_SUBSCRIBE_URL,
    "",
    "-> Book a Marriage Reflection Call - if you and your partner need a conversation now. 60 minutes. Private. Honest. £295/couple.",
    SCHEDULING_URL,
    "",
    "-> Listen to the Love Reset Audio - a free 5-day audio experience to help you reconnect.",
    "https://lctobiyusuf.systeme.io/935600f7",
    "",
    `Choosing Us isn't just a community name, ${firstName || "love"}. It's a daily decision. And you've already started making it.`,
    "",
    "With warmth,",
    "Tobi",
  ].join("\n");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    replyTo: "tobi@tobiyusuf.com",
    subject: "You chose to be here. That matters.",
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
