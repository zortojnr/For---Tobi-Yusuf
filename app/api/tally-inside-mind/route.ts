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
    "Thank you for signing up to be notified about the Inside The Mind Series. I'm so glad this found you.",
    "",
    "This series has been sitting on my heart for a long time. Short, intimate audio experiences - 15 to 30 minutes - where I narrate the inner world of a wife or a husband navigating the real patterns inside marriage. The silence. The resentment. The love that's still there but buried underneath everything unsaid.",
    "",
    "These aren't advice. They aren't lessons. They're reflections - designed to make you stop and think: \"How does she know exactly what I'm feeling?\"",
    "",
    "When the series launches in May, here's what's coming first:",
    "-> Inside the Mind of a Wife Who Feels Unseen",
    "-> Inside the Mind of a Husband Who Has Shut Down",
    "-> The Silent Treatment Pattern",
    "",
    "Prices will start from £9. You'll have first access before they go public.",
    "",
    "While you wait:",
    "-> Listen to the Love Reset Audio - my free 5-day audio experience. If you haven't tried it yet, this will give you a taste of what's coming.",
    "https://lctobiyusuf.systeme.io/935600f7",
    "",
    "-> Follow me on Instagram - where the honest conversations happen daily. @MrsTobiYusuf",
    INSTAGRAM_URL,
    "",
    "-> Read the Sunday reflections - weekly writing about the real patterns inside marriage. Subscribe on Substack.",
    SUBSTACK_PUBLICATION_SUBSCRIBE_URL,
    "",
    "-> Book a Marriage Reflection Call - if you need a conversation now, not an audio. 60 minutes with me. Private. Honest. £295/couple.",
    SCHEDULING_URL,
    "",
    "-> Join the Choosing Us waitlist - my monthly community for people who are done pretending.",
    "https://tally.so/r/LZM1Bl",
    "",
    `The series is almost ready, ${firstName || "love"}. And I think when you hear it, you'll feel something shift.`,
    "",
    "With warmth,",
    "Tobi",
  ].join("\n");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: email,
    replyTo: "tobi@tobiyusuf.com",
    subject: "She sees what you feel but cannot say.",
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
