import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Playfair_Display } from "next/font/google";
import { getSiteUrl, getSocialSameAs } from "@/lib/data/site";
import { SITE_IMAGES } from "@/lib/data/site-images";
import { LoveResetSlideIn } from "@/components/landing/LoveResetSlideIn";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const SITE_DESCRIPTION =
  "Real conversations for real marriages. Marriage and relationships mentor, speaker, and experience curator based in London.";

const SITE_TITLE_DEFAULT = "Tobi Yusuf · Marriage, Relationships & Identity";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: SITE_IMAGES.favicon,
    apple: SITE_IMAGES.appleTouchIcon,
  },
  title: {
    default: SITE_TITLE_DEFAULT,
    template: "%s | Tobi Yusuf",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Tobi Yusuf",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    url: "/",
    images: [
      {
        url: SITE_IMAGES.img1,
        alt: "Tobi Yusuf, marriage and relationships",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [SITE_IMAGES.img1],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl();
  const sameAs = getSocialSameAs();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Tobi Yusuf",
        url: siteUrl,
        description: SITE_DESCRIPTION,
      },
      {
        "@type": "Person",
        name: "Tobi Yusuf",
        url: siteUrl,
        jobTitle:
          "Marriage and relationships mentor, speaker, and experience curator",
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
    ],
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${playfair.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <LoveResetSlideIn />
      </body>
    </html>
  );
}
