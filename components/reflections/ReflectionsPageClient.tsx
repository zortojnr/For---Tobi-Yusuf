"use client";

import Link from "next/link";
import { reflections } from "@/lib/data/reflections";
import {
  SUBSTACK_PUBLICATION_SUBSCRIBE_URL,
  substackPostUrl,
} from "@/lib/data/site";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { useAnimateIn } from "@/components/landing/useAnimateIn";
import { HeroSection } from "@/components/reflections/HeroSection";

export function ReflectionsPageClient() {
  useAnimateIn();

  return (
    <>
      <SiteNav />
      <main>
        <HeroSection />

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

            <aside className="reflections-about-strip animate-in" aria-label="About the author">
              <p className="reflections-about-strip-label">About Tobi Yusuf</p>
              <div className="reflections-about-strip-body body-text">
                <p>
                  Tobi Yusuf is a Relational and Cultural Intelligence Advisor who helps
                  individuals, couples, and organisations understand the patterns that shape how
                  we communicate, connect, and navigate conflict.
                </p>
                <p>
                  Her work is grounded in a simple belief: the patterns that shape our most
                  personal relationships often appear in the spaces where we work, lead, and
                  collaborate.
                </p>
              </div>
            </aside>
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

