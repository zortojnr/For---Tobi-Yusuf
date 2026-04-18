"use client";

import { useCallback, useEffect, useMemo, useState, type TouchEvent } from "react";
import Image from "next/image";
import { SiteImage } from "@/components/site/SiteImage";
import { SITE_IMAGES } from "@/lib/data/site-images";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { useAnimateIn } from "@/components/landing/useAnimateIn";
import { SpeakingForm } from "@/components/landing/SpeakingForm";
import { ConversationsClosingSection } from "@/components/landing/ConversationsClosingSection";
import { INSTAGRAM_URL } from "@/lib/data/site";

const TOPICS: { index: string; title: string; body: string; audience: string }[] = [
  {
    index: "01",
    title: "From the Bedroom to the Boardroom",
    body: "Why the patterns that shape our most personal relationships show up in the spaces where we work, lead, and collaborate. The hidden cost of relational stress on workplace performance. Why organisations that care about productivity should care about the whole person.",
    audience:
      "Ideal for HR leaders, L&D teams, Corporate leadership summits and Employee wellbeing conferences",
  },
  {
    index: "02",
    title: "Cultural Intelligence in Practice",
    body: "Moving beyond diversity statements to operational cultural competence. What happens when your organisation, your venue, or your team actually encounters a culture it does not understand. Practical insight rooted in real world experience.",
    audience: "Ideal for Corporate organisations, Hospitality and events businesses, DEI events and Universities",
  },
  {
    index: "03",
    title: "Relational Intelligence for the Next Generation",
    body: "Understanding communication patterns, emotional maturity, and healthy relationships before marriage. What nobody teaches you about love, conflict, and partnership before you are in one.",
    audience: "Ideal for Universities, Student unions, Young professionals networks and Faith based communities",
  },
];

const HERO_AUTOPLAY_MS = 6200;
const HERO_SWIPE_THRESHOLD = 56;

const HERO_SLIDES: {
  image: string;
  title: string;
  subtitle: string;
  note: string;
  ctaLabel: string;
  ctaHref: string;
}[] = [
  {
    image: "/assets/images/GSON3031.jpg",
    title: "Invite Tobi Into the Conversation",
    subtitle:
      "I speak at conferences, corporate events, faith-based gatherings, universities, and leadership programmes. My talks sit at the intersection of relational intelligence, cultural understanding, and the honest conversations most rooms are too polished to have.",
    note: "",
    ctaLabel: "Send a Speaking Enquiry",
    ctaHref: "#speaking-enquiry",
  },
  {
    image: "/assets/images/GSON8453.JPG",
    title: "From the Bedroom to the Boardroom",
    subtitle:
      "The patterns that shape our most personal relationships don’t stay at home, they follow us into every room we lead in, collaborate in, and build in. This talk explores the hidden cost of unresolved relational stress on workplace performance, and why organisations that care about their people should care about the whole person.",
    note: "",
    ctaLabel: "Send a Speaking Enquiry",
    ctaHref: "#speaking-enquiry",
  },
  {
    image: "/assets/images/GSON3097.jpg",
    title: "Cultural Intelligence in Practice",
    subtitle:
      "Most organisations have a diversity statement. Very few have the cultural competence to back it up. This talk moves beyond good intentions into the practical, operational understanding of how different cultures communicate, celebrate, and do business, rooted in real-world experience training venues, teams, and organisations through Luxury Meets Culture.",
    note: "",
    ctaLabel: "Send a Speaking Enquiry",
    ctaHref: "#speaking-enquiry",
  },
  {
    image: "/assets/images/GSON2809.jpg",
    title: "Relational Intelligence for the Next Generation",
    subtitle:
      "Nobody teaches you about communication patterns, emotional maturity, or how to choose a life partner wisely, until you’re already in crisis. This is a practical, honest session about love, conflict, partnership, and what no one explains early enough.",
    note: "",
    ctaLabel: "Send a Speaking Enquiry",
    ctaHref: "#speaking-enquiry",
  },
  {
    image: "/assets/images/GSON3081.jpg",
    title: "About Tobi",
    subtitle:
      "I’m a wife of 14 years, a mother of three daughters, and the founder of RIAH and Luxury Meets Culture. I don’t speak from theory, I speak from a marriage I’m still building, an industry I’m still challenging, and rooms I’ve sat in with real couples navigating real patterns. My talks bridge lived experience with practical insight, so audiences leave not just inspired but genuinely changed in how they see their relationships and their work.",
    note: "",
    ctaLabel: "Connect With Me",
    ctaHref: INSTAGRAM_URL,
  },
];

