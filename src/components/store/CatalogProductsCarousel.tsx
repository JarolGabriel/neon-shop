"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FeaturedProductCard } from "@/components/store/FeaturedProductCard";
import type { CatalogProduct } from "@/types/product";
import { cn } from "@/lib/utils";

const GAP_PX = 12;
const SECONDS_PER_ITEM = 7;
const WHEEL_MULTIPLIER = 2.2;
const MOBILE_VISIBLE_COUNT = 2;
const DESKTOP_VISIBLE_COUNT = 6;

interface CatalogProductsCarouselProps {
  products: CatalogProduct[];
  ariaLabel: string;
}

export function CatalogProductsCarousel({
  products,
  ariaLabel,
}: CatalogProductsCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const manualModeRef = useRef(false);
  const offsetRef = useRef(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(DESKTOP_VISIBLE_COUNT);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateVisibleCount = () => {
      setVisibleCount(
        mediaQuery.matches ? DESKTOP_VISIBLE_COUNT : MOBILE_VISIBLE_COUNT,
      );
    };

    updateVisibleCount();
    mediaQuery.addEventListener("change", updateVisibleCount);
    return () => mediaQuery.removeEventListener("change", updateVisibleCount);
  }, []);

  const shouldAutoScroll = products.length > visibleCount;
  const loopProducts = shouldAutoScroll
    ? [...products, ...products]
    : products;
  const loopWidth = (cardWidth + GAP_PX) * products.length;
  const durationSec = Math.max(products.length * SECONDS_PER_ITEM, 20);

  const updateCardWidth = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const gaps = GAP_PX * Math.max(visibleCount - 1, 0);
    const next = Math.floor((viewport.clientWidth - gaps) / visibleCount);
    setCardWidth(next > 0 ? next : 0);
  }, [visibleCount]);

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
    if (!track || !manualModeRef.current) return;

    manualModeRef.current = false;
    offsetRef.current = 0;
    track.style.transform = "";
    track.style.animation = `marquee ${durationSec}s linear infinite`;
  }, [durationSec]);

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
      const base = manualModeRef.current ? offsetRef.current : 0;
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
        aria-label={ariaLabel}
      >
        {loopProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="shrink-0"
            style={cardWidth > 0 ? { width: cardWidth } : undefined}
          >
            <FeaturedProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
