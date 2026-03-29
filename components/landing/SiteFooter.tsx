"use client";

import Link from "next/link";
import {
  INSTAGRAM_URL,
  LINKEDIN_URL,
  SUBSTACK_SUBSCRIBE_URL,
} from "@/lib/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="footer-top">
        <div>
          <Link href="/" className="footer-brand-logo">
            Tobi Yusuf
          </Link>
          <p className="footer-tagline">From the bedroom to the boardroom.</p>
        </div>
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Navigate</h4>
            <ul>
              <li>
                <Link href="/#about">About</Link>
              </li>
              <li>
                <Link href="/#experiences">Experiences</Link>
              </li>
              <li>
                <Link href="/#offers">Work With Tobi</Link>
              </li>
              <li>
                <Link href="/reflections">Reflections</Link>
              </li>
              <li>
                <Link href="/#contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Experiences</h4>
            <ul>
              <li>
                <Link href="/book/intentional-space">Intentional Space</Link>
              </li>
              <li>
                <Link href="/#experiences">Charlotte Tilbury Evening</Link>
              </li>
              <li>
                <Link href="/#experiences">Forever &amp; A Day</Link>
              </li>
              <li>
                <Link href="/#experiences">Forever Table</Link>
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
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <Link href="/#contact">Get in Touch</Link>
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
