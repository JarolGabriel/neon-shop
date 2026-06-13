"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useState, type MouseEvent } from "react";
import { FavoriteButton } from "@/components/store/FavoriteButton";
import { cn } from "@/lib/utils";
import type { ProductDetailImage } from "@/types/product";

const ZOOM_SCALE = 2;

interface ProductDetailGalleryProps {
  images: ProductDetailImage[];
  productName: string;
  productId: string;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

const navButtonClass = cn(
  "absolute top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full",
  "border border-border/70 bg-background/90 text-foreground shadow-md backdrop-blur-md",
  "transition-all duration-200 hover:scale-105 hover:bg-neon-surface!",
  "hover:border-vite-purple hover:text-vite-purple! dark:hover:border-cyber-yellow dark:hover:text-cyber-yellow!",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

export function ProductDetailGallery({
  images,
  productName,
  productId,
  activeIndex,
  onActiveIndexChange,
}: ProductDetailGalleryProps) {
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const markLoaded = useCallback((id: string) => {
    setLoaded((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  }, []);

  // El zoom solo en dispositivos con hover real (desktop), no en táctiles.
  const handleMouseEnter = useCallback(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setIsZooming(true);
    }
  }, []);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-muted text-sm text-muted-foreground">
        Sin imagen
      </div>
    );
  }

  const count = images.length;
  const current = images[activeIndex] ?? images[0];
  const isLoading = !loaded.has(current.id);
  const goPrev = () => onActiveIndexChange(activeIndex === 0 ? count - 1 : activeIndex - 1);
  const goNext = () => onActiveIndexChange(activeIndex === count - 1 ? 0 : activeIndex + 1);

  return (
    <div className="flex flex-col gap-3">
      <div
        className="group/gallery relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_24px_60px_-28px] shadow-vite-purple/40 md:cursor-zoom-in dark:shadow-cyber-yellow/25"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsZooming(false)}
      >
        <FavoriteButton productId={productId} />

        {images.map((img, index) => {
          const active = index === activeIndex;
          return (
            <motion.div
              key={img.id}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: active ? 1 : 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ zIndex: active ? 1 : 0 }}
              aria-hidden={!active}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text ?? productName}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain transition-transform duration-200 ease-out md:object-cover"
                style={{
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  transform:
                    active && isZooming ? `scale(${ZOOM_SCALE})` : "scale(1)",
                }}
                priority={index === 0}
                onLoad={() => markLoaded(img.id)}
                onError={() => markLoaded(img.id)}
              />
            </motion.div>
          );
        })}

        {isLoading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/60 backdrop-blur-sm">
            <Loader2 className="size-7 animate-spin text-vite-purple dark:text-cyber-yellow" />
          </div>
        ) : null}

        {count > 1 ? (
          <>
            <button type="button" onClick={goPrev} className={cn(navButtonClass, "left-3")} aria-label="Imagen anterior">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={goNext} className={cn(navButtonClass, "right-3")} aria-label="Imagen siguiente">
              <ChevronRight className="size-5" />
            </button>
            <span className="absolute bottom-3 right-3 z-20 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-md">
              {activeIndex + 1} / {count}
            </span>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => onActiveIndexChange(index)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border transition-all duration-200 sm:size-20",
                index === activeIndex
                  ? "border-vite-purple ring-2 ring-vite-purple/40 dark:border-cyber-yellow dark:ring-cyber-yellow/40"
                  : "border-border opacity-70 hover:opacity-100",
              )}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={img.image_url}
                alt={img.alt_text ?? `${productName} miniatura ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
