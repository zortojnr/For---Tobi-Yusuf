"use client";

import Link from "next/link";

/** “Conversations Change Things” band — shown on the speaking page above the site footer. */
export function ConversationsClosingSection() {
  return (
    <section
      className="footer-closing conversations-closing"
      aria-labelledby="conversations-closing-heading"
    >
      <div className="footer-closing-inner">
        <h2 id="conversations-closing-heading" className="display-md">
          Conversations Change Things
        </h2>
        <div className="footer-closing-body">
          <p className="body-text">
            Sometimes what people need most is not advice, but a space where honest conversations
            can happen.
          </p>
          <p className="body-text">
            Through reflections, experiences, and speaking engagements, this work is about helping
            people understand the patterns shaping their relationships, and creating space for more
            intentional connection.
          </p>
        </div>
        <div className="footer-closing-btns">
          <Link href="/#experiences" className="btn btn-secondary">
            Explore Experiences
          </Link>
          <Link href="/speaking" className="btn btn-secondary">
            Book Speaking Enquiry
          </Link>
        </div>
        <p className="footer-closing-privacy">
          Because many of these conversations are deeply personal, we protect the privacy of those
          who attend. Images shared here reflect the atmosphere of our gatherings while honoring the
          confidentiality of those present.
        </p>
      </div>
    </section>
  );
}
