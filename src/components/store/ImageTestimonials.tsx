"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useStoreName } from "@/context/SiteBrandingContext";
import { cn } from "@/lib/utils";

interface ImageTestimonial {
  id: string;
  name: string;
  imageSrc: string;
  comment: string;
  date: string;
}

const IMAGE_TESTIMONIALS: ImageTestimonial[] = [
  {
    id: "1",
    name: "Daniel Gonzales",
    imageSrc: "/images/whatssap-testimonial/testimonial-foto4.jpeg",
    comment:
      "Mi hermano ese letrero una maravilla, quedo super bellizimo, muchas gracias por su exelente trabajo 🥰",
    date: "12/04/2026",
  },
  {
    id: "2",
    name: "Css Cachipal",
    imageSrc: "/images/whatssap-testimonial/testimonial-foto3.jpeg",
    comment: "Mil gracias , Ya recibi el letrero. Super enamorada del resultado.",
    date: "28/11/2025",
  },
  {
    id: "3",
    name: "Dameer Yea",
    imageSrc: "/images/whatssap-testimonial/testimonial-foto2.jpeg",
    comment:
      "Lo ame, gacias de verdad 😘🙌 super encantada con su trabajo.. siii super hermoso",
    date: "15/01/2026",
  },
  {
    id: "4",
    name: "Blossom",
    imageSrc: "/images/whatssap-testimonial/testimonila-foto1.jpeg",
    comment: "Wow wow que espectacular, tiene mucha calidad",
    date: "03/09/2025",
  },
  {
    id: "5",
    name: "Antonio Carrascos",
    imageSrc: "/images/whatssap-testimonial/testimonial-foto5.webp",
    comment: "Entregado rapido, Tiene una pinta increible",
    date: "22/02/2026",
  },
  {
    id: "6",
    name: "Nany suarez",
    imageSrc: "/images/whatssap-testimonial/testimonial-foto6.avif",
    comment:
      "No tengo ninguna queja gran trabajo, voy a pedir otro letrero y los recomendare mucho si alguien pregunta",
    date: "18/05/2026",
  },
];

const CARD_GLOW =
  "transition-shadow duration-300 shadow-[-4px_8px_16px_-10px] shadow-neon-pink/8 dark:shadow-cyber-yellow/8 md:hover:shadow-[-6px_12px_22px_-8px] md:hover:shadow-neon-pink/16 dark:md:hover:shadow-cyber-yellow/14";

function MiniStars({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-0.5", className)} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className="size-3.5 fill-vite-purple text-vite-purple dark:fill-cyber-yellow dark:text-cyber-yellow"
        />
      ))}
    </div>
  );
}

function TestimonialCard({ item }: { item: ImageTestimonial }) {
  return (
    <article
      className={cn(
        "flex items-center gap-4 rounded-3xl border border-border bg-card/40 p-4 backdrop-blur-md md:items-stretch sm:p-5",
        CARD_GLOW,
      )}
    >
      <div className="relative size-24 shrink-0 self-center overflow-hidden rounded-2xl md:self-auto sm:size-28">
        <Image
          src={item.imageSrc}
          alt={`Letrero de neón de ${item.name}`}
          fill
          sizes="(max-width: 768px) 96px, 112px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <MiniStars />
        <p className="text-sm leading-relaxed text-foreground">{item.comment}</p>
        <p className="font-bold text-foreground">{item.name}</p>
        <p className="text-xs text-muted-foreground">{item.date}</p>
      </div>
    </article>
  );
}

const NAV_BTN =
  "flex size-10 items-center justify-center rounded-full border border-border bg-card/60 text-foreground backdrop-blur-md transition-colors duration-200 hover:bg-card disabled:pointer-events-none disabled:opacity-40";

const AUTO_PLAY_MS = 5000;

export function ImageTestimonials() {
  const storeName = useStoreName();
  const [slideIndex, setSlideIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setVisibleCount(media.matches ? 3 : 1);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const maxSlideIndex = Math.max(
    0,
    IMAGE_TESTIMONIALS.length - visibleCount,
  );

  useEffect(() => {
    setSlideIndex((current) => Math.min(current, maxSlideIndex));
  }, [maxSlideIndex]);

  const goPrev = useCallback(
    () => setSlideIndex((i) => Math.max(0, i - 1)),
    [],
  );
  const goNext = useCallback(
    () => setSlideIndex((i) => (i >= maxSlideIndex ? 0 : i + 1)),
    [maxSlideIndex],
  );

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current >= maxSlideIndex ? 0 : current + 1));
    }, AUTO_PLAY_MS);

    return () => window.clearInterval(timer);
  }, [maxSlideIndex]);

  const visible = IMAGE_TESTIMONIALS.slice(
    slideIndex,
    slideIndex + visibleCount,
  );

  return (
    <section className="py-12 md:py-16" aria-labelledby="image-testimonials-heading">
      <header className="mb-8 px-4 text-center md:mb-10">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Image src="/icon.svg" alt="" width={36} height={36} className="shrink-0" />
          <h2
            id="image-testimonials-heading"
            className="font-heading text-xl font-semibold text-foreground sm:text-2xl"
          >
            {storeName} . Opiniones verificadas de clientes
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-foreground">
          <div className="flex gap-0.5" aria-label="5 de 5 estrellas">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className="size-4 fill-vite-purple text-vite-purple dark:fill-cyber-yellow dark:text-cyber-yellow"
              />
            ))}
          </div>
          <span>más de 200 reseñas</span>
          <BadgeCheck className="size-5 text-emerald-500 dark:text-cyan-400" aria-hidden="true" />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="grid grid-cols-1 justify-items-center gap-4 md:grid-cols-3 md:justify-items-stretch"
          >
            {visible.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-center gap-6">
          <button type="button" onClick={goPrev} disabled={slideIndex === 0} className={NAV_BTN} aria-label="Reseñas anteriores">
            <ChevronLeft className="size-5" />
          </button>
          <button type="button" onClick={goNext} className={NAV_BTN} aria-label="Reseñas siguientes">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
