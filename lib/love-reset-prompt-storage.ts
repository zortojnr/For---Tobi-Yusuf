const PREFIX = "tobi_lr_v1";

const SUBSCRIBED = `${PREFIX}_subscribed`;
const DISMISSED_AT = `${PREFIX}_dismissed_at`;
const SESSION_SHOWN = `${PREFIX}_slide_shown`;

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function isLoveResetSubscribed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SUBSCRIBED) === "1";
  } catch {
    return false;
  }
}

export function isLoveResetDismissedWithin7Days(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(DISMISSED_AT);
    if (!raw) return false;
    const t = Date.parse(raw);
    if (Number.isNaN(t)) return false;
    return Date.now() - t < SEVEN_DAYS_MS;
  } catch {
    return false;
  }
}

export function hasLoveResetSlideBeenShownThisSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SESSION_SHOWN) === "1";
  } catch {
    return false;
  }
}

/** True if the slide-in should never arm or show. */
export function shouldSuppressLoveResetSlide(): boolean {
  return (
    isLoveResetSubscribed() ||
    isLoveResetDismissedWithin7Days() ||
    hasLoveResetSlideBeenShownThisSession()
  );
}

export function markLoveResetSubscribed(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SUBSCRIBED, "1");
  } catch {
    /* ignore quota */
  }
}

export function markLoveResetDismissed(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DISMISSED_AT, new Date().toISOString());
  } catch {
    /* ignore */
  }
}

export function markLoveResetSlideShownThisSession(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_SHOWN, "1");
  } catch {
    /* ignore */
  }
}
