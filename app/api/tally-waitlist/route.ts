import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

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

  const labelNorm = (s: string) => s.trim().toLowerCase();

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
  const text = [
    greeting,
    "",
    "Thank you for joining the waitlist for Intentional Space.",
    "This is a small, carefully held gathering, and the fact that you have taken this step means something.",
    "When the next date is confirmed and places become available, you will hear from me directly. No rush. No pressure. Just a conversation when the time is right.",
    "Until then, if you want to get a feel for the kind of space we create together, the reflections are always there for you.",
    "Read the latest reflection → https://www.tobiyusuf.com/reflections",
    "",
    "With warmth,",
    "Tobi",
  ].join("\n");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    replyTo: "tobi@tobiyusuf.com",
    subject: "You are on the Intentional Space waitlist",
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
