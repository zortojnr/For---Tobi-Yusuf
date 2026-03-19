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
              sizes="100vw"
            />
            <div className="reflections-page-hero-scrim" />
          </div>
          <div className="reflections-page-hero-copy section--narrow">
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

        {/* SITE_IMAGES.img2 — use #2: reflections divider (use #1: home speaking) */}
        <div className="reflections-page-strip section--narrow">
          <SiteImage src={SITE_IMAGES.img2} alt="" ratio="21/6" sizes="100vw" />
        </div>

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

          {/* SITE_IMAGES.img5 — use #2: reflections mid strip (use #1: home testimonials) */}
          <div className="reflections-page-strip section--narrow">
            <SiteImage src={SITE_IMAGES.img5} alt="" ratio="21/7" sizes="100vw" />
          </div>

          <div className="reflections-cta-block animate-in">
            <p className="reflections-cta-quote">
              If these words landed — there&apos;s a room waiting for you.
            </p>
            <div className="reflections-cta-btns">
              <a href="/#experiences" className="btn btn-terracotta">
                Join an Upcoming Experience
              </a>
              <a href={SUBSTACK_SUBSCRIBE_URL} className="btn btn-ghost-light">
                Subscribe for Weekly Reflections
              </a>
            </div>
          </div>
        </section>

        {/* SITE_IMAGES.img6 — use #2: reflections footer band (use #1: home hero bg) */}
        <div className="reflections-page-footer-band" aria-hidden>
          <div className="reflections-page-footer-band-bg" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
