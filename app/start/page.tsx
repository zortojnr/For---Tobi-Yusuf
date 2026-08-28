import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";

const START_OFFERS = [
  {
    title: "The Understanding Series",
    description:
      "Three reflection guides for couples: Before The Argument, How We Repair, and How We Grow. Honest, practical, and deeply rooted in faith and real-life marriage realities.",
    href: "https://tobi-yusuf.mykajabi.com/the-understanding-series-sales-page",
    tag: "New · Available now",
  },
  {
    title: "Closer",
    description:
      "A reflection guide on intimacy in marriage for couples who feel the distance but do not know how to say it out loud. Faith-rooted, shame-free, and honest.",
    href: "https://tobi-yusuf.mykajabi.com/closer-5b6ac10f-2334-4948-b381-e5c77331368b",
    tag: "New · Available now",
  },
  {
    title: "Marriage Reflection Call",
    description:
      "A 60-minute private conversation for couples who need honesty, clarity, and a gentle but direct place to begin again.",
    href: "https://therelatablewife.as.me/schedule/e241b7a5",
    tag: "Private conversation",
  },
  {
    title: "The Quiet Return",
    description:
      "A grounded, reflective invitation for women navigating the long road back to themselves, their peace, and their voice.",
    href: "https://tobi-yusuf.mykajabi.com/the-quiet-return",
    tag: "Coming home",
  },
];

export default function StartPage() {
  return (
    <>
      <SiteNav />
      <main className="start-page">
        <section className="start-hero">
          <div className="section--narrow start-hero-inner">
            <p className="section-label start-kicker">Start here</p>
            <h1 className="start-title">Choose the next step for your marriage or your healing.</h1>
            <p className="start-subtitle">
              Thoughtful tools, compassionate guidance, and conversation that leads toward honesty, repair, and deeper closeness.
            </p>
            <div className="start-hero-actions">
              <a href="#offers" className="btn btn-terracotta btn--sm">
                Explore offers
              </a>
            </div>
          </div>
        </section>

        <section id="offers" className="start-offers">
          <div className="section--narrow">
            <div className="start-offers-grid">
              {START_OFFERS.map((offer) => (
                <article key={offer.title} className="start-offer-card">
                  <p className="section-label start-offer-label">{offer.tag}</p>
                  <div className="terracotta-rule terracotta-rule--center" aria-hidden />
                  <h2 className="start-offer-title">{offer.title}</h2>
                  <p className="start-offer-copy">{offer.description}</p>
                  <a
                    href={offer.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary start-offer-btn"
                  >
                    Explore
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
