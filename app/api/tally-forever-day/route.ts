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
    "Thank you for joining the Forever & A Day waitlist. It means a lot that this is calling to you.",
    "",
    "Forever & A Day is an intimate experience for couples who want to reconnect and remember why they chose each other. Over a full day, we'll create space for the deeper conversations that sustain real love.",
    "",
    "Places are very limited and go quickly, so being on this list gives you first access when the next date is announced.",
    "",
    "While you wait, here are a few ways to stay in the conversation:",
    "",
    "→ Follow me on Instagram. I share marriage reflections, relatable moments, and behind-the-scenes of what I'm building.",
    "@MrsTobiYusuf",
    "https://www.instagram.com/mrstobiyusuf",
    "",
    "→ Read the Sunday reflections, every week I write honestly about patterns I see in marriages. Subscribe on Substack.",
    "https://substack.com/@mrstobiyusuf",
    "",
    "→ Book a Marriage Reflection Call if you feel like you need a conversation sooner, this is a private 60-minute session for you and your partner. It's not therapy. It's one honest conversation with someone who understands. £295/couple.",
    "https://therelatablewife.as.me/",
    "",
    "→ Listen to the Love Reset Audio a free 5-day audio experience to help you breathe, refocus, and reconnect.",
    "https://www.tobiyusuf.com/",
    "",
    "→ Explore Intentional Space, an intimate gathering for women to have honest conversations about marriage, relationships, and identity.",
    "https://tally.so/r/J9DKpK",
    "",
    "",
    `I'm glad you're here, ${firstName}. Looking forward to this journey with you.`,
    "",
    "With warmth,",
    "Tobi",
  ].join("\n");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    replyTo: "tobi@tobiyusuf.com",
    subject: "You're in. Here's what happens next.",
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
