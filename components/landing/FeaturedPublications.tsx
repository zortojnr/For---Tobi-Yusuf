"use client";

import Image from "next/image";
import { FEATURED_PUBLICATIONS } from "@/lib/data/publications";

export function FeaturedPublications() {
  return (
    <section
      className="press-section"
      aria-label="Publications and media"
    >
      <div className="press-section-inner section--narrow">
        <p className="section-label press-section-label">As seen in</p>
        <div className="terracotta-rule terracotta-rule--center press-section-rule" />
        <ul className="press-grid">
          {FEATURED_PUBLICATIONS.map((pub) => {
            const inner = (
              <>
                {pub.logoSrc ? (
                  <span className="press-logo-frame">
                    <Image
                      src={pub.logoSrc}
                      alt={pub.name}
                      fill
                      className="press-logo-img"
                      sizes="(max-width: 768px) 40vw, 180px"
                    />
                  </span>
                ) : (
                  <span className="press-name-fallback">{pub.name}</span>
                )}
              </>
            );

            const className = "press-item animate-in";

            if (pub.href) {
              return (
                <li key={pub.id} className={className}>
                  <a
                    href={pub.href}
                    className="press-item-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {inner}
                  </a>
                </li>
              );
            }

            return (
              <li key={pub.id} className={className}>
                <div className="press-item-static">{inner}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
