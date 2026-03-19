"use client";

import { INSTAGRAM_URL, SUBSTACK_SUBSCRIBE_URL } from "@/lib/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-top">
        <div>
          <a href="/" className="footer-brand-logo">
            Tobi Yusuf
          </a>
          <p className="footer-tagline">From the bedroom to the boardroom.</p>
        </div>
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Navigate</h4>
            <ul>
              <li>
                <a href="/#about">About</a>
              </li>
              <li>
                <a href="/#experiences">Experiences</a>
              </li>
              <li>
                <a href="/#offers">Work With Tobi</a>
              </li>
              <li>
                <a href="/reflections">Reflections</a>
              </li>
              <li>
                <a href="/#contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Experiences</h4>
            <ul>
              <li>
                <a href="/book/intentional-space">Intentional Space</a>
              </li>
              <li>
                <a href="/#experiences">Charlotte Tilbury Evening</a>
              </li>
              <li>
                <a href="/#experiences">Forever &amp; A Day</a>
              </li>
              <li>
                <a href="/#experiences">Forever Table</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={SUBSTACK_SUBSCRIBE_URL} target="_blank" rel="noopener noreferrer">
                  Substack
                </a>
              </li>
              <li>
                <a href="/#contact">Get in Touch</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copy">&copy; {new Date().getFullYear()} Tobi Yusuf. All rights reserved.</p>
        <p className="footer-faith">
          &ldquo;Commit your work to the Lord, and your plans will be established.&rdquo; — Proverbs
          16:3
        </p>
      </div>
    </footer>
  );
}
