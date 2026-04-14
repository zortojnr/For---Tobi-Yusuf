"use client";

import { useState } from "react";

export function SpeakingForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
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
      setMsg("Thank you. We will be in touch.");
      setEmail("");
      setFirstName("");
      setMessage("");
    } catch {
      setStatus("err");
      setMsg("Network error.");
    }
  }

  return (
    <form className="form-panel animate-in" onSubmit={onSubmit}>
      <p className="form-category-label" style={{ fontSize: "0.9rem", marginBottom: "1.5rem", color: "var(--anchor)", fontWeight: "600" }}>Speaking Enquiry</p>
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
        <label htmlFor="sp-msg">Event details (optional)</label>
        <textarea
          id="sp-msg"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-secondary" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Submit speaking enquiry"}
      </button>
      {msg ? (
        <p className={`form-msg ${status === "ok" ? "form-msg--ok" : "form-msg--err"}`}>{msg}</p>
      ) : null}
    </form>
  );
}