export function SpeakingPageClient() {
  useAnimateIn();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const active = HERO_SLIDES[activeSlide];
  const isExternalCta = useMemo(() => /^https?:\/\//.test(active.ctaHref), [active.ctaHref]);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isHovering) return;
    const timer = window.setInterval(nextSlide, HERO_AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [isHovering, nextSlide]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") nextSlide();
      if (event.key === "ArrowLeft") prevSlide();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nextSlide, prevSlide]);

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    setTouchEndX(null);
    setTouchStartX(event.targetTouches[0]?.clientX ?? null);
  };

  const handleTouchMove = (event: TouchEvent<HTMLElement>) => {
    setTouchEndX(event.targetTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > HERO_SWIPE_THRESHOLD) nextSlide();
    if (distance < -HERO_SWIPE_THRESHOLD) prevSlide();
  };

  return (
    <>
      <SiteNav />
      <main className="speaking-page-body">
        <section
          className="speaking-hero-slider"
          aria-label="Speaking hero slideshow"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="speaking-hero-slider-media" aria-hidden>
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.image}
                className={`speaking-hero-slide ${index === activeSlide ? "is-active" : ""}`}
              >
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="speaking-hero-slide-img"
                />
              </div>
            ))}
            <div className="speaking-hero-slider-scrim" />
          </div>

          <div className="speaking-hero-slider-inner">
            <p className="speaking-hero-slider-kicker">Speaking</p>
            <h1 className="speaking-hero-slider-title">{active.title}</h1>
            <p className="speaking-hero-slider-subtitle">{active.subtitle}</p>
            {active.note ? <p className="speaking-hero-slider-note">{active.note}</p> : null}
            <a
              className="speaking-hero-cta-btn"
              href={active.ctaHref}
              target={isExternalCta ? "_blank" : undefined}
              rel={isExternalCta ? "noreferrer" : undefined}
            >
              {active.ctaLabel}
            </a>

            <div className="speaking-hero-slider-progress" aria-hidden>
              <div key={activeSlide} className="speaking-hero-slider-progress-bar" />
            </div>
          </div>

          <div className="speaking-hero-slider-nav" aria-label="Hero slide controls">
            <button type="button" className="speaking-hero-nav-btn" onClick={prevSlide} aria-label="Previous slide">
              <span aria-hidden>←</span>
            </button>
            <button type="button" className="speaking-hero-nav-btn" onClick={nextSlide} aria-label="Next slide">
              <span aria-hidden>→</span>
            </button>
          </div>
        </section>

        <section
          id="speaking-enquiry"
          className="section form-section speaking-section"
          aria-label="Speaking topics and enquiry form"
        >
          <header className="section--narrow speaking-page-masthead animate-in">
            <p className="section-label">Talks &amp; programmes</p>
            <div className="terracotta-rule terracotta-rule--center speaking-page-masthead-rule" />
            <h2 className="display-md speaking-page-masthead-title" style={{ color: "var(--anchor)" }}>
              The Conversations I Bring Into the Room
            </h2>
            <p className="speaking-page-lead">
              I speak at conferences, corporate events, faith-based gatherings, universities, and
              leadership programmes. My talks sit at the intersection of relational intelligence,
              cultural understanding, and the honest conversations most rooms are too polished to
              have.
            </p>
          </header>
          <div className="speaking-split">
            <div className="speaking-split-copy">
              <div className="speaking-topics">
                {TOPICS.map((t) => (
                  <article key={t.index} className="speaking-topic-card animate-in">
                    <span className="speaking-topic-index" aria-hidden>
                      {t.index}
                    </span>
                    <h3 className="speaking-topic-title">{t.title}</h3>
                    <p className="body-text speaking-topic-body">{t.body}</p>
                    <p className="speaking-topic-audience">
                      <strong>Ideal for:</strong> {t.audience}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            <div className="speaking-split-image speaking-split-image--page animate-in">
              <SiteImage
                src={SITE_IMAGES.img2}
                alt=""
                ratio="3/4"
                sizes="(max-width: 900px) 100vw, 380px"
                className="image-dim"
              />
            </div>
          </div>
          <div className="speaking-enquiry-split animate-in">
            <div className="speaking-enquiry-panel speaking-enquiry-panel--split">
              <p className="speaking-enquiry-label">Speaking enquiry</p>
              <SpeakingForm />
            </div>
            <div className="speaking-enquiry-visual">
              <Image
                src="/assets/images/yes(1).jpeg"
                alt=""
                width={1066}
                height={1600}
                sizes="(max-width: 900px) 100vw, min(520px, 46vw)"
                className="speaking-enquiry-photo"
              />
            </div>
          </div>
        </section>
      </main>
      <ConversationsClosingSection />
      <SiteFooter />
    </>
  );
}
