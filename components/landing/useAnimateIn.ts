"use client";

import { useEffect } from "react";

export function useAnimateIn() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 60);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    document.querySelectorAll(".animate-in").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
