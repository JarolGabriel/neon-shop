"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FeaturedCategoryCard } from "@/components/store/FeaturedCategoryCard";
import type { CategoryWithCount } from "@/lib/api";
import { cn } from "@/lib/utils";

const GAP_PX = 12;
const SECONDS_PER_CATEGORY = 4.5;
const WHEEL_MULTIPLIER = 2.2;

interface ShowroomCategoriesCarouselProps {
  categories: CategoryWithCount[];
}

export function ShowroomCategoriesCarousel({
  categories,
}: ShowroomCategoriesCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const manualModeRef = useRef(false);
  const offsetRef = useRef(0);
  const [cardWidth, setCardWidth] = useState(0);

  const shouldAutoScroll = categories.length > 3;
  const loopCategories = shouldAutoScroll
    ? [...categories, ...categories]
    : categories;
  const loopWidth = (cardWidth + GAP_PX) * categories.length;
  const durationSec = Math.max(categories.length * SECONDS_PER_CATEGORY, 12);

  const updateCardWidth = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const next = Math.floor((viewport.clientWidth - GAP_PX * 2) / 3);
    setCardWidth(next > 0 ? next : 0);
  }, []);

  const wrapOffset = useCallback(
    (offset: number) => {
      if (loopWidth <= 0) return offset;
      let next = offset;
      while (next <= -loopWidth) next += loopWidth;
      while (next > 0) next -= loopWidth;
      return next;
    },
    [loopWidth],
  );

  const applyManualOffset = useCallback(
    (offset: number) => {
      const track = trackRef.current;
      if (!track) return;

      offsetRef.current = wrapOffset(offset);
      track.style.animation = "none";
      track.style.transform = `translateX(${offsetRef.current}px)`;
      manualModeRef.current = true;
    },
    [wrapOffset],
  );

  const resumeAutoAnimation = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    manualModeRef.current = false;
    offsetRef.current = 0;
    track.style.animation = "";
    track.style.transform = "";
  }, []);

  useEffect(() => {
    updateCardWidth();
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new ResizeObserver(updateCardWidth);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [updateCardWidth]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !shouldAutoScroll) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const delta = event.deltaY * WHEEL_MULTIPLIER;
      const base = manualModeRef.current
        ? offsetRef.current
        : 0;
      applyManualOffset(base - delta);
    };

    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [applyManualOffset, shouldAutoScroll]);

  return (
    <div
      ref={viewportRef}
      className="w-full min-w-0 overflow-hidden"
      onMouseLeave={resumeAutoAnimation}
    >
      <div
        ref={trackRef}
        className={cn(
          "flex w-max gap-3",
          shouldAutoScroll &&
            cardWidth > 0 &&
            "motion-safe:animate-marquee hover:[animation-play-state:paused]",
        )}
        style={
          shouldAutoScroll && cardWidth > 0
            ? { animationDuration: `${durationSec}s` }
            : undefined
        }
        aria-label="Categorías destacadas"
      >
        {loopCategories.map((category, index) => (
          <div
            key={`${category.id}-${index}`}
            className="shrink-0"
            style={cardWidth > 0 ? { width: cardWidth } : undefined}
          >
            <FeaturedCategoryCard category={category} />
          </div>
        ))}
      </div>
    </div>
  );
}
