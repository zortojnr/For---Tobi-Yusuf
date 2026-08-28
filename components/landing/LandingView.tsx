"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PRICES } from "@/lib/data/prices";
import {
  INTENTIONAL_SPACE_REMAINING_PLACES,
  INTENTIONAL_SPACE_WAITLIST_TALLY_URL,
  FOREVER_AND_A_DAY_TALLY_URL,
  FOREVER_TABLE_TALLY_URL,
  INSTAGRAM_URL,
  SCHEDULING_URL,
} from "@/lib/data/site";
import { SITE_IMAGES } from "@/lib/data/site-images";
import { SiteImage } from "@/components/site/SiteImage";
import { useAnimateIn } from "./useAnimateIn";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { FeaturedPublications } from "./FeaturedPublications";

const HERO_SLIDES = [
  { src: "/assets/images/6.webp",        position: "center 35%" },
  { src: "/assets/images/GSON3081.webp", position: "center 22%" },
  { src: "/assets/images/GSON3097.webp", position: "center 18%" },
];

const FAMILIAR_SLIDES = [
  { primary: "/assets/images/GSON2579.webp", fallback: "/assets/images/1.webp" },
  { primary: "/assets/images/GSON2657.webp", fallback: "/assets/images/2.webp" },
  { primary: "/assets/images/GSON2671.webp", fallback: "/assets/images/3.webp" },
];

function useCountUp(target: number, duration: number, active: boolean, reduced: boolean) {
  const [count, setCount] = useState(reduced ? target : 0);
  useEffect(() => {
    if (!active || reduced) {
      setCount(target);
      return;
    }
    setCount(0);
    const start = performance.now();
    let raf: number;
    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduced]);
  return count;
}

