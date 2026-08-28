"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_IMAGES } from "@/lib/data/site-images";

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

const LINKS: [string, string][] = [
  ["Home", "/"],
  ["About", "#about"],
  ["Speaking", "/speaking"],
  ["Experiences", "#experiences"],
  ["Reflections", "/reflections"],
  ["Contact", "#contact"],
];

export function SiteNav() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const path = (pathname ?? "").replace(/\/$/, "") || "/";
  const solidNav =
    path === "/reflections" ||
    path === "/start" ||
    path.startsWith("/book") ||
    path.startsWith("/speaking");
  const prefix = pathname === "/" ? "" : "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useBodyScrollLock(navOpen);

  const menuOverlay = (
    <div className="nav-mobile-overlay" aria-modal="true" role="dialog" aria-label="Navigation menu">
      <button
        type="button"
        className="nav-toggle is-open nav-mobile-close"
        aria-label="Close menu"
        onClick={() => setNavOpen(false)}
      >
        <span />
        <span />
        <span />
      </button>
      <ul className="nav-links open" id="navLinks" role="menu">
        {LINKS.map(([label, href]) => {
          const fullHref = href.startsWith("/") ? href : `${prefix}${href}`;
          return (
            <li key={label} role="none">
              <a href={fullHref} onClick={() => setNavOpen(false)} role="menuitem">
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <nav
      id="mainNav"
      className={[
        scrolled || solidNav ? "scrolled" : "",
        solidNav ? "nav-on-light" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="nav-inner">
        <Link href="/" className="nav-logo" onClick={() => setNavOpen(false)}>
          <span className="nav-logo-mark" aria-hidden>
            <Image
              src={SITE_IMAGES.favicon}
              alt=""
              fill
              sizes="44px"
              className="nav-logo-img"
            />
          </span>
          <span className="nav-logo-text">Tobi Yusuf</span>
        </Link>
        <ul className="nav-links" id="navLinksDesktop" aria-hidden>
          {LINKS.map(([label, href]) => {
            const fullHref = href.startsWith("/") ? href : `${prefix}${href}`;
            return (
              <li key={label}>
                <a href={fullHref}>{label}</a>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className={`nav-toggle${navOpen ? " is-open" : ""}`}
          id="navToggle"
          aria-label={navOpen ? "Close menu" : "Open menu"}
          aria-expanded={navOpen}
          onClick={() => setNavOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile overlay portalled to body so it escapes all stacking contexts */}
      {mounted && navOpen && createPortal(menuOverlay, document.body)}
    </nav>
  );
}
