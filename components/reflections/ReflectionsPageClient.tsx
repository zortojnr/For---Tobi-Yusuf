"use client";

import Image from "next/image";
import Link from "next/link";
import { reflections } from "@/lib/data/reflections";
import {
  SUBSTACK_PUBLICATION_SUBSCRIBE_URL,
  substackPostUrl,
} from "@/lib/data/site";
import { SITE_IMAGES } from "@/lib/data/site-images";
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
          <div className="reflections-page-hero-image">
            <div
              className="reflections-page-hero-bg"
              style={{ backgroundImage: `url(${SITE_IMAGES.siteLogo})` }}
              aria-hidden
            />
            <div className="reflections-page-hero-scrim" />
          </div>
          <div className="reflections-page-hero-copy section--narrow reflections-page-hero-copy-inner">
            <p className="reflections-hero-brand">Tobi Yusuf</p>
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
            <div className="reflections-subscribe-only">
              <SubstackNativeSubscribe />
            </div>
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
                  <ReflectionCardTail />
                </article>
              ))}
            </div>
          </div>

          <div className="reflections-cta-block animate-in">
            <p className="reflections-cta-quote">
              If these words landed, there is a room waiting for you.
            </p>
            <div className="reflections-cta-btns">
              <Link href="/#experiences" className="btn btn-terracotta">
                Join an Upcoming Experience
              </Link>
              <SubstackNativeSubscribe />
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

const SUBSTACK_ICON_SRC =
  "https://substackcdn.com/image/fetch/w_96,c_limit,f_auto,q_auto:good/https%3A%2F%2Fsubstack.com%2Fimg%2Fsubstack-app-icon.png";

function SubstackNativeSubscribe() {
  return (
    <a
      href={SUBSTACK_PUBLICATION_SUBSCRIBE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="substack-native-subscribe"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Substack-hosted icon URL */}
      <img
        src={SUBSTACK_ICON_SRC}
        width={18}
        height={18}
        alt=""
        className="substack-native-subscribe-icon"
      />
      Subscribe
    </a>
  );
}

function ReflectionCardTail() {
  return (
    <div className="reflection-card-tail">
      <p className="reflection-card-cta-lead">If this reflection resonates with you:</p>
      <div className="reflection-card-cta-links">
        <Link href="/#experiences">Join an upcoming experience</Link>
        <Link href="/book/intentional-space">Attend Intentional Space</Link>
        <a href={SUBSTACK_PUBLICATION_SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer">
          Subscribe for weekly reflections
        </a>
      </div>
      <p className="reflection-card-bio-label">About Tobi Yusuf</p>
      <div className="reflection-card-bio body-text">
        <p>
          Tobi Yusuf is a Relational and Cultural Intelligence Advisor who helps
          individuals, couples, and organisations understand the patterns that shape how
          we communicate, connect, and navigate conflict.
        </p>
        <p>
          Through speaking engagements, curated experiences, and intentional
          conversations, she explores the intersection between emotional intelligence,
          relational dynamics, and cultural understanding.
        </p>
        <p>
          Her work spans both personal and professional environments, from helping couples
          recognise the communication patterns influencing their marriages to supporting
          organisations in developing greater cultural awareness and relational
          intelligence within diverse teams.
        </p>
        <p>
          Tobi is also the host of intimate gatherings and experiences that create space
          for honest reflection and meaningful dialogue around relationships, identity, and
          connection.
        </p>
        <p>
          Her work is grounded in a simple belief: the patterns that shape our most
          personal relationships often appear in the spaces where we work, lead, and
          collaborate.
        </p>
      </div>
    </div>
  );
}
