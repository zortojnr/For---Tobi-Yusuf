"use client";

import { useState, type FormEvent } from "react";
import { markLoveResetSubscribed } from "@/lib/love-reset-prompt-storage";

export type LoveResetSubscribeFormVariant = "section" | "slide";

type Props = {
  variant: LoveResetSubscribeFormVariant;
  idPrefix: string;
  onSuccess?: () => void;
  className?: string;
};

export function LoveResetSubscribeForm({ variant, idPrefix, onSuccess, className = "" }: Props) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "love-reset",
          firstName: firstName.trim(),
          email: email.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("err");
        setMsg(
          typeof data.error === "string"
            ? data.error
            : "Something went wrong. Please try again.",
        );
        return;
      }
      markLoveResetSubscribed();
      setStatus("ok");
      setMsg("You’re in—check your email.");
      setFirstName("");
      setEmail("");
      onSuccess?.();
    } catch {
      setStatus("err");
      setMsg("Network error.");
    }
  }

  const formClass =
    variant === "slide"
      ? `love-reset-slide-form ${className}`.trim()
      : `love-reset-section-form ${className}`.trim();

  if (status === "ok") {
    return (
      <p className={`form-msg form-msg--ok love-reset-form-msg ${variant === "slide" ? "love-reset-form-msg--slide" : ""}`}>
        {msg}
      </p>
    );
  }

  return (
    <form className={formClass} onSubmit={onSubmit}>
      <div className="form-grid-2 love-reset-form-grid">
        <div className="form-field">
          <label htmlFor={`${idPrefix}-first`}>First name</label>
          <input
            id={`${idPrefix}-first`}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
        </div>
        <div className="form-field">
          <label htmlFor={`${idPrefix}-email`}>Email</label>
          <input
            id={`${idPrefix}-email`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
      </div>
      <button
        type="submit"
        className={variant === "slide" ? "btn btn-secondary love-reset-slide-submit" : "btn btn-secondary"}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Sending…" : "Send Me the Audio"}
      </button>
      <p className="love-reset-form-trust">Your details are safe. Unsubscribe anytime.</p>
      {msg ? (
        <p className={`form-msg ${status === "err" ? "form-msg--err" : "form-msg--ok"}`}>{msg}</p>
      ) : null}
    </form>
  );
}
