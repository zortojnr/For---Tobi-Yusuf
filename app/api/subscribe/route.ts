import { NextResponse } from "next/server";
import type { ConvertKitIntent } from "@/lib/convertkit-intents";

const API_KEY = process.env.CONVERTKIT_API_KEY;

const INTENT_TO_FORM_ENV: Record<ConvertKitIntent, string> = {
  "love-reset": "CONVERTKIT_FORM_LOVE_RESET",
  "intentional-space": "CONVERTKIT_FORM_INTENTIONAL_SPACE",
  "ct-collab": "CONVERTKIT_FORM_CT_COLLAB",
  "forever-day": "CONVERTKIT_FORM_FOREVER_DAY",
  "forever-table": "CONVERTKIT_FORM_FOREVER_TABLE",
  circle: "CONVERTKIT_FORM_CIRCLE",
  speaking: "CONVERTKIT_FORM_SPEAKING",
  general: "CONVERTKIT_FORM_GENERAL",
  newsletter: "CONVERTKIT_FORM_NEWSLETTER",
};

const INTENT_TAG_NAMES: Record<ConvertKitIntent, string> = {
  "love-reset": "Love Reset Download",
  "intentional-space": "Intentional Space",
  "ct-collab": "CT Collaboration",
  "forever-day": "Forever & A Day",
  "forever-table": "Forever Table",
  circle: "Choosing Us Waitlist",
  speaking: "Speaking",
  general: "General Enquiry",
  newsletter: "Newsletter",
};

/**
 * Custom field slug in Kit (Settings → Subscriber data). Used in emails as a merge tag
 * so messages can reference what the subscriber opted into. Intent always sets this
 * value on form subscribe (client cannot override).
 */
const SUBSCRIPTION_SUBJECT_CK_FIELD = "subscription_subject";

function getFormId(intent: ConvertKitIntent): string | undefined {
  const key = INTENT_TO_FORM_ENV[intent];
  const specific = key ? process.env[key] : undefined;
  if (specific && /^\d+$/.test(specific.trim())) return specific.trim();
  const fallback = process.env.CONVERTKIT_DEFAULT_FORM_ID?.trim();
  if (fallback && /^\d+$/.test(fallback)) return fallback;
  return undefined;
}

function getTagIdForIntent(intent: ConvertKitIntent): string | undefined {
  const envKey = `CONVERTKIT_TAG_ID_${intent.toUpperCase().replace(/-/g, "_")}`;
  const v = process.env[envKey]?.trim();
  if (v && /^\d+$/.test(v)) return v;
  return undefined;
}

function sanitizeFields(
  input: unknown,
): Record<string, string> | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return undefined;
  }
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (typeof k !== "string" || k.length > 80) continue;
    if (typeof v !== "string") continue;
    const t = v.trim();
    if (!t) continue;
    if (t.length > 8000) continue;
    out[k] = t;
  }
  return Object.keys(out).length ? out : undefined;
}

async function subscribeToForm(
  formId: string,
  apiKey: string,
  email: string,
  firstName: string,
  fields?: Record<string, string>,
): Promise<{ ok: boolean; body: unknown }> {
  const body: Record<string, unknown> = {
    api_key: apiKey,
    email,
    first_name: firstName,
  };
  if (fields && Object.keys(fields).length > 0) {
    body.fields = fields;
  }
  const res = await fetch(
    `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  let responseBody: unknown = null;
  try {
    responseBody = await res.json();
  } catch {
    responseBody = null;
  }
  return { ok: res.ok, body: responseBody };
}

async function subscribeToTag(
  tagId: string,
  apiKey: string,
  email: string,
  firstName: string,
): Promise<{ ok: boolean; body: unknown }> {
  const res = await fetch(
    `https://api.convertkit.com/v3/tags/${tagId}/subscribe`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        email,
        first_name: firstName,
      }),
    },
  );
  let responseBody: unknown = null;
  try {
    responseBody = await res.json();
  } catch {
    responseBody = null;
  }
  return { ok: res.ok, body: responseBody };
}

export async function POST(request: Request) {
  const apiKey = API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "ConvertKit is not configured (CONVERTKIT_API_KEY)." },
      { status: 503 },
    );
  }

  let json: {
    intent?: string;
    email?: string;
    firstName?: string;
    fields?: Record<string, string>;
  };
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof json.email === "string" ? json.email.trim() : "";
  const firstName =
    typeof json.firstName === "string" ? json.firstName.trim() : "";
  const intent = json.intent as ConvertKitIntent | undefined;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  if (!firstName) {
    return NextResponse.json({ error: "First name required" }, { status: 400 });
  }

  const validIntents = Object.keys(INTENT_TO_FORM_ENV) as ConvertKitIntent[];
  if (!intent || !validIntents.includes(intent)) {
    return NextResponse.json({ error: "Invalid intent" }, { status: 400 });
  }

  const extra = sanitizeFields(json.fields);
  const ckFields: Record<string, string> = extra ? { ...extra } : {};
  delete ckFields.email;
  delete ckFields.first_name;
  ckFields[SUBSCRIPTION_SUBJECT_CK_FIELD] = INTENT_TAG_NAMES[intent];

  const formId = getFormId(intent);
  const tagId = getTagIdForIntent(intent);

  if (!formId && !tagId) {
    return NextResponse.json(
      {
        error:
          "No ConvertKit form or tag ID configured for this intent. Set CONVERTKIT_DEFAULT_FORM_ID or per-intent CONVERTKIT_FORM_* / CONVERTKIT_TAG_ID_* in .env.local.",
        intent,
        tagName: INTENT_TAG_NAMES[intent],
      },
      { status: 501 },
    );
  }

  if (formId) {
    const sub = await subscribeToForm(
      formId,
      apiKey,
      email,
      firstName,
      ckFields,
    );
    if (!sub.ok) {
      return NextResponse.json(
        { error: "ConvertKit subscribe failed", detail: sub.body },
        { status: 502 },
      );
    }
  }

  if (tagId) {
    const tagSub = await subscribeToTag(tagId, apiKey, email, firstName);
    if (!tagSub.ok) {
      return NextResponse.json(
        { error: "ConvertKit tag subscribe failed", detail: tagSub.body },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ success: true });
}
