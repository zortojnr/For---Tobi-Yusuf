import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/data/site";

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
    message?: string;
  };
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof json.email === "string" ? json.email.trim() : "";
  const firstName =
    typeof json.firstName === "string" ? json.firstName.trim() : "";
  const message = typeof json.message === "string" ? json.message.trim() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  if (!firstName) {
    return NextResponse.json({ error: "First name required" }, { status: 400 });
  }

  if (message.length > 5000) {
    return NextResponse.json({ error: "Event details are too long" }, { status: 400 });
  }

  const subject = "Speaking enquiry";
  const text = [
    "New speaking enquiry from the website.",
    "",
    `Name: ${firstName}`,
    `Email: ${email}`,
    "",
    "Event details:",
    message || "(Not provided)",
  ].join("\n");

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text,
    replyTo: email,
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
