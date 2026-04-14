import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/data/site";

const ENQUIRY_LABELS: Record<string, string> = {
  "reflection-call": "Marriage Reflection Call",
  "intentional-space": "Intentional Space",
  "forever-day": "Forever & A Day",
  "forever-table": "Forever Table",
  speaking: "Speaking engagement",
  "media-press": "Media & press",
  "partnership-collaboration": "Partnership or collaboration",
  "brand-collaboration": "Brand collaboration",
};

export async function POST(request: Request) {
  const apiKey = process.env.MY_RESEND_API?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email is not configured (MY_RESEND_API)." },
      { status: 503 },
    );
  }

  const from = process.env.RESEND_FROM?.trim();
  if (!from) {
    return NextResponse.json(
      { error: "Email is not configured (RESEND_FROM)." },
      { status: 503 },
    );
  }

  let json: {
    firstName?: string;
    email?: string;
    enquiry?: string;
  };
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof json.email === "string" ? json.email.trim() : "";
  const firstName =
    typeof json.firstName === "string" ? json.firstName.trim() : "";
  const enquiryRaw =
    typeof json.enquiry === "string" ? json.enquiry.trim() : "forever-day";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  if (!firstName) {
    return NextResponse.json({ error: "First name required" }, { status: 400 });
  }

  if (!Object.prototype.hasOwnProperty.call(ENQUIRY_LABELS, enquiryRaw)) {
    return NextResponse.json({ error: "Invalid enquiry type" }, { status: 400 });
  }

  const enquiryLabel = ENQUIRY_LABELS[enquiryRaw];
  const subject = enquiryLabel;
  const text = [
    `New contact from the website.`,
    ``,
    `Enquiry: ${enquiryLabel}`,
    `Name: ${firstName}`,
    `Email: ${email}`,
  ].join("\n");

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text,
  });

  if (error) {
    return NextResponse.json(
      {
        error: "Failed to send message",
        detail:
          typeof error === "object" && error && "message" in error
            ? String((error as { message: unknown }).message)
            : error,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true, id: data?.id });
}
