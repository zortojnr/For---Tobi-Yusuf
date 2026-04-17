"use client";

import { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

type Testimonial = {
  quote: string;
  author: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Every letter feels like a mirror and a map. I leave each one with language for feelings I had never been able to name.",
    author: "Amara, New York",
  },
  {
    quote:
      "Tobi writes with rare grace and precision. The reflections brought clarity without blame, and that changed how we speak at home.",
    author: "Married Couple, London",
  },
  {
    quote:
      "This is not surface-level commentary. The reflections are grounded, practical, and deeply human in every paragraph.",
    author: "Ebere, Abuja",
  },
  {
    quote:
      "I revisit these pieces whenever I feel emotionally stuck. They always return me to honesty, courage, and compassion.",
    author: "Kemi, Toronto",
  },
  {
    quote:
      "Each reflection carries both warmth and structure. It feels like being deeply seen and gently challenged at the same time.",
    author: "Lara, Accra",
  },
];

export function TestimonialSlider() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const cards = useMemo(
    () =>
      TESTIMONIALS.map((testimonial) => (
        <SwiperSlide key={`${testimonial.author}-${testimonial.quote.slice(0, 20)}`}>
          <article className="h-full rounded-xl border border-[var(--soft)]/14 bg-[#2a2c4a]/94 p-6 shadow-[0_20px_46px_rgba(0,0,0,0.32)] backdrop-blur-[1px]">
            <p className="mb-4 text-sm tracking-[0.16em] text-[#f2c94c]" aria-label="Five star rating">
              {"★★★★★"}
            </p>
            <p className="mb-5 text-base italic leading-[1.9] text-white/90 md:text-[1.02rem]">
              {testimonial.quote}
            </p>
            <p className="text-[0.66rem] uppercase tracking-[0.22em] text-white/62">{testimonial.author}</p>
          </article>
        </SwiperSlide>
      )),
    [],
  );

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={20}
        speed={980}
        slidesPerView={1}
        loop
        onSwiper={setSwiper}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          768: { slidesPerView: 2, spaceBetween: 22 },
          1200: { slidesPerView: 3, spaceBetween: 24 },
        }}
        className="!pb-2 [--swiper-theme-color:var(--signature)]"
      >
        {cards}
      </Swiper>

      <div className="mt-8 flex items-center justify-center gap-3 md:justify-start">
        <button
          type="button"
          onClick={() => swiper?.slidePrev()}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--signature)]/45 bg-[var(--anchor)]/35 text-[var(--soft)] transition duration-300 ease-out hover:scale-[1.04] hover:border-[var(--soft)]/70 hover:bg-[var(--anchor-light)]/55"
          aria-label="Previous testimonial"
        >
          <span aria-hidden>←</span>
        </button>
        <button
          type="button"
          onClick={() => swiper?.slideNext()}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--signature)]/45 bg-[var(--anchor)]/35 text-[var(--soft)] transition duration-300 ease-out hover:scale-[1.04] hover:border-[var(--soft)]/70 hover:bg-[var(--anchor-light)]/55"
          aria-label="Next testimonial"
        >
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