export function LandingView() {
  useAnimateIn();

  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonOffer, setComingSoonOffer] = useState("");
  const [activeFamiliarSlide, setActiveFamiliarSlide] = useState(0);
  const [failedFamiliarSlides, setFailedFamiliarSlides] = useState<number[]>([]);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [proofVisible, setProofVisible] = useState(false);
  const proofRef = useRef<HTMLElement>(null);

  const prefersReducedMotion = useReducedMotion() ?? false;

  const count2M = useCountUp(2, 1600, proofVisible, prefersReducedMotion);
  const count10places = useCountUp(10, 1400, proofVisible, prefersReducedMotion);
  const count10years = useCountUp(10, 1400, proofVisible, prefersReducedMotion);

  function isComingSoonOffer() {
    return false;
  }

  function openComingSoon(title: string) {
    setComingSoonOffer(title);
    setComingSoonOpen(true);
  }

  useEffect(() => {
    if (!comingSoonOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setComingSoonOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [comingSoonOpen]);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveFamiliarSlide((current) => (current + 1) % FAMILIAR_SLIDES.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const el = proofRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setProofVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SiteNav />
      <main>
        <section className="hero" aria-label="Introduction">
          {/* ── Left: editorial reading room ── */}
          <div className="hero-left">
            <p className="hero-eyebrow hero-anim-1">
              Marriage · Relationship · Identity
            </p>

            <h1 className="hero-headline hero-anim-2">
              Real conversations for real marriages.
            </h1>

            <p className="hero-role hero-anim-2b">
              Relational &amp; Cultural Intelligence Advisor | Speaker | Facilitator | Conversation Host
            </p>

            <p className="hero-body-text hero-anim-3">
              A luxury editorial space for couples seeking marriage counselling alternatives, premarital support, or a faith-led marriage mentor: honest, grounded conversation about marriage, identity, and the life you&apos;re building.
            </p>

            <div className="hero-ctas hero-anim-4">
              <a href="#experiences" className="btn btn-terracotta btn--sm">
                Explore Experiences
              </a>
              <a href="#about" className="btn btn-ghost-light btn--sm">
                About Tobi
              </a>
            </div>

            <p className="hero-attribution" aria-hidden>
              London · Since 2014
            </p>
          </div>

          {/* ── Right: photograph, edge to edge ── */}
          <div className="hero-right" aria-hidden>
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={slide.src}
                className={`hero-carousel-slide${i === activeHeroSlide ? " is-active" : ""}`}
              >
                <Image
                  src={slide.src}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(max-width: 820px) 100vw, 55vw"
                  className="hero-photo-img"
                  style={{ objectPosition: slide.position }}
                />
              </div>
            ))}
            <div className="hero-right-veil" />
          </div>

          <div className="hero-scroll" aria-hidden>
            <span className="hero-scroll-label">Scroll</span>
            <div className="hero-scroll-line" />
          </div>
        </section>

        <div className="urgent-banner">
          <p className="urgent-banner-inner">
            The next Intentional Space is coming July 2026.{" "}
            <a
              className="book-link"
              href={INTENTIONAL_SPACE_WAITLIST_TALLY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the waitlist to hear first.
            </a>
          </p>
        </div>

        <section className="proof-strip" aria-label="Impact" ref={proofRef}>
          <div className="proof-editorial">
            <div className="proof-stat animate-in">
              <span className="proof-stat-num">{count2M}M+</span>
              <p className="proof-stat-label">People in<br />this conversation</p>
            </div>
            <div className="proof-stat-divider" aria-hidden />
            <div className="proof-stat animate-in">
              <span className="proof-stat-num">{count10places}</span>
              <p className="proof-stat-label">Intimate places<br />per experience</p>
            </div>
            <div className="proof-stat-divider" aria-hidden />
            <div className="proof-stat animate-in">
              <span className="proof-stat-num">{count10years}+</span>
              <p className="proof-stat-label">Years of real<br />conversations</p>
            </div>
            <div className="proof-stat-divider" aria-hidden />
            <div className="proof-truth animate-in">
              <p>One guiding<br />principle:</p>
              <p className="proof-truth-word">truth.</p>
            </div>
          </div>
        </section>

        <FeaturedPublications />

        <div className="section-divider" aria-hidden />

        <section className="familiar-section" aria-labelledby="familiar-heading">
          {/* Bleed image — right 40%, absolute, fades left */}
          <div className="familiar-image-bleed" aria-hidden>
            {FAMILIAR_SLIDES.map((slide, index) => (
              <div
                key={slide.primary}
                className={`familiar-slide ${index === activeFamiliarSlide ? "is-active" : ""}`}
                aria-hidden
              >
                <Image
                  src={failedFamiliarSlides.includes(index) ? slide.fallback : slide.primary}
                  alt=""
                  fill
                  sizes="40vw"
                  className="familiar-slide-image"
                  onError={() => {
                    setFailedFamiliarSlides((current) =>
                      current.includes(index) ? current : [...current, index],
                    );
                  }}
                />
              </div>
            ))}
          </div>

          <div className="familiar-text-body section--narrow">
            <p className="familiar-kicker-new" id="familiar-heading">If this feels familiar</p>

            <div className="familiar-prose animate-in">
              <p>You love your spouse, but conversations often turn into misunderstandings.</p>
              <p>You find yourself repeating the same concerns, yet nothing seems to change.</p>
              <p>Sometimes you wonder if you are asking for too much, or if you have simply stopped saying certain things altogether.</p>
              <p>You may still care deeply, but the emotional connection feels different from how it once was.</p>
            </div>

            <p className="familiar-anchor reveal-whisper">
              If any of this feels familiar, you are not alone.
            </p>

            <div className="familiar-response animate-in">
              <p>My work creates space to understand the patterns behind these moments.</p>
              <p>Whether you&apos;ve been Googling marriage counselling, couples therapy, or how to save your marriage, you&apos;re in the right place.</p>
            </div>

            <div className="familiar-cta-row animate-in">
              <Link href="/reflections" className="btn btn-secondary">
                Read Reflections
              </Link>
              <a href="#experiences" className="btn btn-secondary">
                Explore Experiences
              </a>
            </div>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="about-grid">
            <div className="about-quote-col animate-in">
              {/* Portrait with spine label */}
              <div className="about-portrait-wrapper">
                <span className="about-portrait-spine" aria-hidden>Tobi Yusuf</span>
                {/* SITE_IMAGES.img4 — used twice: About on home and booking aside */}
                <div className="about-portrait about-portrait-frame reveal-scale">
                  <SiteImage
                    src={SITE_IMAGES.img4}
                    alt="Tobi Yusuf, faith-led marriage mentor and relationship guide"
                    ratio="3/4"
                    sizes="(max-width: 900px) 100vw, min(520px, 50vw)"
                  />
                </div>
              </div>

              <p className="about-faith">
                My work is grounded in faith. God is the foundation of everything I build.
              </p>
            </div>

            <div className="reveal-drift about-body">
              <blockquote className="about-quote">
                From the bedroom to the boardroom. I help people build the life that holds everything
                else together.
              </blockquote>
              <p className="body-text">
                I&apos;m Tobi Yusuf, wife of 14 years, mother of three daughters,
                speaker, and the woman your DMs already know. I talk about marriage
                the way most people only think about it. The silence. The patterns.
                The love that&apos;s still there but buried underneath everything you
                haven&apos;t said. I don&apos;t give advice. I create rooms: intimate, safe,
                honest rooms where couples and women can finally say the thing
                they&apos;ve been carrying.
              </p>
              <p className="body-text">
                My work is a faith-led alternative to traditional marriage counselling, for couples and women who want lived-experience guidance, not clinical advice.
              </p>
              <p className="body-text">
                I&apos;m also the founder of RIAH, luxury wedding planning for culturally
                rich couples, and Luxury Meets Culture, where I train venues,
                planners, and organisations in the cultural intelligence that turns
                good intentions into genuine inclusion.
              </p>
              <p className="body-text">
                Whether you join an experience, read the Sunday reflections, or sit
                with me privately, the invitation is always the same: be honest. And
                let&apos;s go from there.
              </p>
              <a href="#offers" className="btn btn-secondary" style={{ marginTop: "1.5rem" }}>
                explore what I&apos;m building
              </a>
            </div>
          </div>
        </section>

        <div className="section-divider" aria-hidden />

        <section className="work-pillars-section" aria-labelledby="work-pillars-heading">
          <div className="work-pillars-inner section--narrow">
            <p className="work-pillars-label reveal-whisper" aria-hidden>The Work</p>
            {[
              {
                index: "01",
                title: "Relational Intelligence",
                body: "A marriage counselling alternative for individuals and couples, helping you recognise the patterns shaping your relationship, without the clinical environment of traditional therapy.",
                note: "Marriage advocacy · Couples work · Intentional Space · Reflections",
              },
              {
                index: "02",
                title: "Cultural Intelligence",
                body: "Supporting organisations in navigating cultural nuance and building stronger communication across diverse teams.",
                note: null,
                extra: { href: "https://www.instagram.com/luxurymeetscultureofficial", text: "Luxury Meets Culture" },
              },
              {
                index: "03",
                title: "Intentional Experiences",
                body: "Curated gatherings designed to create space for honest conversations, reflection, and connection.",
                note: "Intentional Space · Forever Table · Forever & A Day",
              },
            ].map((pillar) => (
              <article key={pillar.title} className="work-pillar-row animate-in">
                <span className="work-pillar-index" aria-hidden>{pillar.index}</span>
                <h3 className="work-pillar-row-title" id={pillar.title === "Relational Intelligence" ? "work-pillars-heading" : undefined}>
                  {pillar.title}
                </h3>
                <div className="work-pillar-row-body">
                  <p>{pillar.body}</p>
                  {pillar.note && <p className="work-pillar-subnote">{pillar.note}</p>}
                  {"extra" in pillar && pillar.extra ? (
                    <p className="work-pillar-subnote">
                      Delivered through{" "}
                      <a href={pillar.extra.href} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                        {pillar.extra.text}
                      </a>
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experiences" className="section experiences-section">
          <p className="experiences-editorial-intro reveal-whisper">
            The most intimate room I create.
          </p>

          <div className="event-featured animate-in" id="intentional-space">
            <div className="event-featured-inner event-featured-inner-flex" style={{ maxWidth: "100%" }}>
              <div className="badge-row" style={{ marginBottom: "1rem" }}>
                <span className="badge badge-open">Waitlist Open</span>
                <span className="section-label section-label--on-dark-muted" style={{ letterSpacing: "0.2em" }}>
                  Most time sensitive · 25 &amp; 31 July 2026
                </span>
              </div>

              <h2 className="display-md">Intentional Space</h2>
              <p className="body-text" style={{ maxWidth: "640px", marginTop: "1rem" }}>
                An intimate London gathering for a small circle of women who want
                depth, discretion, and conversation that actually moves something, hosted
                with care and clear intention.
              </p>

              <p className="urgency-pill">
                {INTENTIONAL_SPACE_REMAINING_PLACES} places remaining
              </p>

              <div className="event-meta-row">
                <div>
                  <strong>Date</strong> 25th July 2026 (in person) and 31st July 2026 (online)
                </div>
                <div>
                  <strong>Location</strong> London (venue to be confirmed)
                </div>
                <div>
                  <strong>Capacity</strong> Limited to 10 women only
                </div>
                <div>
                  <strong>Price</strong> {PRICES.intentionalSpace}
                </div>
              </div>

              <a
                href={INTENTIONAL_SPACE_WAITLIST_TALLY_URL}
                className="btn btn-primary"
                style={{ marginTop: "0" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join The Waitlist →
              </a>

              <div className="event-featured-footer" />
            </div>
          </div>
        </section>

        <section id="offers" className="offers-section">
          <p className="offers-editorial-intro reveal-whisper">
            There is a room for exactly where you are.
          </p>
          <div className="offers-list section--narrow">
            {[
              {
                title: "Marriage Reflection Call",
                desc: "A counselling alternative for couples. One honest conversation that helps you see what's underneath the argument.",
                price: PRICES.reflectionCall,
                url: SCHEDULING_URL,
                ctaLabel: "Begin →",
              },
              {
                title: "Forever & A Day",
                desc: "The premarital counselling alternative for engaged and newlywed couples. Faith-led marriage preparation mentorship — group and 1:1 formats.",
                price: `From ${PRICES.foreverInADay.group} (group) / ${PRICES.foreverInADay.private} (private)`,
                url: FOREVER_AND_A_DAY_TALLY_URL,
                ctaLabel: "Begin →",
              },
              {
                title: "Forever Table",
                desc: "The dinner where marriages get real and grow stronger for it.",
                price: PRICES.foreverTable,
                url: FOREVER_TABLE_TALLY_URL,
                ctaLabel: "Begin →",
              },
              {
                title: "Òye Community",
                desc: "A faith-led marriage community for couples and individuals choosing to stay, grow, and replace silence with honesty. Online marriage support that doesn't feel clinical.",
                price: `${PRICES.circle.monthly} / ${PRICES.circle.annual}`,
                url: "https://tally.so/r/LZM1Bl",
                ctaLabel: "Begin →",
              },
            ].map((o) => (
              <article key={o.title} className="offer-row animate-in">
                <div className="offer-row-main">
                  <h3 className="offer-row-title">{o.title}</h3>
                  <p className="offer-row-desc">{o.desc}</p>
                </div>
                <div className="offer-row-aside">
                  <p className="offer-row-price">{o.price}</p>
                  {isComingSoonOffer() ? (
                    <button
                      type="button"
                      className="offer-row-cta"
                      onClick={() => openComingSoon(o.title)}
                    >
                      {o.ctaLabel}
                    </button>
                  ) : (
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="offer-row-cta"
                    >
                      {o.ctaLabel}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="section-divider" aria-hidden />

        <section className="pathways-section" aria-labelledby="pathways-heading">
          <div className="pathways-inner section--narrow">
            <p id="pathways-heading" className="pathways-headline reveal-whisper">
              Begin wherever you are.
            </p>
            <div className="pathways-links pathways-links--buttons">
              <Link href="/reflections" className="btn btn-secondary">Read Reflections</Link>
              <a href="#experiences" className="btn btn-secondary">Join an Experience</a>
              <Link href="/speaking" className="btn btn-secondary">Invite Tobi to Speak</Link>
            </div>
          </div>
        </section>

        <div className="section-divider" aria-hidden />

        <section className="testimonials-section">
          <div className="section--narrow">
            <blockquote className="testimonial-featured">
              <p className="testimonial-featured-quote reveal-whisper">
                One of the most valuable rooms I&apos;ve been in for a long time. Healing began for so many of us.
              </p>
              <footer className="testimonial-featured-author animate-in">Valerie</footer>
            </blockquote>

            <blockquote className="testimonial testimonial--indent-1 animate-in">
              <p>Don&apos;t give up on the assignment. The women came to heal and healing has begun.</p>
              <footer>Tosin</footer>
            </blockquote>

            <blockquote className="testimonial testimonial--indent-2 animate-in">
              <p>You are a powerful communicator. You deliver your message with clarity, conviction and heart.</p>
              <footer>Alley</footer>
            </blockquote>
          </div>
        </section>

        <LoveResetSection />

        <section id="products" className="audio-section">
          <div className="section--narrow">
            <div className="product-blocks">
              <div className="product-block animate-in">
                <p className="section-label">New · Available Now</p>
                <div className="terracotta-rule terracotta-rule--center reveal-line" />
                <h2 className="audio-title">The Understanding Series</h2>
                <p className="body-text product-block-copy">
                  Three reflection guides for couples: Before The Argument, How We Repair, and How We Grow. For the couples who love each other but keep having the same argument. Each guide includes a companion audio in my voice.
                </p>
                <a
                  href="https://tobi-yusuf.mykajabi.com/the-understanding-series-sales-page"
                  className="btn btn-secondary product-block-cta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore The Series
                </a>
              </div>

              <div className="product-block animate-in">
                <p className="section-label">New · Available Now</p>
                <div className="terracotta-rule terracotta-rule--center reveal-line" />
                <h2 className="audio-title">Closer</h2>
                <p className="body-text product-block-copy">
                  A reflection guide on intimacy in marriage for the couples who feel the distance but do not know how to say it out loud. Faith-rooted, shame-free, and honest. Includes a companion audio.
                </p>
                <a
                  href="https://tobi-yusuf.mykajabi.com/closer-5b6ac10f-2334-4948-b381-e5c77331368b"
                  className="btn btn-secondary product-block-cta"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Explore Closer
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section form-section contact-section contact-section--solo" style={{ paddingTop: 0 }}>
          <div className="section--narrow" style={{ maxWidth: "42rem" }}>
            <div className="animate-in">
              <h2 className="display-md contact-solo-heading" style={{ color: "var(--anchor)", fontStyle: "italic", fontWeight: 300 }}>
                Say something.
              </h2>
              <p className="body-text contact-solo-lead">
                Whether it&apos;s a question, an idea, or the beginning of something—I&apos;d love to hear from you.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      {comingSoonOpen ? (
        <div className="modal-backdrop" onClick={() => setComingSoonOpen(false)}>
          <div
            className="modal-panel coming-soon-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="coming-soon-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              type="button"
              aria-label="Close"
              onClick={() => setComingSoonOpen(false)}
            >
              ×
            </button>
            <p className="section-label">There&apos;s a Room for You</p>
            <h3 id="coming-soon-title" className="display-md">
              Coming soon
            </h3>
            <p className="body-text coming-soon-offer">{comingSoonOffer}</p>
            <p className="body-text coming-soon-note">
              This room is being carefully prepared to support honest conversations and meaningful
              growth. Updates will be shared here when available.
            </p>
            <p className="coming-soon-follow-text">You can follow me on Instagram to stay updated.</p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary coming-soon-follow-btn"
            >
              Follow me
            </a>
          </div>
        </div>
      ) : null}

      <SiteFooter />
    </>
  );
}

function LoveResetSection() {
  return (
    <section className="capture-section" aria-labelledby="capture-heading">
      <div className="capture-inner animate-in">
        <div>
          <p className="capture-heading-1" id="capture-heading" aria-hidden>Let this be</p>
          <p className="capture-heading-2">your first step.</p>
        </div>
        <div>
          <p className="capture-body">
            Free marriage support audio for couples feeling stuck. A 5-day reset for stronger connection: a counselling alternative, no clinical environment required.
          </p>
          <p className="capture-body">
            The Quiet Return is a gentle 5 day audio experience. No cost, no fluff. It is designed to help you breathe, refocus, and return to yourself (and your marriage) with a little more clarity.
          </p>
          <a
            href="https://tobi-yusuf.mykajabi.com/the-quiet-return"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Access the Free Audio
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [enquiry, setEnquiry] = useState("forever-day");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiry,
          email,
          firstName,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("err");
        setMsg(data.error || "Something went wrong.");
        return;
      }
      setStatus("ok");
      setMsg("Thank you. We will be in touch.");
      setEmail("");
      setFirstName("");
    } catch {
      setStatus("err");
      setMsg("Network error.");
    }
  }

  return (
    <form className="form-panel" onSubmit={onSubmit}>
      <div className="form-field">
        <label htmlFor="ct-enquiry">You&apos;re writing about</label>
        <select id="ct-enquiry" value={enquiry} onChange={(e) => setEnquiry(e.target.value)}>
          <option value="forever-day">Forever & A Day Experience</option>
          <option value="reflection-call">Marriage Reflection Call</option>
          <option value="intentional-space">Intentional Space</option>
          <option value="forever-table">Forever Table</option>
          <option value="speaking">Speaking engagement</option>
          <option value="media-press">Media & press</option>
          <option value="partnership-collaboration">Partnership or collaboration</option>
          <option value="brand-collaboration">Brand collaboration</option>
        </select>
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label htmlFor="ct-first">First name</label>
          <input
            id="ct-first"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="ct-email">Email</label>
          <input
            id="ct-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      <button type="submit" className="btn btn-secondary" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "SEND MESSAGE"}
      </button>
      {msg ? (
        <p className={`form-msg ${status === "ok" ? "form-msg--ok" : "form-msg--err"}`}>{msg}</p>
      ) : null}
    </form>
  );
}
