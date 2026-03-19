import Link from "next/link";
import { IntentionalSpaceBookingForm } from "@/components/booking/IntentionalSpaceBookingForm";
import { loadIntentionalSpaceBookingConfig } from "@/lib/booking/loadBookingConfig";
import { SITE_IMAGES } from "@/lib/data/site-images";
import { SiteImage } from "@/components/site/SiteImage";

export const metadata = {
  title: "Book Intentional Space — Tobi Yusuf",
  description: "Request a place at Intentional Space, London.",
};

export default function BookIntentionalSpacePage() {
  const config = loadIntentionalSpaceBookingConfig();

  return (
    <div className="booking-page">
      <header className="booking-page-header">
        <div className="booking-page-header-inner section--narrow">
          <Link href="/" className="booking-back">
            ← Back to home
          </Link>
          <h1 className="display-md" style={{ color: "var(--anchor)", marginTop: "1rem" }}>
            {config.pageTitle}
          </h1>
          {(config.eventDate || config.eventLocation) && (
            <p className="body-text" style={{ marginTop: "0.75rem" }}>
              {config.eventDate}
              {config.eventDate && config.eventLocation ? " · " : ""}
              {config.eventLocation}
            </p>
          )}
        </div>
      </header>

      {/* SITE_IMAGES.img1 — use #2: booking page intro strip (use #1: home urgent→proof strip) */}
      <div className="booking-strip-image section--narrow">
        <SiteImage
          src={SITE_IMAGES.img1}
          alt=""
          ratio="21/9"
          sizes="100vw"
        />
      </div>

      <div className="booking-layout section--narrow">
        <div className="booking-layout-main">
          <div
            className="booking-intro"
            dangerouslySetInnerHTML={{ __html: config.introHtml }}
          />
          <IntentionalSpaceBookingForm fields={config.fields} />
        </div>
        <aside className="booking-layout-aside" aria-label="Featured image">
          {/* SITE_IMAGES.img4 — use #2: booking aside (use #1: About on home) */}
          <SiteImage
            src={SITE_IMAGES.img4}
            alt="Tobi Yusuf"
            ratio="3/4"
            sizes="(max-width: 900px) 100vw, 360px"
          />
          {/* SITE_IMAGES.img3 — use #2: booking aside lower (use #1: home audio section) */}
          <SiteImage
            src={SITE_IMAGES.img3}
            alt=""
            ratio="4/3"
            sizes="(max-width: 900px) 100vw, 360px"
            className="booking-aside-second"
          />
        </aside>
      </div>
    </div>
  );
}
