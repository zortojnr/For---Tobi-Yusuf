"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LINKS: [string, string][] = [
  ["About", "#about"],
  ["Speaking", "#speaking"],
  ["Experiences", "#experiences"],
  ["Reflections", "/reflections"],
  ["Contact", "#contact"],
];

export function SiteNav() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const prefix = pathname === "/" ? "" : "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav id="mainNav" className={scrolled ? "scrolled" : ""}>
      <div className="nav-inner">
        <a href="/" className="nav-logo" onClick={() => setNavOpen(false)}>
          Tobi Yusuf
        </a>
        <button
          type="button"
          className="nav-toggle"
          id="navToggle"
          aria-label="Open menu"
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
