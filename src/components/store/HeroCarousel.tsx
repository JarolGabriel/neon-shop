"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  getHeroCtaVariant,
  HeroCtaButtons,
} from "@/components/store/hero-cta-buttons";
import { cn } from "@/lib/utils";
import type { HeroSlide } from "@/types/promotion";

const SLIDE_INTERVAL_MS = 5000;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

interface HeroCarouselProps {
  slides: HeroSlide[];
}

interface HeroSlideContentProps {
  slide: HeroSlide;
  slideIndex: number;
}

function HeroSlideContent({ slide, slideIndex }: HeroSlideContentProps) {
  return (
    <div className="relative flex h-full min-h-[36rem] w-full flex-col items-center justify-center px-4 pt-24 pb-16 sm:min-h-[40rem] sm:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${slide.imageUrl})` }}
        role="img"
        aria-label={slide.title}
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide text-white sm:text-4xl lg:text-5xl">
          {slide.title}
        </h1>

        {slide.description ? (
          <p className="max-w-2xl text-base text-white sm:text-lg">
            {slide.description}
          </p>
        ) : null}

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <HeroCtaButtons variant={getHeroCtaVariant(slideIndex)} />
        </div>
      </div>
    </div>
  );
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [activeIndex],
  );

  const advanceSlide = useCallback(() => {
    setDirection(1);
    setActiveIndex((current) => (current + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(advanceSlide, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [advanceSlide, slides.length]);

  const activeSlide = slides[activeIndex];
  if (!activeSlide) return null;

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Promociones destacadas"
    >
      <div className="relative min-h-[36rem] sm:min-h-[40rem]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 w-full"
          >
            <HeroSlideContent slide={activeSlide} slideIndex={activeIndex} />
          </motion.div>
        </AnimatePresence>
      </div>

      {slides.length > 1 ? (
        <div
          className="absolute inset-x-0 bottom-14 z-20 flex items-center justify-center gap-2 sm:bottom-16"
          role="tablist"
          aria-label="Indicadores del carrusel"
        >
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Ir a la diapositiva ${index + 1}`}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-1 rounded-full bg-white/40 transition-all duration-300 hover:bg-white/70",
                  isActive ? "w-8 bg-white" : "w-3",
                )}
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
