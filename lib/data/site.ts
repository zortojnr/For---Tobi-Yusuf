/**
 * Public URLs and editable site copy.
 * UPDATE: Replace placeholders before go-live (Ticket Candy, Substack, Instagram, etc.)
 */

/**
 * Canonical site origin for sitemap, robots, and metadata (no trailing slash).
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://www.tobiyusuf.com).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const origin = vercel.startsWith("http") ? vercel : `https://${vercel}`;
    return origin.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "production") {
    return "https://www.tobiyusuf.com";
  }
  return "http://localhost:3000";
}

/** Places remaining for Intentional Space — easy to change */
export const INTENTIONAL_SPACE_REMAINING_PLACES = 10;

const DEFAULT_SCHEDULING_URL = "https://therelatablewife.as.me/";

/** Acuity scheduling (primary “Book” CTA). Override via env without code changes. */
export const SCHEDULING_URL =
  process.env.NEXT_PUBLIC_SCHEDULING_URL?.trim() || DEFAULT_SCHEDULING_URL;

/**
 * Legacy name — falls back to `SCHEDULING_URL` when `NEXT_PUBLIC_TICKET_CANDY_URL` is unset.
 */
export const TICKET_CANDY_INTENTIONAL_SPACE_URL =
  process.env.NEXT_PUBLIC_TICKET_CANDY_URL?.trim() || SCHEDULING_URL;

/** Contact form notifications (Resend `to` address) */
export const CONTACT_NOTIFICATION_EMAIL = "tobi@tobiyusuf.com";

/** UPDATE: Substack publication subscribe URL */
export const SUBSTACK_SUBSCRIBE_URL =
  process.env.NEXT_PUBLIC_SUBSTACK_URL || "#reflections";

/** UPDATE: Instagram profile */
export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#footer";

/** Public http(s) profile URLs for JSON-LD `sameAs` when env vars are set. */
export function getSocialSameAs(): string[] {
  const urls: string[] = [];
  if (SUBSTACK_SUBSCRIBE_URL.startsWith("http")) {
    urls.push(SUBSTACK_SUBSCRIBE_URL);
  }
  if (INSTAGRAM_URL.startsWith("http")) {
    urls.push(INSTAGRAM_URL);
  }
  return urls;
}

export function substackPostUrl(pathOrFull: string): string {
  if (!pathOrFull) return SUBSTACK_SUBSCRIBE_URL;
  if (pathOrFull.startsWith("http")) return pathOrFull;
  const base = process.env.NEXT_PUBLIC_SUBSTACK_URL?.replace(/\/$/, "") || "";
  if (!base) return "#reflections";
  return `${base}${pathOrFull.startsWith("/") ? "" : "/"}${pathOrFull}`;
}
