"use client";

import { useState } from "react";
import type { ConvertKitIntent } from "@/lib/convertkit-intents";

type Props = {
  title: string;
  intent: ConvertKitIntent;
  isOpen: boolean;
  onClose: () => void;
};

export function ConvertKitModal({ title, intent, isOpen, onClose }: Props) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  if (!isOpen) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, email, firstName }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        success?: boolean;
      };
      if (!res.ok) {
        setStatus("err");
        setMsg(data.error || "Something went wrong.");
        return;
      }
      setStatus("ok");
      setMsg("Thank you — check your inbox.");
      setEmail("");
      setFirstName("");
    } catch {
      setStatus("err");
      setMsg("Network error. Try again.");
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ck-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 id="ck-modal-title" className="display-md" style={{ color: "var(--anchor)", marginBottom: "1rem" }}>
          {title}
        </h2>
        <p className="body-text" style={{ marginBottom: "1.25rem" }}>
          Leave your details and we&apos;ll be in touch.
        </p>
        <form onSubmit={onSubmit}>
          <div className="form-field">
            <label htmlFor="ck-first">First name</label>
            <input
              id="ck-first"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
            />
          </div>
          <div className="form-field">
            <label htmlFor="ck-email">Email</label>
            <input
              id="ck-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <button type="submit" className="btn btn-secondary" disabled={status === "loading"}>
            {status === "loading" ? "Sending…" : "Submit"}
          </button>
          {msg ? (
            <p className={`form-msg ${status === "ok" ? "form-msg--ok" : "form-msg--err"}`}>{msg}</p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
