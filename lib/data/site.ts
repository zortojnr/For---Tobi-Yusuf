/**
 * Public URLs and editable site copy.
 * UPDATE: Replace placeholders before go-live (Ticket Candy, Substack, Instagram, etc.)
 */

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

export function substackPostUrl(pathOrFull: string): string {
  if (!pathOrFull) return SUBSTACK_SUBSCRIBE_URL;
  if (pathOrFull.startsWith("http")) return pathOrFull;
  const base = process.env.NEXT_PUBLIC_SUBSTACK_URL?.replace(/\/$/, "") || "";
  if (!base) return "#reflections";
  return `${base}${pathOrFull.startsWith("/") ? "" : "/"}${pathOrFull}`;
}
