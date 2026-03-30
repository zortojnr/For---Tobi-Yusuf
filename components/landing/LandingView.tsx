"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRICES } from "@/lib/data/prices";
import {
  INTENTIONAL_SPACE_REMAINING_PLACES,
  INTENTIONAL_SPACE_WAITLIST_TALLY_URL,
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
              Marriage · Relationships · Identity · Writing
            </p>
            <h1 className="hero-headline hero-anim-2">
              Real conversations for real <em>marriages.</em>
            </h1>
            <p className="hero-positioning hero-anim-2b">
              Relational &amp; Cultural Intelligence Advisor | Speaker | Facilitator |
              Conversation Host
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

        <section className="familiar-section" aria-label="If this feels familiar">
          <div className="familiar-inner">
            <p className="body-text">
              You love your spouse, but conversations often turn into misunderstandings.
            </p>
            <p className="body-text">
              You find yourself repeating the same concerns, yet nothing seems to change.
            </p>
            <p className="body-text">
              Sometimes you wonder if you are asking for too much, or if you have simply
              stopped saying certain things altogether.
            </p>
            <p className="body-text">
              You may still care deeply about your marriage, but the emotional connection
              feels different from how it once was.
            </p>
            <p className="familiar-emphasis">
              If any of this feels familiar, you are not alone.
            </p>
            <p className="body-text">
              My work creates space to understand the patterns behind these moments, and
              to begin more intentional conversations about them.
            </p>
            <p className="body-text">
              You can begin by exploring reflections, joining a conversation, or
              attending one of the experiences designed to create space for honest
              dialogue.
            </p>
            <div className="familiar-cta-row">
              <Link href="/reflections" className="btn btn-secondary">
                Read Reflections
              </Link>
              <a href="#experiences" className="btn btn-secondary">
                Explore Experiences
              </a>
              <a href="#speaking" className="btn btn-secondary">
                Book Tobi to Speak
              </a>
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
                I&apos;m Tobi Yusuf, a marriage and relationships mentor, speaker, and
                experience curator based in London. My work sits at the intersection
                of emotional honesty, cultural intelligence, and the quiet courage it
                takes to keep showing up in love.
              </p>
              <p className="body-text">
                Through intimate gatherings, curated conversations, and practical
                frameworks, I help couples and women name what&apos;s true, and build
                from there. Nothing performative. Nothing generic. Just real language
                for real life.
              </p>
              <p className="body-text">
                I&apos;m also the founder of RIAH, a luxury wedding planning experience
                for culturally rich couples, and Luxury Meets Culture, where I train
                venues, planners, and organisations in the cultural intelligence that
                turns good intentions into genuine inclusion.
              </p>
              <p className="body-text">
                Whether you join an experience, read the Sunday reflections, or work
                with me privately, the invitation is the same: tell the truth, kindly,
                and let the right next step emerge.
              </p>
              <a href="#offers" className="btn btn-secondary" style={{ marginTop: "1.5rem" }}>
                See How We Can Work Together
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
                href={SCHEDULING_URL}
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
            <p className="section-label">How We Can Work Together</p>
            <div className="terracotta-rule" />
            <h2 className="display-md" style={{ color: "var(--anchor)" }}>
              How We Can Work Together
            </h2>
          </div>

          <div className="offers-grid section--narrow">
            {[
              {
                num: "01",
                title: "Marriage Reflection Call",
                desc: "One honest conversation that helps you see what's underneath the argument.",
                price: PRICES.reflectionCall,
              },
              {
                num: "02",
                title: "Forever In A Day",
                desc: "Marriage preparation mentorship for couples who want to start right.",
                price: `From ${PRICES.foreverInADay.group} (group) | ${PRICES.foreverInADay.private} (private)`,
              },
              {
                num: "03",
                title: "Forever Table",
                desc: "The dinner where marriages get real and grow stronger for it.",
                price: PRICES.foreverTable,
              },
              {
                num: "04",
                title: "Real Marriages Circle",
                desc: "Monthly community for couples who are tired of suffering in silence.",
                price: `${PRICES.circle.monthly} | ${PRICES.circle.annual}`,
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
                  <a
                    href={INTENTIONAL_SPACE_WAITLIST_TALLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn--sm offer-waitlist-cta"
                  >
                    Join the waitlist
                    <OfferWaitlistPointerIcon />
                  </a>
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
                <a href="#speaking" className="btn btn-secondary btn--sm">
                  Book Tobi to Speak
                </a>
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

            <div className="animate-in ct-credibility">
              A special collaboration with Charlotte Tilbury is in development: an intimate evening designed for a very small group of women,
              blending beauty, presence, and honest conversation about love and identity.
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

        <section id="speaking" className="section form-section">
          <div className="speaking-split">
            <div className="speaking-split-copy animate-in">
              <p className="section-label">Speaking</p>
              <div className="terracotta-rule" />
              <h2 className="display-md" style={{ color: "var(--anchor)" }}>
                Invite Tobi to speak
              </h2>
              <p className="body-text" style={{ maxWidth: "560px", marginBottom: "1.5rem" }}>
                Keynotes, panels, and curated conversations for brands, communities, and teams who care about relationships done well.
              </p>
              <div className="speaking-topics">
                <p className="body-text speaking-intro" style={{ maxWidth: "560px" }}>
                  Tobi speaks at conferences, corporate events, faith based gatherings,
                  universities, and leadership programmes. Her talks sit at the
                  intersection of relational intelligence, cultural understanding, and the
                  honest conversations most rooms are too polished to have.
                </p>
                <article className="speaking-topic-card">
                  <h3 className="speaking-topic-title">From the Bedroom to the Boardroom</h3>
                  <p className="body-text" style={{ margin: 0, maxWidth: "560px" }}>
                    Why the patterns that shape our most personal relationships show up in
                    the spaces where we work, lead, and collaborate. The hidden cost of
                    relational stress on workplace performance. Why organisations that
                    care about productivity should care about the whole person.
                  </p>
                  <p className="speaking-topic-audience">
                    <strong>For:</strong> HR leaders · L&amp;D teams · Corporate leadership
                    summits · Employee wellbeing conferences
                  </p>
                </article>
                <article className="speaking-topic-card">
                  <h3 className="speaking-topic-title">Cultural Intelligence in Practice</h3>
                  <p className="body-text" style={{ margin: 0, maxWidth: "560px" }}>
                    Moving beyond diversity statements to operational cultural competence.
                    What happens when your organisation, your venue, or your team actually
                    encounters a culture it does not understand. Practical insight rooted in
                    real world experience.
                  </p>
                  <p className="speaking-topic-audience">
                    <strong>For:</strong> Corporate organisations · Hospitality and events
                    businesses · DEI events · Universities
                  </p>
                </article>
                <article className="speaking-topic-card">
                  <h3 className="speaking-topic-title">Relational Intelligence for the Next Generation</h3>
                  <p className="body-text" style={{ margin: 0, maxWidth: "560px" }}>
                    Understanding communication patterns, emotional maturity, and healthy
                    relationships before marriage. What nobody teaches you about love,
                    conflict, and partnership before you are in one.
                  </p>
                  <p className="speaking-topic-audience">
                    <strong>For:</strong> Universities · Student unions · Young professionals
                    networks · Faith based communities
                  </p>
                </article>
              </div>
              <SpeakingForm />
            </div>
            <div className="speaking-split-image animate-in">
              {/* SITE_IMAGES.img2 — used twice: reflections divider (reflections page) and speaking image (home) */}
              <SiteImage
                src={SITE_IMAGES.img2}
                alt=""
                ratio="3/4"
                sizes="(max-width: 900px) 100vw, 380px"
                className="image-dim"
              />
            </div>
          </div>
        </section>

        <section id="contact" className="section form-section" style={{ paddingTop: 0 }}>
          <div className="section--narrow">
            <p className="section-label">Contact</p>
            <div className="terracotta-rule" />
            <h2 className="display-md" style={{ color: "var(--anchor)" }}>
              Get in touch
            </h2>
            <p className="body-text" style={{ maxWidth: "560px", marginBottom: "1.5rem" }}>
              General enquiries, partnerships, and questions about working together.
            </p>
            <ContactForm />
          </div>
        </section>
      </main>

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
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "love-reset",
          email,
          firstName,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErr(data.error || "Could not subscribe.");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setErr("Network error.");
    }
    setLoading(false);
  }

  return (
    <section className="capture-section" aria-labelledby="capture-heading">
      <div className="capture-inner animate-in">
        <p className="section-label">Free Resource</p>
        <div className="terracotta-rule terracotta-rule--center" />
        <h2 id="capture-heading" className="display-md" style={{ color: "var(--text-on-dark)" }}>
          Not ready to book yet? Start here.
        </h2>
        <p className="capture-body">
          The Love Reset Audio is a gentle 5 day audio experience. No cost, no fluff. It is designed to help you breathe, refocus, and return to yourself (and your marriage) with a little more clarity.
        </p>
        <form className="capture-form" onSubmit={onSubmit}>
          <div className="capture-fields">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              aria-label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={done}
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={done}
            />
          </div>
          <button
            type="submit"
            className="btn-capture-submit"
            disabled={done || loading}
            style={
              done ? { background: "var(--anchor)", borderColor: "var(--anchor)" } : undefined
            }
          >
            {done ? "✓ Check your inbox" : loading ? "…" : "Send"}
          </button>
        </form>
        {err ? <p className="form-msg form-msg--err">{err}</p> : null}
        <p className="capture-note">Your details are safe. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}

function SpeakingForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const trimmed = message.trim();
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "speaking",
          email,
          firstName,
          fields: trimmed ? { event_details: trimmed } : undefined,
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
      setMessage("");
    } catch {
      setStatus("err");
      setMsg("Network error.");
    }
  }

  return (
    <form className="form-panel animate-in" onSubmit={onSubmit}>
      <div className="form-grid-2">
        <div className="form-field">
          <label htmlFor="sp-first">First name</label>
          <input
            id="sp-first"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="sp-email">Email</label>
          <input
            id="sp-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="sp-msg">Event details (optional)</label>
        <textarea
          id="sp-msg"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-secondary" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Submit speaking enquiry"}
      </button>
      {msg ? (
        <p className={`form-msg ${status === "ok" ? "form-msg--ok" : "form-msg--err"}`}>{msg}</p>
      ) : null}
    </form>
  );
}

function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [enquiry, setEnquiry] = useState<"general" | "forever-day">("general");
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
          onChange={(e) => setEnquiry(e.target.value as "general" | "forever-day")}
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
          <option value="general">General enquiry</option>
          <option value="forever-day">Forever &amp; A Day</option>
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
        {status === "loading" ? "Sending…" : "Send enquiry"}
      </button>
      {msg ? (
        <p className={`form-msg ${status === "ok" ? "form-msg--ok" : "form-msg--err"}`}>{msg}</p>
      ) : null}
    </form>
  );
}

