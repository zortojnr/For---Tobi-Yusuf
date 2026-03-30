"use client";

import { useMemo, useState } from "react";
import type { BookingField } from "@/lib/booking/loadBookingConfig";

type Props = {
  fields: BookingField[];
};

export function IntentionalSpaceBookingForm({ fields }: Props) {
  const initial = useMemo(() => {
    const o: Record<string, string> = {};
    for (const f of fields) o[f.id] = "";
    return o;
  }, [fields]);

  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  function set(id: string, v: string) {
    setValues((prev) => ({ ...prev, [id]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");

    const firstName = (values.first_name ?? "").trim();
    const email = (values.email ?? "").trim();
    if (!firstName || !email) {
      setStatus("err");
      setMsg("First name and email are required.");
      return;
    }

    const ckFields: Record<string, string> = {};
    for (const f of fields) {
      if (f.id === "first_name" || f.id === "email") continue;
      const v = (values[f.id] ?? "").trim();
      if (v) ckFields[f.ck_key] = v;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "intentional-space",
          email,
          firstName,
          fields: ckFields,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("err");
        setMsg(data.error || "Something went wrong.");
        return;
      }
      setStatus("ok");
      setMsg("Thank you. We have received your details. Check your inbox for next steps.");
      setValues(initial);
    } catch {
      setStatus("err");
      setMsg("Network error. Please try again.");
    }
  }

  return (
    <form className="booking-form" onSubmit={onSubmit}>
      <div className="booking-form-grid">
        {fields.map((f) => (
          <div key={f.id} className="form-field">
            <label htmlFor={`bk-${f.id}`}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                id={`bk-${f.id}`}
                name={f.id}
                rows={4}
                value={values[f.id] ?? ""}
                onChange={(e) => set(f.id, e.target.value)}
                required={f.required}
                disabled={status === "ok"}
              />
            ) : (
              <input
                id={`bk-${f.id}`}
                name={f.id}
                type={f.type === "email" ? "email" : f.type === "tel" ? "tel" : "text"}
                value={values[f.id] ?? ""}
                onChange={(e) => set(f.id, e.target.value)}
                required={f.required}
                disabled={status === "ok"}
                autoComplete={
                  f.id === "email"
                    ? "email"
                    : f.id === "first_name"
                      ? "given-name"
                      : f.id === "last_name"
                        ? "family-name"
                        : f.id === "phone"
                          ? "tel"
                          : undefined
                }
              />
            )}
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "loading" || status === "ok"}
        style={{ marginTop: "1.5rem" }}
      >
        {status === "loading" ? "Submitting…" : status === "ok" ? "Submitted" : "Submit booking request"}
      </button>
      {msg ? (
        <p className={`form-msg ${status === "ok" ? "form-msg--ok" : "form-msg--err"}`}>{msg}</p>
      ) : null}
      <p className="body-text" style={{ fontSize: "0.8rem", marginTop: "1.25rem" }}>
        Use the &ldquo;Book your place (calendar)&rdquo; button on this page to reserve a
        spot. This form sends an express-interest request via ConvertKit; configure subscriber
        notifications in the Kit dashboard as needed.
      </p>
    </form>
  );
}
