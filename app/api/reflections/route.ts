import { NextResponse } from "next/server";

const SUBSTACK_FEED_URL = "https://mrstobiyusuf.substack.com/feed";

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, "/")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function extractTagContent(xml: string, tagName: string): string {
  const pattern = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = xml.match(pattern);
  if (!match) return "";

  return decodeHtmlEntities(match[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1").trim());
}

function normalizePost(itemXml: string) {
  const title = extractTagContent(itemXml, "title").replace(/\s+/g, " ").trim();
  const link = extractTagContent(itemXml, "link").replace(/\s+/g, " ").trim();
  const description =
    extractTagContent(itemXml, "description") ||
    extractTagContent(itemXml, "content:encoded") ||
    "";

  return {
    title,
    link,
    description,
  };
}

export async function GET() {
  try {
    const response = await fetch(SUBSTACK_FEED_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 900 },
    });

    if (!response.ok) {
      throw new Error(`Substack feed returned ${response.status}`);
    }

    const xml = await response.text();
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
      .map((match) => normalizePost(match[1]))
      .filter((item) => item.title && item.link)
      .slice(0, 10);

    return NextResponse.json({ posts: items });
  } catch (error) {
    console.error("[reflections feed]", error);
    return NextResponse.json({ error: "Could not load posts" }, { status: 502 });
  }
}
