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
      "Every reflection felt like a mirror and a map. I left with language for things I could feel but had never named.",
    author: "Amina, Lagos",
  },
  {
    quote:
      "Tobi writes with grace and precision. Her words bring clarity without judgment, and that changed how we communicate at home.",
    author: "Married Couple, London",
  },
  {
    quote:
      "This is not surface-level advice. The reflections are grounded, practical, and deeply human.",
    author: "Ebere, Abuja",
  },
  {
    quote:
      "I revisit these pieces whenever I feel stuck. They always return me to honesty, courage, and compassion.",
    author: "Kemi, Toronto",
  },
  {
    quote:
      "Each note carries both warmth and structure. It feels like being seen and challenged in the same breath.",
    author: "Lara, Accra",
  },
];

export function TestimonialSlider() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  const cards = useMemo(
    () =>
      TESTIMONIALS.map((testimonial) => (
        <SwiperSlide key={`${testimonial.author}-${testimonial.quote.slice(0, 20)}`}>
          <article className="reflections-testimonial-card h-full rounded-xl bg-[#2a2c4a] p-6 shadow-[0_20px_46px_rgba(0,0,0,0.32)] md:p-6">
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
        spaceBetween={18}
        speed={820}
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
        className="!pb-2 reflections-testimonial-swiper"
      >
        {cards}
      </Swiper>

      <div className="mt-7 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => swiper?.slidePrev()}
          className="reflections-slider-nav"
          aria-label="Previous testimonial"
        >
          <span aria-hidden>←</span>
        </button>
        <button
          type="button"
          onClick={() => swiper?.slideNext()}
          className="reflections-slider-nav"
          aria-label="Next testimonial"
        >
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
