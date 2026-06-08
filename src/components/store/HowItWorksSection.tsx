"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { HOW_IT_WORKS_STEPS } from "@/components/store/how-it-works-data";
import { cn } from "@/lib/utils";

interface HowItWorksSectionProps {
  className?: string;
}

function HowItWorksStepCard({
  number,
  title,
  description,
  imageSrc,
  imageAlt,
  className,
}: (typeof HOW_IT_WORKS_STEPS)[number] & { className?: string }) {
  return (
    <li
      className={cn(
        "flex w-full min-w-full shrink-0 snap-center flex-col md:min-w-0 md:w-auto md:shrink",
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center"
          draggable={false}
        />
      </div>

      <div className="flex flex-1 flex-col bg-muted px-4 py-5 sm:px-5 sm:py-6">
        <h3 className="font-heading text-base font-bold leading-snug text-foreground">
          {number}. {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
          {description}
        </p>
      </div>
    </li>
  );
}

export function HowItWorksSection({ className }: HowItWorksSectionProps) {
  const trackRef = useRef<HTMLOListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    Array.from(track.children).forEach((child, index) => {
      const slide = child as HTMLElement;
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(slideCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    track.addEventListener("scroll", updateActiveIndex, { passive: true });
    updateActiveIndex();

    const observer = new ResizeObserver(updateActiveIndex);
    observer.observe(track);

    return () => {
      track.removeEventListener("scroll", updateActiveIndex);
      observer.disconnect();
    };
  }, [updateActiveIndex]);

  const scrollToSlide = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <section
      className={cn("w-full bg-background py-12 md:py-16", className)}
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="how-it-works-heading"
          className="mb-10 text-center font-heading text-2xl font-bold text-foreground sm:text-3xl"
        >
          Cómo funciona
        </h2>

        <ol
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-none md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:pb-0 lg:grid-cols-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {HOW_IT_WORKS_STEPS.map((step) => (
            <HowItWorksStepCard key={step.id} {...step} />
          ))}
        </ol>

        <div
          className="mt-4 flex justify-center gap-2 md:hidden"
          role="tablist"
          aria-label="Pasos del proceso"
        >
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-label={`Paso ${index + 1}: ${step.title}`}
              aria-selected={activeIndex === index}
              onClick={() => scrollToSlide(index)}
              className={cn(
                "size-2.5 rounded-full transition-colors",
                activeIndex === index
                  ? "bg-vite-purple dark:bg-cyber-yellow"
                  : "bg-muted-foreground/40",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
