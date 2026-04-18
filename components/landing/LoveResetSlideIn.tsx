"use client";

import { useEffect, useRef, useState } from "react";
import {
  markLoveResetDismissed,
  markLoveResetSlideShownThisSession,
  shouldSuppressLoveResetSlide,
} from "@/lib/love-reset-prompt-storage";
import { LoveResetSubscribeForm } from "@/components/landing/LoveResetSubscribeForm";

const SCROLL_FRACTION = 0.5;
const TIMER_MS = 45_000;

export function LoveResetSlideIn() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const openedRef = useRef(false);
  const scrollTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (shouldSuppressLoveResetSlide()) return;

    let disarmed = false;
    const disarm = () => {
      if (disarmed) return;
      disarmed = true;
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
      window.removeEventListener("scroll", onScroll);
    };

    function tryOpen() {
      if (openedRef.current) return;
      if (shouldSuppressLoveResetSlide()) {
        openedRef.current = true;
        disarm();
        return;
      }
      openedRef.current = true;
      disarm();
      markLoveResetSlideShownThisSession();
      setOpen(true);
      requestAnimationFrame(() => setEntered(true));
    }

    function onScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      if (scrollable <= 0) {
        tryOpen();
        return;
      }
      if (y + window.innerHeight >= SCROLL_FRACTION * doc.scrollHeight) {
        tryOpen();
      }
    }

    scrollTimerRef.current = window.setTimeout(tryOpen, TIMER_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      disarm();
    };
  }, [mounted]);

  const close = () => {
    setEntered(false);
    markLoveResetDismissed();
    window.setTimeout(() => setOpen(false), reducedMotion ? 0 : 380);
  };

  if (!open) return null;

  return (
    <div
      className={`love-reset-slide${entered ? " love-reset-slide--visible" : ""}${reducedMotion ? " love-reset-slide--reduced" : ""}`}
      role="region"
      aria-labelledby="love-reset-slide-title"
    >
      <div className="love-reset-slide-inner">
        <button
          type="button"
          className="love-reset-slide-close"
          onClick={close}
          aria-label="Close"
        >
          ×
        </button>
        <h2 id="love-reset-slide-title" className="love-reset-slide-title">
          Before you go any further, this is free.
        </h2>
        <p className="love-reset-slide-body">
          The Love Reset Audio is a gentle 5-day experience for you and your partner. No cost. No fluff.
          Just my voice and a space to breathe.
        </p>
        <LoveResetSubscribeForm
          variant="slide"
          idPrefix="lr-slide"
          onSuccess={() => {
            window.setTimeout(() => {
              setEntered(false);
              window.setTimeout(() => setOpen(false), reducedMotion ? 0 : 380);
            }, 1600);
          }}
        />
        <button type="button" className="love-reset-slide-dismiss" onClick={close}>
          Not now
        </button>
      </div>
    </div>
  );
}
