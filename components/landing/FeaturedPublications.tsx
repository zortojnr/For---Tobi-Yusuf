"use client";

import { FEATURED_PUBLICATIONS } from "@/lib/data/publications";

export function FeaturedPublications() {
  const renderPublication = (pub: (typeof FEATURED_PUBLICATIONS)[number], keyPrefix: string) => {
    const inner = (
      <>
        {pub.logoSrc ? (
          <span className="press-logo-frame">
            {/* eslint-disable-next-line @next/next/no-img-element -- intrinsic sizing for varied logo assets */}
            <img src={pub.logoSrc} alt={pub.name} className="press-logo-img" loading="lazy" />
          </span>
        ) : (
          <span className="press-name-fallback">{pub.name}</span>
        )}
      </>
    );

    if (pub.href) {
      return (
        <li key={`${keyPrefix}-${pub.id}`} className="press-item animate-in">
          <a href={pub.href} className="press-item-link" target="_blank" rel="noopener noreferrer">
            {inner}
          </a>
        </li>
      );
    }

    return (
      <li key={`${keyPrefix}-${pub.id}`} className="press-item animate-in">
        <div className="press-item-static">{inner}</div>
      </li>
    );
  };

  return (
    <section className="press-section" aria-label="Publications and media">
      <div className="press-section-inner section--narrow">
        <p className="section-label press-section-label">As seen in</p>
        <div className="terracotta-rule terracotta-rule--center press-section-rule" />
        <div className="press-marquee" aria-label="Featured publications">
          <div className="press-marquee-track">
            <ul className="press-grid" aria-hidden={false}>
              {FEATURED_PUBLICATIONS.map((pub) => renderPublication(pub, "track-a"))}
            </ul>
            <ul className="press-grid" aria-hidden>
              {FEATURED_PUBLICATIONS.map((pub) => renderPublication(pub, "track-b"))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
