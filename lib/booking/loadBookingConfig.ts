import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type BookingField = {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  required: boolean;
  /** ConvertKit custom field key (slug in Kit dashboard) */
  ck_key: string;
};

export type BookingPageConfig = {
  pageTitle: string;
  eventDate?: string;
  eventLocation?: string;
  fields: BookingField[];
  introHtml: string;
};

function mdToSimpleHtml(md: string): string {
  const lines = md.trim().split("\n");
  const out: string[] = [];
  let inPara: string[] = [];
  const flush = () => {
    if (inPara.length) {
      out.push(`<p class="body-text">${formatInline(inPara.join(" "))}</p>`);
      inPara = [];
    }
  };
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      flush();
      continue;
    }
    if (t.startsWith("- ")) {
      flush();
      out.push(`<p class="body-text">${formatInline(t.slice(2))}</p>`);
      continue;
    }
    inPara.push(t);
  }
  flush();
  return out.join("\n");
}

function formatInline(s: string): string {
  let x = s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
  return x;
}

export function loadIntentionalSpaceBookingConfig(): BookingPageConfig {
  const full = path.join(
    process.cwd(),
    "content",
    "intentional-space-booking.md",
  );
  const raw = fs.readFileSync(full, "utf8");
  const { data, content } = matter(raw);

  const fields = (data.fields ?? []) as BookingField[];
  const pageTitle =
    typeof data.pageTitle === "string" ? data.pageTitle : "Book Intentional Space";

  return {
    pageTitle,
    eventDate: typeof data.eventDate === "string" ? data.eventDate : undefined,
    eventLocation:
      typeof data.eventLocation === "string" ? data.eventLocation : undefined,
    fields,
    introHtml: mdToSimpleHtml(content),
  };
}
