"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SUBSTACK_PUBLICATION_SUBSCRIBE_URL } from "@/lib/data/site";

const SUBSTACK_ICON_SRC =
  "https://substackcdn.com/image/fetch/w_96,c_limit,f_auto,q_auto:good/https%3A%2F%2Fsubstack.com%2Fimg%2Fsubstack-app-icon.png";

// Shared convex curve geometry.
// - Image clip uses normalized objectBoundingBox coords so it scales with any panel size.
// - Background path uses userSpaceOnUse in a 1440x340 viewBox; with preserveAspectRatio="none"
//   it stretches to match the banner dimensions so the two curves stay visually aligned.
const IMAGE_CLIP_PATH_D = "M0,0 L0.84,0 Q1,0.5 0.84,1 L0,1 Z";
const BACKGROUND_PATH_D = "M420,0 Q500,170 420,340 L1440,340 L1440,0 Z";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -22]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -12]);
  const portraitClipId = "reflections-hero-portrait-clip";
  const bgGradientId = "reflections-hero-bg-gradient";

  return (
    <section className="relative isolate w-full bg-[#d6bdb7] pt-20 md:pt-0">
      {/* Shared SVG <defs> for the objectBoundingBox clip applied to the HTML portrait */}
      <svg className="absolute h-0 w-0" aria-hidden focusable="false">
        <defs>
          <clipPath id={portraitClipId} clipPathUnits="objectBoundingBox">
            <path d={IMAGE_CLIP_PATH_D} />
          </clipPath>
        </defs>
      </svg>

      {/* Desktop banner: matches speaking page hero height */}
      <div className="relative hidden min-h-[clamp(420px,76vh,760px)] w-full overflow-hidden md:block">
        {/* Right-of-curve gradient fill — anchored to the same convex curve math as the portrait clip */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 340"
          preserveAspectRatio="none"
          aria-hidden
          focusable="false"
        >
          <defs>
            <linearGradient id={bgGradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c4a49a" />
              <stop offset="100%" stopColor="#d6bdb7" />
            </linearGradient>
          </defs>
          <path d={BACKGROUND_PATH_D} fill={`url(#${bgGradientId})`} />
        </svg>

        {/* Portrait panel — full banner height, clipped by the convex ) curve */}
        <motion.div
          style={{ y: imageY, clipPath: `url(#${portraitClipId})` }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-y-0 left-0 w-[clamp(360px,45vw,680px)]"
        >
          <Image
            src="/assets/images/GSON2462.jpg"
            alt="Tobi Yusuf portrait"
            fill
            sizes="(max-width: 1200px) 45vw, 680px"
            className="object-cover object-[35%_28%]"
            priority
          />
        </motion.div>

        {/* Soft parallax glow behind the portrait */}
        <motion.div
          style={{ y: glowY }}
          className="pointer-events-none absolute left-[10%] top-1/2 h-[340px] w-[340px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(61,31,43,0.14)_0%,rgba(61,31,43,0.06)_42%,transparent_74%)] blur-[54px]"
          aria-hidden
        />

        {/* Readability wash over the text area */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[60%] bg-[linear-gradient(90deg,rgba(61,31,43,0)_0%,rgba(61,31,43,0.08)_42%,rgba(61,31,43,0.18)_100%)]"
          aria-hidden
        />

        {/* Text column on the right */}
        <div className="relative z-[2] mx-auto flex min-h-[inherit] w-full max-w-[1220px] items-end px-8 pb-[clamp(3rem,8vh,5rem)] pt-[clamp(5rem,10vh,7rem)] lg:px-10">
          <div className="ml-auto flex w-full max-w-[620px] flex-col gap-5 pl-[clamp(0px,4vw,48px)] md:w-[min(640px,58%)]">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="text-left font-[var(--font-playfair-display)] text-[clamp(2.8rem,5.6vw,4.6rem)] leading-[0.95] tracking-[-0.024em] text-[var(--anchor)]"
            >
              Reflections
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[580px] text-left text-[1rem] leading-[1.75rem] text-[var(--anchor)]/86 lg:text-[1.08rem] lg:leading-[1.95rem]"
            >
              Over the years, I&apos;ve had many conversations with couples, women, and friends navigating
              different seasons of marriage. These reflections are observations and lessons drawn from real
              conversations and lived experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.58, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="mt-1 flex justify-start"
            >
              <Link
                href={SUBSTACK_PUBLICATION_SUBSCRIBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-[var(--anchor)]/22 bg-[rgba(250,247,244,0.92)] px-6 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--anchor)] shadow-[0_10px_30px_-18px_rgba(61,31,43,0.4)] transition duration-300 ease-in-out hover:-translate-y-[1px] hover:border-[var(--anchor)]/34 hover:bg-[rgba(250,247,244,1)] active:translate-y-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- external Substack icon */}
                <img
                  src={SUBSTACK_ICON_SRC}
                  alt=""
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px] rounded-[4px]"
                />
                Subscribe
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile: stacked, image on top with gentle curved base, text below */}
      <div className="relative flex w-full flex-col gap-8 px-4 pb-14 pt-2 sm:px-6 md:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto flex h-[clamp(340px,52vh,440px)] w-full max-w-[380px] items-end justify-center"
        >
          <div className="relative h-full w-full overflow-hidden rounded-b-[140px] rounded-t-[18px] border border-[var(--soft)]/25">
            <Image
              src="/assets/images/GSON2462.jpg"
              alt="Tobi Yusuf portrait"
              fill
              sizes="380px"
              className="object-cover object-[center_22%]"
              priority
            />
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-5 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="text-center font-[var(--font-playfair-display)] text-[clamp(2.4rem,8vw,3.4rem)] leading-[0.95] tracking-[-0.02em] text-[var(--anchor)]"
          >
            Reflections
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[36ch] text-center text-[0.98rem] leading-[1.7rem] text-[var(--anchor)]/88"
          >
            Over the years, I&apos;ve had many conversations with couples, women, and friends navigating
            different seasons of marriage. These reflections are observations and lessons drawn from real
            conversations and lived experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-1 flex w-full justify-center"
          >
            <Link
              href={SUBSTACK_PUBLICATION_SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-[var(--anchor)]/22 bg-[rgba(250,247,244,0.92)] px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--anchor)] shadow-[0_10px_30px_-18px_rgba(61,31,43,0.4)] transition duration-300 ease-in-out hover:-translate-y-[1px] hover:border-[var(--anchor)]/34 hover:bg-[rgba(250,247,244,1)] active:translate-y-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- external Substack icon */}
              <img
                src={SUBSTACK_ICON_SRC}
                alt=""
                width={18}
                height={18}
                className="h-[18px] w-[18px] rounded-[4px]"
              />
              Subscribe
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
