"use client";

import { SiteImage } from "@/components/site/SiteImage";
import { SITE_IMAGES } from "@/lib/data/site-images";
import { SiteNav } from "@/components/landing/SiteNav";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { useAnimateIn } from "@/components/landing/useAnimateIn";
import { SpeakingForm } from "@/components/landing/SpeakingForm";
import { ConversationsClosingSection } from "@/components/landing/ConversationsClosingSection";

const TOPICS: { index: string; title: string; body: string; audience: string }[] = [
  {
    index: "01",
    title: "From the Bedroom to the Boardroom",
    body: "Why the patterns that shape our most personal relationships show up in the spaces where we work, lead, and collaborate. The hidden cost of relational stress on workplace performance. Why organisations that care about productivity should care about the whole person.",
    audience:
      "HR leaders · L&D teams · Corporate leadership summits · Employee wellbeing conferences",
  },
  {
    index: "02",
    title: "Cultural Intelligence in Practice",
    body: "Moving beyond diversity statements to operational cultural competence. What happens when your organisation, your venue, or your team actually encounters a culture it does not understand. Practical insight rooted in real world experience.",
    audience: "Corporate organisations · Hospitality and events businesses · DEI events · Universities",
  },
  {
    index: "03",
    title: "Relational Intelligence for the Next Generation",
    body: "Understanding communication patterns, emotional maturity, and healthy relationships before marriage. What nobody teaches you about love, conflict, and partnership before you are in one.",
    audience: "Universities · Student unions · Young professionals networks · Faith based communities",
  },
];

export function SpeakingPageClient() {
  useAnimateIn();

  return (
    <>
      <SiteNav />
      <main className="speaking-page-body">
        <section className="speaking-page-hero">
          <div className="speaking-page-hero-image">
            <div
              className="speaking-page-hero-bg"
              style={{ backgroundImage: `url(${SITE_IMAGES.siteLogo})` }}
              aria-hidden
            />
            <div className="speaking-page-hero-scrim" />
          </div>
          <div className="speaking-page-hero-copy section--narrow speaking-page-hero-copy-inner">
            <p className="reflections-hero-brand">Tobi Yusuf</p>
            <p className="section-label" style={{ color: "var(--signature)" }}>
              Speaking
            </p>
            <div className="terracotta-rule" />
            <h1 className="display-md" style={{ color: "var(--anchor)" }}>
              Invite Tobi to speak
            </h1>
            <p className="reflections-intro">
              Keynotes, panels, and curated conversations for brands, communities, and teams who
              care about relationships done well.
            </p>
          </div>
        </section>

        <section
          className="section form-section speaking-section"
          aria-label="Speaking topics and enquiry form"
        >
          <header className="section--narrow speaking-page-masthead animate-in">
            <p className="section-label">Talks &amp; programmes</p>
            <div className="terracotta-rule terracotta-rule--center speaking-page-masthead-rule" />
            <h2 className="display-md speaking-page-masthead-title" style={{ color: "var(--anchor)" }}>
              How Tobi shows up in the room
            </h2>
            <p className="speaking-page-lead">
              Tobi speaks at conferences, corporate events, faith based gatherings, universities, and
              leadership programmes. Her talks sit at the intersection of relational intelligence,
              cultural understanding, and the honest conversations most rooms are too polished to
              have.
            </p>
          </header>
          <div className="speaking-split">
            <div className="speaking-split-copy animate-in">
              <div className="speaking-topics">
                {TOPICS.map((t) => (
                  <article key={t.index} className="speaking-topic-card">
                    <span className="speaking-topic-index" aria-hidden>
                      {t.index}
                    </span>
                    <h3 className="speaking-topic-title">{t.title}</h3>
                    <p className="body-text speaking-topic-body">{t.body}</p>
                    <p className="speaking-topic-audience">
                      <strong>For:</strong> {t.audience}
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
          <div className="speaking-form-center animate-in">
            <div className="speaking-enquiry-panel">
              <p className="speaking-enquiry-label">Speaking enquiry</p>
              <SpeakingForm />
            </div>
          </div>
        </section>
      </main>
      <ConversationsClosingSection />
      <SiteFooter />
    </>
  );
}
