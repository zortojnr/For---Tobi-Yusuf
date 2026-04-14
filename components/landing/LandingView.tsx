"use client";

import { useEffect, useState } from "react";
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

const COUNTDOWN_TARGET = new Date("2026-04-25T00:00:00+01:00");

export function LandingView() {
  useAnimateIn();

  const [countdownText, setCountdownText] = useState("");
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonOffer, setComingSoonOffer] = useState("");

  function isComingSoonOffer(title: string) {
    return title === "Real Marriages Circle";
  }

  function openComingSoon(title: string) {
    setComingSoonOffer(title);
    setComingSoonOpen(true);
  }

  useEffect(() => {
    const updateCountdown = () => {
      const diff = COUNTDOWN_TARGET.getTime() - Date.now();
      if (diff <= 0) {
        setCountdownText("Event today!");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setCountdownText(`${d}d ${h}h ${m}m`);
    };

    updateCountdown();
    const id = setInterval(updateCountdown, 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!comingSoonOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setComingSoonOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [comingSoonOpen]);

  return (
    <>
      <SiteNav />
      <main>
        <section className="hero" aria-label="Introduction">
          <div className="hero-photo" aria-hidden>
            <Image
              src={SITE_IMAGES.img6}
              alt=""
              fill
              priority
              sizes="100vw"
              className="hero-photo-img"
            />
          </div>

          <div className="hero-content">
            <p className="hero-eyebrow hero-anim-1">
              Marriage · Relationship · Identity
            </p>
            <h1 className="hero-headline hero-anim-2">
              Real conversations for real <em>marriages.</em>
            </h1>
            <p className="hero-positioning hero-anim-2b">
              <strong>Relational &amp; Cultural Intelligence Advisor | Speaker | Facilitator |
              Conversation Host</strong>
            </p>
            <p className="hero-sub hero-anim-3">
              A luxury editorial space for professional women who want honest,
              grounded conversation about marriage, identity, and the life you&apos;re
              building, without the noise.
            </p>
            <div className="hero-ctas hero-anim-3">
              <a href="#experiences" className="btn btn-terracotta">
                Explore Experiences
              </a>
              <a href="#about" className="btn btn-ghost-light">
                About Tobi
              </a>
            </div>
          </div>

          <div className="hero-scroll" aria-hidden>
            <span className="hero-scroll-label">Scroll</span>
            <div className="hero-scroll-line" />
          </div>
        </section>

        <div className="urgent-banner">
          <p className="urgent-banner-inner">
            Intentional Space · 25th April 2026, London · Only 10 places available ·{" "}
            <span className="countdown-pill" id="countdown">
              {countdownText || "…"}
            </span>{" "}
            {"· "}
            <a
              className="book-link"
              href={SCHEDULING_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Your Place →
            </a>
          </p>
        </div>

        <section className="proof-strip" aria-label="Impact">
          <div className="proof-grid">
            {[
              { n: "2M+", l: "Instagram views on marriage content" },
              { n: "10", l: "Intimate places per Intentional Space" },
              { n: "10+", l: "Years of real marriage conversations" },
              { n: "1", l: "Guiding principle: truth" },
            ].map((item) => (
              <div key={item.l} className="animate-in proof-item">
                <span className="proof-num">{item.n}</span>
                <span className="proof-label">{item.l}</span>
              </div>
            ))}
          </div>
        </section>

        <FeaturedPublications />

        <section className="familiar-section" aria-labelledby="familiar-heading">
          <div className="familiar-shell section--narrow">
            <header className="familiar-header animate-in">
              <p className="section-label familiar-kicker" id="familiar-heading">
                If this feels familiar
              </p>
              <div className="terracotta-rule familiar-rule" />
            </header>
            <div className="familiar-scenarios animate-in">
              <p className="familiar-line">
                You love your spouse, but conversations often turn into misunderstandings.
              </p>
              <p className="familiar-line">
                You find yourself repeating the same concerns, yet nothing seems to change.
              </p>
              <p className="familiar-line">
                Sometimes you wonder if you are asking for too much, or if you have simply
                stopped saying certain things altogether.
              </p>
              <p className="familiar-line">
                You may still care deeply about your marriage, but the emotional connection
                feels different from how it once was.
              </p>
            </div>
            <p className="familiar-emphasis animate-in">
              If any of this feels familiar, you are not alone.
            </p>
            <div className="familiar-outro animate-in">
              <p className="familiar-outro-text">
                My work creates space to understand the patterns behind these moments, and
                to begin more intentional conversations about them.
              </p>
              <p className="familiar-outro-text">
                You can begin by exploring reflections, joining a conversation, or
                attending one of the experiences designed to create space for honest
                dialogue.
              </p>
            </div>
            <div className="familiar-cta-row animate-in">
              <Link href="/reflections" className="btn btn-secondary">
                Read Reflections
              </Link>
              <a href="#experiences" className="btn btn-secondary">
                Explore Experiences
              </a>
              <Link href="/speaking" className="btn btn-secondary">
                Book Tobi to Speak
              </Link>
            </div>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="about-grid">
            <div className="about-quote-col animate-in">
              <p className="section-label">About Tobi</p>
              <div className="terracotta-rule" />

              {/* SITE_IMAGES.img4 — used twice: About on home and booking aside (booking page) */}
              <div className="about-portrait about-portrait-frame">
                <SiteImage
                  src={SITE_IMAGES.img4}
                  alt="Tobi Yusuf"
                  ratio="4/3"
                  sizes="(max-width: 900px) 100vw, min(520px, 50vw)"
                  className="image-dim"
                />
              </div>

              <blockquote className="about-quote">
                From the bedroom to the boardroom. I help people build the life that holds everything
                else together.
              </blockquote>
              <p className="about-faith">
                My work is grounded in faith. God is the foundation of everything I build.
              </p>
            </div>

            <div className="animate-in about-body">
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
                explore what I’m building
              </a>
            </div>
          </div>
        </section>

        <section className="section work-pillars-section" aria-labelledby="work-pillars-heading">
          <div className="section--narrow" style={{ marginBottom: "2.5rem" }}>
            <p className="section-label">The Work</p>
            <div className="terracotta-rule" />
            <h2 id="work-pillars-heading" className="display-md" style={{ color: "var(--anchor)" }}>
              The Work
            </h2>
          </div>
          <div className="work-pillars-grid section--narrow">
            <article className="work-pillar-card animate-in">
              <h3 className="work-pillar-title">Relational Intelligence</h3>
              <p className="body-text work-pillar-body">
                Helping individuals and couples recognise the communication patterns
                shaping their relationships.
              </p>
              <p className="work-pillar-subnote">
                Marriage advocacy · Couples work · Intentional Space · Reflections ·
                Podcast
              </p>
            </article>
            <article className="work-pillar-card animate-in">
              <h3 className="work-pillar-title">Cultural Intelligence</h3>
              <p className="body-text work-pillar-body">
                Supporting organisations in navigating cultural nuance and building
                stronger communication across diverse teams.
              </p>
              <p className="work-pillar-subnote">
                Delivered through{" "}
                <a
                  href="https://www.instagram.com/luxurymeetscultureofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  Luxury Meets Culture
                </a>
                , cultural intelligence training for organisations that want to move
                beyond diversity statements.
              </p>
            </article>
            <article className="work-pillar-card animate-in">
              <h3 className="work-pillar-title">Intentional Experiences</h3>
              <p className="body-text work-pillar-body">
                Curated gatherings designed to create space for honest conversations,
                reflection, and connection.
              </p>
              <p className="work-pillar-subnote">
                Intentional Space · Forever Table · Forever &amp; A Day · Curated
                Collaborations
              </p>
              <a href="#experiences" className="work-pillar-link">
                Explore experiences
              </a>
            </article>
          </div>
        </section>

        <section id="experiences" className="section experiences-section">
          <div className="section--narrow" style={{ marginBottom: "2.5rem" }}>
            <p className="section-label">Experiences</p>
            <div className="terracotta-rule" />
            <h2 className="display-md">Experiences</h2>
          </div>

          <div className="event-featured animate-in" id="intentional-space">
            <div className="event-featured-inner event-featured-inner-flex" style={{ maxWidth: "100%" }}>
              <div className="badge-row" style={{ marginBottom: "1rem" }}>
                <span className="badge badge-open">Booking Open</span>
                <span className="section-label section-label--on-dark-muted" style={{ letterSpacing: "0.2em" }}>
                  Most time sensitive · 25 April 2026
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
                  <strong>Date</strong> Friday 25th April 2026
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
                Book Your Place →
              </a>

              <div className="event-featured-footer" />
            </div>
          </div>
        </section>

        <section id="offers" className="section offers-section">
          <div className="section--narrow" style={{ marginBottom: "2.5rem" }}>
            <p className="section-label">There’s a Room for You</p>
            <div className="terracotta-rule" />
            <h2 className="display-md" style={{ color: "var(--anchor)" }}>
              There’s a Room for You
            </h2>
          </div>

          <div className="offers-grid section--narrow">
            {[
              {
                num: "01",
                title: "Marriage Reflection Call",
                desc: "One honest conversation that helps you see what's underneath the argument.",
                price: PRICES.reflectionCall,
                url: SCHEDULING_URL,
                ctaLabel: "Join the Call",
              },
              {
                num: "02",
                title: "Forever & A Day",
                desc: "Marriage preparation mentorship for couples who want to start right and stay right.",
                price: `From ${PRICES.foreverInADay.group} (group) | ${PRICES.foreverInADay.private} (private)`,
                url: FOREVER_AND_A_DAY_TALLY_URL,
              },
              {
                num: "03",
                title: "Forever Table",
                desc: "The dinner where marriages get real and grow stronger for it.",
                price: PRICES.foreverTable,
                url: FOREVER_TABLE_TALLY_URL,
              },
              {
                num: "04",
                title: "Real Marriages Circle",
                desc: "Monthly community for couples who are tired of suffering in silence.",
                price: `${PRICES.circle.monthly} | ${PRICES.circle.annual}`,
                url: INTENTIONAL_SPACE_WAITLIST_TALLY_URL,
              },
            ].map((o) => (
              <article key={o.num} className="offer-card animate-in">
                <div className="offer-card-body">
                  <div className="offer-num">{o.num}</div>
                  <h3 className="offer-title">{o.title}</h3>
                  <p className="offer-desc">{o.desc}</p>
                  <p className="offer-price">{o.price}</p>
                </div>
                <div className="offer-card-footer">
                  {isComingSoonOffer(o.title) ? (
                    <button
                      type="button"
                      className="btn btn-secondary btn--sm offer-waitlist-cta"
                      onClick={() => openComingSoon(o.title)}
                    >
                      Join the waitlist
                      <OfferWaitlistPointerIcon />
                    </button>
                  ) : (
                    <a
                      href={o.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn--sm offer-waitlist-cta"
                    >
                      {"ctaLabel" in o && o.ctaLabel ? o.ctaLabel : "Join the waitlist"}
                      <OfferWaitlistPointerIcon />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section pathways-section"
          aria-labelledby="pathways-heading"
        >
          <div className="section--narrow" style={{ marginBottom: "2.5rem" }}>
            <p className="section-label">Where Would You Like to Begin?</p>
            <div className="terracotta-rule" />
            <h2 id="pathways-heading" className="display-md" style={{ color: "var(--anchor)" }}>
              Where Would You Like to Begin?
            </h2>
          </div>
          <p
            className="body-text section--narrow"
            style={{ marginBottom: "2rem", maxWidth: "42rem" }}
          >
            Many people arrive here at different stages of their journey. Some are simply
            curious; others are looking for deeper conversations about their
            relationships. If you are not sure where to begin, here are a few ways to
            explore.
          </p>
          <div className="offers-grid section--narrow">
            <article className="offer-card animate-in">
              <div className="offer-card-body">
                <h3 className="offer-title">Start with a Reflection</h3>
                <p className="offer-desc">
                  Read weekly reflections exploring the real patterns couples experience in
                  marriage, the moments many people recognise but rarely talk about openly.
                </p>
              </div>
              <div className="offer-card-footer">
                <Link href="/reflections" className="btn btn-secondary btn--sm">
                  Read Reflections
                </Link>
              </div>
            </article>
            <article className="offer-card animate-in">
              <div className="offer-card-body">
                <h3 className="offer-title">Join an Experience</h3>
                <p className="offer-desc">
                  Attend one of the intentional gatherings designed to create space for
                  honest conversations about relationships and emotional patterns.
                  Includes Intentional Space, Forever &amp; A Day, and Forever Table.
                </p>
              </div>
              <div className="offer-card-footer">
                <a href="#experiences" className="btn btn-secondary btn--sm">
                  Explore Experiences
                </a>
              </div>
            </article>
            <article className="offer-card animate-in">
              <div className="offer-card-body">
                <h3 className="offer-title">Invite Tobi to Speak</h3>
                <p className="offer-desc">
                  For organisations, conferences, and communities looking to explore
                  relational intelligence, cultural understanding, and communication
                  patterns.
                </p>
              </div>
              <div className="offer-card-footer">
                <Link href="/speaking" className="btn btn-secondary btn--sm">
                  Book Tobi to Speak
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="section testimonials-section">
          <div className="section--narrow">
            <div className="animate-in" style={{ marginBottom: "2rem" }}>
              <p className="section-label">Testimonials</p>
              <div className="terracotta-rule" />
              <h2 className="display-md" style={{ color: "var(--anchor)" }}>
                Words from the room
              </h2>
            </div>

            <div className="testimonial-grid">
                {[
                  {
                    q: "One of the most valuable rooms I've been in for a long time. Healing began for so many of us.",
                    a: "Valerie",
                  },
                  {
                    q: "Don't give up on the assignment. The women came to heal and healing has begun.",
                    a: "Tosin",
                  },
                  {
                    q: "You are a powerful communicator. You deliver your message with clarity, conviction and heart.",
                    a: "Alley",
                  },
                ].map((t) => (
                  <blockquote key={t.a} className="animate-in testimonial">
                    <p className="testimonial-quote">{t.q}</p>
                    <footer className="testimonial-author">{t.a}</footer>
                  </blockquote>
                ))}
              </div>
          </div>
        </section>

        <LoveResetSection />

        <section id="audio" className="audio-section">
          <div className="audio-split audio-split--single">
            <div className="audio-placeholder animate-in">
              <span className="audio-phase">Coming May 2026</span>
              <h2 className="audio-title">Inside The Mind Series</h2>
              <p className="body-text" style={{ maxWidth: "520px", margin: "0 auto 1.5rem" }}>
                A new audio series for couples and individuals who want thoughtful, grounded perspective, without the noise. Details, pricing, and purchase links will land here when the series launches.
              </p>
              <a href="#contact" className="btn btn-secondary">
                Notify Me When Available
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="section form-section contact-section" style={{ paddingTop: 0 }}>
          <div className="section--narrow">
            <p className="section-label">Contact</p>
            <div className="terracotta-rule" />
            <h2 className="display-md" style={{ color: "var(--anchor)" }}>
              Get in touch
            </h2>
            <p className="body-text" style={{ maxWidth: "560px", marginBottom: "1.5rem" }}>
              Whether it’s a question, an idea, or the beginning of something I’d love to hear from you.
            </p>
            <ContactForm />
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

function OfferWaitlistPointerIcon() {
  return (
    <svg
      className="offer-waitlist-pointer"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      aria-hidden
      fill="currentColor"
    >
      <path d="M4 4l10.2 6.56L9.8 12 20 18.56 4 20l3.2-7.2L4 4z" />
    </svg>
  );
}

function LoveResetSection() {
  return (
    <section className="capture-section" aria-labelledby="capture-heading">
      <div className="capture-inner animate-in">
        <p className="section-label">Free Resource</p>
        <div className="terracotta-rule terracotta-rule--center" />
        <h2 id="capture-heading" className="display-md" style={{ color: "var(--text-on-dark)" }}>
          Let this be your first step.
        </h2>
        <p className="capture-body">
          The Love Reset Audio is a gentle 5 day audio experience. No cost, no fluff. It is designed to help you breathe, refocus, and return to yourself (and your marriage) with a little more clarity.
        </p>
        <a href="https://lctobiyusuf.systeme.io/935600f7" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
          Sign Up for Free Resource
        </a>
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
    <form className="form-panel animate-in" onSubmit={onSubmit}>
      <div className="form-field">
        <label htmlFor="ct-enquiry">You&apos;re writing about</label>
        <select
          id="ct-enquiry"
          value={enquiry}
          onChange={(e) => setEnquiry(e.target.value)}
          style={{
            width: "100%",
            padding: "0.85rem 1rem",
            border: "1px solid rgba(61, 31, 43, 0.15)",
            borderRadius: 0,
            fontFamily: "var(--font-body)",
            background: "var(--background)",
            color: "var(--anchor)",
          }}
        >
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

