"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  /** Light heroes: solid bar + dark text from first paint (see #mainNav.nav-on-light). */
  const path = (pathname ?? "").replace(/\/$/, "") || "/";
  const solidNav =
    path === "/reflections" || path.startsWith("/book") || path.startsWith("/speaking");
  const prefix = pathname === "/" ? "" : "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useBodyScrollLock(navOpen);

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
          Tobi Yusuf
        </Link>
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
        <ul className={`nav-links${navOpen ? " open" : ""}`} id="navLinks">
          {LINKS.map(([label, href]) => {
            const fullHref = href.startsWith("/") ? href : `${prefix}${href}`;
            return (
              <li key={label}>
                <a href={fullHref} onClick={() => setNavOpen(false)}>
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
