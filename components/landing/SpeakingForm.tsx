"use client";

import { useState } from "react";
import { SPEAKING_EVENT_TYPES, SPEAKING_PREFERRED_TOPICS } from "@/lib/data/speaking-enquiry";

const SUCCESS_MSG =
  "Thank you for reaching out. I'll review your enquiry and be in touch within 48 hours. In the meantime, feel free to explore the reflections or upcoming experiences.";

export function SpeakingForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [eventType, setEventType] = useState("");
  const [preferredTopic, setPreferredTopic] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const trimmed = message.trim();
      const res = await fetch("/api/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          organisation: organisation.trim(),
          eventType,
          preferredTopic,
          eventDate: eventDate.trim(),
          location: location.trim(),
          message: trimmed,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("err");
        setMsg(data.error || "Something went wrong.");
        return;
      }
      setStatus("ok");
      setMsg(SUCCESS_MSG);
      setEmail("");
      setFirstName("");
      setOrganisation("");
      setEventType("");
      setPreferredTopic("");
      setEventDate("");
      setLocation("");
      setMessage("");
    } catch {
      setStatus("err");
      setMsg("Network error.");
    }
  }

  return (
    <form className="form-panel" onSubmit={onSubmit}>
      <div className="form-grid-2">
        <div className="form-field">
          <label htmlFor="sp-first">First name</label>
          <input
            id="sp-first"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="sp-email">Email</label>
          <input
            id="sp-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="sp-org">Organisation / Company</label>
        <input
          id="sp-org"
          value={organisation}
          onChange={(e) => setOrganisation(e.target.value)}
          autoComplete="organization"
        />
      </div>
      <div className="form-grid-2">
        <div className="form-field">
          <label htmlFor="sp-event-type">Event type</label>
          <select
            id="sp-event-type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            required
          >
            <option value="">Select event type</option>
            {SPEAKING_EVENT_TYPES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="sp-topic">Preferred topic</label>
          <select
            id="sp-topic"
            value={preferredTopic}
            onChange={(e) => setPreferredTopic(e.target.value)}
            required
          >
            <option value="">Select topic</option>
            {SPEAKING_PREFERRED_TOPICS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-grid-2">
        <div className="form-field">
          <label htmlFor="sp-date">Event date</label>
          <input id="sp-date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="sp-location">Location</label>
          <input id="sp-location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="sp-msg">Tell me more about your event and audience</label>
        <textarea id="sp-msg" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-secondary" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send enquiry"}
      </button>
      {msg ? (
        <p className={`form-msg ${status === "ok" ? "form-msg--ok" : "form-msg--err"}`}>{msg}</p>
      ) : null}
    </form>
  );
}
