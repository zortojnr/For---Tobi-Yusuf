"use client";

import Link from "next/link";
import { reflections } from "@/lib/data/reflections";
import { SUBSTACK_SUBSCRIBE_URL, substackPostUrl } from "@/lib/data/site";
import { SITE_IMAGES } from "@/lib/data/site-images";
import { SiteImage } from "@/components/site/SiteImage";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { useAnimateIn } from "@/components/landing/useAnimateIn";

export function ReflectionsPageClient() {
  useAnimateIn();

  return (
    <>
      <SiteNav />
      <main>
        <section className="reflections-page-hero">
          {/* SITE_IMAGES.gson8453 — use #1: reflections hero (use #2: home teaser) */}
          <div className="reflections-page-hero-image">
            <SiteImage
              src={SITE_IMAGES.gson8453}
              alt="Tobi Yusuf"
              ratio="16/9"
              priority
              sizes="(max-width: 768px) 100vw, min(100vw, 1100px)"
            />
            <div className="reflections-page-hero-scrim" />
          </div>
          <div className="reflections-page-hero-copy section--narrow reflections-page-hero-copy-inner">
            <p className="section-label" style={{ color: "var(--signature)" }}>
              Reflections
            </p>
            <div className="terracotta-rule" />
            <h1 className="display-md" style={{ color: "var(--anchor)" }}>
              Reflections
            </h1>
            <p className="reflections-intro">
              Over the years, I&apos;ve had many conversations with couples, women, and friends
              navigating different seasons of marriage. These reflections are observations and lessons
              drawn from real conversations and lived experiences.
            </p>
            <Link href={SUBSTACK_SUBSCRIBE_URL} className="btn btn-secondary">
              Get these reflections every Sunday →
            </Link>
          </div>
        </section>

        <section className="section reflections-section">
          <div className="section--narrow">
            <div className="reflections-grid">
              {reflections.map((r) => (
                <article key={r.title} className="animate-in reflection-card">
                  <p className="reflection-date">{r.date}</p>
                  <h2 className="reflection-title">{r.title}</h2>
                  <p className="reflection-excerpt">{r.excerpt}</p>
                  <a
                    className="reflection-link"
                    href={substackPostUrl(r.substackUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read on Substack →
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div className="reflections-cta-block animate-in">
            <p className="reflections-cta-quote">
              If these words landed — there&apos;s a room waiting for you.
            </p>
            <div className="reflections-cta-btns">
              <Link href="/#experiences" className="btn btn-terracotta">
                Join an Upcoming Experience
              </Link>
              <a href={SUBSTACK_SUBSCRIBE_URL} className="btn btn-ghost-light">
                Subscribe for Weekly Reflections
              </a>
            </div>
          </div>
        </section>

        {/* SITE_IMAGES.img6 — use #2: reflections footer band (use #1: home hero bg) */}
        <div className="reflections-page-footer-band" aria-hidden>
          <div className="reflections-page-footer-band-media">
            <Image
              src={SITE_IMAGES.img6}
              alt=""
              fill
              sizes="100vw"
              className="reflections-page-footer-band-img"
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
