import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_NOTIFICATION_EMAIL } from "@/lib/data/site";
import { SPEAKING_EVENT_TYPES, SPEAKING_PREFERRED_TOPICS } from "@/lib/data/speaking-enquiry";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isSpeakingEventType(v: string): v is (typeof SPEAKING_EVENT_TYPES)[number] {
  return (SPEAKING_EVENT_TYPES as readonly string[]).includes(v);
}

function isSpeakingPreferredTopic(v: string): v is (typeof SPEAKING_PREFERRED_TOPICS)[number] {
  return (SPEAKING_PREFERRED_TOPICS as readonly string[]).includes(v);
}

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
    organisation?: string;
    eventType?: string;
    preferredTopic?: string;
    eventDate?: string;
    location?: string;
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
  const organisation =
    typeof json.organisation === "string" ? json.organisation.trim() : "";
  const eventType =
    typeof json.eventType === "string" ? json.eventType.trim() : "";
  const preferredTopic =
    typeof json.preferredTopic === "string" ? json.preferredTopic.trim() : "";
  const eventDate =
    typeof json.eventDate === "string" ? json.eventDate.trim() : "";
  const location =
    typeof json.location === "string" ? json.location.trim() : "";
  const message = typeof json.message === "string" ? json.message.trim() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  if (!firstName) {
    return NextResponse.json({ error: "First name required" }, { status: 400 });
  }

  if (!eventType || !isSpeakingEventType(eventType)) {
    return NextResponse.json({ error: "Valid event type required" }, { status: 400 });
  }

  if (!preferredTopic || !isSpeakingPreferredTopic(preferredTopic)) {
    return NextResponse.json({ error: "Valid preferred topic required" }, { status: 400 });
  }

  if (organisation.length > 200) {
    return NextResponse.json({ error: "Organisation is too long" }, { status: 400 });
  }

  if (location.length > 300) {
    return NextResponse.json({ error: "Location is too long" }, { status: 400 });
  }

  if (eventDate && !DATE_RE.test(eventDate)) {
    return NextResponse.json({ error: "Invalid event date" }, { status: 400 });
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
    `Organisation / Company: ${organisation || "(Not provided)"}`,
    `Event type: ${eventType}`,
    `Preferred topic: ${preferredTopic}`,
    `Event date: ${eventDate || "(Not provided)"}`,
    `Location: ${location || "(Not provided)"}`,
    "",
    "Tell me more about your event and audience:",
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
