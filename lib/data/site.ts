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

const DEFAULT_TALLY_INTENTIONAL_SPACE_WAITLIST =
  "https://tally.so/r/J9DKpK";

/** Intentional Space waitlist (Tally). Override with `NEXT_PUBLIC_TALLY_INTENTIONAL_SPACE_WAITLIST_URL`. */
export const INTENTIONAL_SPACE_WAITLIST_TALLY_URL =
  process.env.NEXT_PUBLIC_TALLY_INTENTIONAL_SPACE_WAITLIST_URL?.trim() ||
  DEFAULT_TALLY_INTENTIONAL_SPACE_WAITLIST;

/** Contact form notifications (Resend `to` address) */
export const CONTACT_NOTIFICATION_EMAIL = "tobi@tobiyusuf.com";

const DEFAULT_SUBSTACK_URL =
  "https://substack.com/@mrstobiyusuf?r=72pimk&utm_medium=ios&utm_source=stories&shareImageVariant=light";

const DEFAULT_INSTAGRAM_URL =
  "https://www.instagram.com/mrstobiyusuf?igsh=NXU5N3p0Z2RyY2U3&utm_source=qr";

const DEFAULT_LINKEDIN_URL = "https://www.linkedin.com/in/tobi-yusuf-68813812b";

/** Substack publication / subscribe URL — override with `NEXT_PUBLIC_SUBSTACK_URL`. */
export const SUBSTACK_SUBSCRIBE_URL =
  process.env.NEXT_PUBLIC_SUBSTACK_URL?.trim() || DEFAULT_SUBSTACK_URL;

/** Official publication subscribe URL (native Substack subscribe button / pill). */
const DEFAULT_SUBSTACK_PUBLICATION_SUBSCRIBE =
  "https://mrstobiyusuf.substack.com/subscribe";

export const SUBSTACK_PUBLICATION_SUBSCRIBE_URL =
  process.env.NEXT_PUBLIC_SUBSTACK_PUBLICATION_SUBSCRIBE?.trim() ||
  DEFAULT_SUBSTACK_PUBLICATION_SUBSCRIBE;

/** Instagram profile — override with `NEXT_PUBLIC_INSTAGRAM_URL`. */
export const INSTAGRAM_URL =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || DEFAULT_INSTAGRAM_URL;

/** LinkedIn profile — override with `NEXT_PUBLIC_LINKEDIN_URL`. */
export const LINKEDIN_URL =
  process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() || DEFAULT_LINKEDIN_URL;

function substackJoinBase(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SUBSTACK_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (!SUBSTACK_SUBSCRIBE_URL.startsWith("http")) return "";
  try {
    const u = new URL(SUBSTACK_SUBSCRIBE_URL);
    return `${u.origin}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return "";
  }
}

/** Public http(s) profile URLs for JSON-LD `sameAs`. */
export function getSocialSameAs(): string[] {
  const urls: string[] = [];
  if (SUBSTACK_SUBSCRIBE_URL.startsWith("http")) {
    urls.push(SUBSTACK_SUBSCRIBE_URL);
  }
  if (INSTAGRAM_URL.startsWith("http")) {
    urls.push(INSTAGRAM_URL);
  }
  if (LINKEDIN_URL.startsWith("http")) {
    urls.push(LINKEDIN_URL);
  }
  return urls;
}

export function substackPostUrl(pathOrFull: string): string {
  if (!pathOrFull) return SUBSTACK_SUBSCRIBE_URL;
  if (pathOrFull.startsWith("http")) return pathOrFull;
  const base = substackJoinBase();
  if (!base) return SUBSTACK_SUBSCRIBE_URL;
  return `${base}${pathOrFull.startsWith("/") ? "" : "/"}${pathOrFull}`;
}
