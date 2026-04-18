/** Transactional Love Reset delivery email (Resend). */

const DEFAULT_AUDIO_URL = "https://lctobiyusuf.systeme.io/935600f7";

const DEFAULT_SUBJECT = "Your Love Reset Audio";

export function getLoveResetAudioUrl(): string {
  const fromEnv = process.env.LOVE_RESET_AUDIO_URL?.trim();
  if (fromEnv && /^https?:\/\//i.test(fromEnv)) {
    return fromEnv.replace(/\/$/, "");
  }
  return DEFAULT_AUDIO_URL;
}

export function getLoveResetEmailSubject(): string {
  const fromEnv = process.env.LOVE_RESET_EMAIL_SUBJECT?.trim();
  return fromEnv || DEFAULT_SUBJECT;
}

/** Comma-separated emails for optional internal copy of each signup. */
export function getLoveResetBccList(): string[] | undefined {
  const raw = process.env.LOVE_RESET_BCC?.trim();
  if (!raw) return undefined;
  const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
  return parts.length ? parts : undefined;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildLoveResetEmailContent(args: {
  firstName: string;
  audioUrl: string;
}): { subject: string; html: string; text: string } {
  const audioUrl = args.audioUrl.trim();
  const firstName = args.firstName.trim();
  const safeName = escapeHtml(firstName);
  const safeUrlAttr = escapeHtml(audioUrl);

  const subject = getLoveResetEmailSubject();

  const text = [
    `Hi ${firstName},`,
    ``,
    `Let this be your first step.`,
    ``,
    `The Love Reset Audio is a gentle 5-day audio experience. No cost, no fluff. It is designed to help you breathe, refocus, and return to yourself (and your marriage) with a little more clarity.`,
    ``,
    `Access your audio here:`,
    audioUrl,
    ``,
    `With care,`,
    `Tobi`,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#faf8f6;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.65;color:#3d1f2b;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f6;padding:32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border:1px solid rgba(61,31,43,0.12);">
        <tr>
          <td style="padding:36px 32px 40px;">
            <p style="margin:0 0 20px;">Hi ${safeName},</p>
            <p style="margin:0 0 16px;font-weight:600;">Let this be your first step.</p>
            <p style="margin:0 0 28px;color:#5c3d47;">The Love Reset Audio is a gentle 5-day audio experience. No cost, no fluff. It is designed to help you breathe, refocus, and return to yourself (and your marriage) with a little more clarity.</p>
            <p style="margin:0 0 12px;">
              <a href="${safeUrlAttr}" style="display:inline-block;padding:14px 28px;background:#3d1f2b;color:#faf8f6;text-decoration:none;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;font-family:system-ui,-apple-system,sans-serif;">Access your Love Reset Audio</a>
            </p>
            <p style="margin:0 0 32px;font-size:14px;word-break:break-all;">
              <a href="${safeUrlAttr}" style="color:#7a4f5a;">${safeUrlAttr}</a>
            </p>
            <p style="margin:0;color:#5c3d47;">With care,<br />Tobi</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  return { subject, html, text };
}
