"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SUBSTACK_PUBLICATION_SUBSCRIBE_URL } from "@/lib/data/site";
import { TestimonialSlider } from "@/components/reflections/TestimonialSlider";

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const imageY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -24]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -12]);

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(124deg,var(--anchor)_0%,#2f1824_46%,#4b2940_100%)] pt-28">
      <div className="reflections-hero-vignette pointer-events-none absolute inset-0 z-[1]" aria-hidden />
      <div className="reflections-hero-grain pointer-events-none absolute inset-0 z-[2]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_70%_30%,rgba(212,170,153,0.2),transparent_42%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-24 z-[2] h-40 w-px -translate-x-1/2 bg-gradient-to-b from-[rgba(212,170,153,0.8)] to-transparent md:left-[59%] md:top-28"
        aria-hidden
      />

      <div className="relative z-[3] mx-auto grid w-full max-w-[1320px] items-end gap-6 px-4 pb-16 sm:px-6 md:grid-cols-[0.98fr_1.02fr] md:gap-10 md:pb-20 lg:px-8">
        <motion.div
          style={{ y: imageY }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex min-h-[360px] items-end justify-center md:min-h-[650px] md:justify-start"
        >
          <motion.div
            style={{ y: glowY }}
            className="pointer-events-none absolute bottom-12 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,120,64,0.52)_0%,rgba(255,92,46,0.25)_42%,transparent_78%)] blur-[56px] md:bottom-24 md:left-10 md:h-[420px] md:w-[420px] md:translate-x-0"
            aria-hidden
          />
          <div className="relative h-[350px] w-[300px] md:h-[640px] md:w-[560px] md:-translate-x-14 lg:-translate-x-24">
            <Image
              src="/assets/images/GSON2809.jpg"
              alt="Tobi Yusuf portrait"
              fill
              sizes="(max-width: 768px) 300px, (max-width: 1200px) 44vw, 560px"
              className="object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
              priority
            />
          </div>
        </motion.div>

        <div className="flex flex-col justify-end pb-2 md:pb-5">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.54, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 text-center text-[0.7rem] uppercase tracking-[0.34em] text-[var(--signature-light)]/88 md:text-left"
          >
            Reflections
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-center font-[var(--font-display)] text-[clamp(2.8rem,10.2vw,7rem)] leading-[0.92] tracking-[-0.024em] text-[var(--text-on-dark)] md:text-left"
          >
            <span className="block">Tobi Yusuf</span>
            <span className="mt-2 block text-[var(--soft)]/95">Reflections</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-xl text-center text-[1rem] leading-8 text-[var(--text-on-dark)]/80 md:mx-0 md:text-left md:text-[1.06rem] md:leading-[2.05rem]"
          >
            Over the years, I&apos;ve had many conversations with couples, women, and friends navigating
            different seasons of marriage. These reflections are observations and lessons drawn from real
            conversations and lived experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex justify-center md:block"
          >
            <Link
              href={SUBSTACK_PUBLICATION_SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-[#f5f5f5]/55 bg-[#f5f5f5] px-8 py-4 text-[0.74rem] font-semibold uppercase tracking-[0.22em] text-[#181a28] transition duration-300 ease-in-out hover:-translate-y-[1px] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(245,245,245,0.4)] active:translate-y-0 active:scale-100"
            >
              Tobi Yusuf Reflection
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <TestimonialSlider />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
