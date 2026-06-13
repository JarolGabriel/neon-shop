"use client";

import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { useDragScroll } from "@/hooks/useDragScroll";
import { cn } from "@/lib/utils";
import type { CatalogProduct } from "@/types/product";

interface RecentlyViewedProps {
  products: CatalogProduct[];
  title?: string;
}

const ITEM_CLASS =
  "w-[78%] shrink-0 snap-start sm:w-[44%] md:w-[32%] lg:w-[24%] xl:w-[20%]";

export function RecentlyViewed({
  products,
  title = "Visto recientemente",
}: RecentlyViewedProps) {
  const { ref: scrollRef, isDragging, dragProps } =
    useDragScroll<HTMLUListElement>();
  const [pageCount, setPageCount] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;
    setPageCount(Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth)));
    setActivePage(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      observer.disconnect();
    };
  }, [updateScrollState, products.length]);

  const goToPage = useCallback((page: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: page * el.clientWidth, behavior: "smooth" });
  }, []);

  if (products.length === 0) return null;

  return (
    <section
      className="w-full py-8 sm:py-12"
      aria-label={title}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-5 border-l-4 border-vite-purple pl-3 font-heading text-xl font-bold text-foreground dark:border-cyber-yellow sm:mb-6 sm:text-2xl lg:text-3xl">
          {title}
        </h2>
      </div>

      <ul
        ref={scrollRef}
        {...dragProps}
        className={cn(
          "flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pl-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:pl-6 lg:mx-auto lg:max-w-7xl lg:pl-8 lg:pr-8 [&::-webkit-scrollbar]:hidden",
          isDragging
            ? "cursor-grabbing snap-none select-none"
            : "lg:cursor-grab",
        )}
      >
        {products.map((product) => (
          <li key={product.id} className={ITEM_CLASS}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {pageCount > 1 && (
          <div
            className="mt-3 flex justify-center gap-1.5 sm:mt-4"
            role="tablist"
            aria-label="Navegación del carrusel"
          >
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activePage}
              aria-label={`Ir al grupo ${i + 1} de ${pageCount}`}
              onClick={() => goToPage(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activePage
                  ? "w-6 bg-vite-purple dark:bg-cyber-yellow"
                  : "w-1.5 bg-foreground/30 hover:bg-foreground/60",
              )}
            />
          ))}
          </div>
        )}
      </div>
    </section>
  );
}
