"use client";

import { useEffect } from "react";

export function useAnimateIn() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".animate-in"));

    if (prefersReducedMotion) {
      targets.forEach((el) => el.classList.add("visible"));
      return;
    }

    targets.forEach((el, i) => {
      if (!el.dataset.staggerIndex) el.dataset.staggerIndex = String(i);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.staggerIndex || "0");
            setTimeout(() => entry.target.classList.add("visible"), Math.min(idx * 45, 260));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
