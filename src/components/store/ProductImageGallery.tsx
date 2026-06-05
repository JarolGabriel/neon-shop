"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import type { CatalogProductImage } from "@/types/product";

interface ProductImageGalleryProps {
  images: CatalogProductImage[];
  productName: string;
  discountPercent: number | null;
  href?: string;
}

const navButtonClass = cn(
  "absolute top-1/2 z-30 flex size-7 -translate-y-1/2 items-center justify-center rounded-full sm:size-9",
  "border border-border/70 bg-background/90 text-foreground shadow-sm backdrop-blur-md",
  "opacity-90 transition-all duration-200",
  "hover:scale-105 hover:bg-neon-surface! hover:border-vite-purple hover:text-vite-purple!",
  "dark:hover:border-cyber-yellow dark:hover:text-cyber-yellow!",
  "focus-visible:scale-105 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  "md:opacity-0 md:group-hover/gallery:opacity-100",
);

export function ProductImageGallery({
  images,
  productName,
  discountPercent,
  href,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set());

  const markLoaded = useCallback((id: string) => {
    setLoadedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square w-full bg-muted">
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Sin imagen
        </div>
      </div>
    );
  }

  const current = images[activeIndex];
  const hasMultiple = images.length > 1;
  const isActiveLoading = !loadedIds.has(current.id);

  return (
    <div className="group/gallery relative aspect-square w-full overflow-hidden bg-muted">
      {discountPercent != null ? (
        <div
          className="absolute inset-x-0 top-0 z-20 flex items-center gap-1.5 bg-neon-pink/90 px-2 py-1 text-[10px] font-medium text-primary-foreground backdrop-blur-sm sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs"
          aria-label={`Hasta un ${discountPercent}% de descuento`}
        >
          <Tag className="size-3 shrink-0 sm:size-3.5" aria-hidden="true" />
          <span>Hasta un {discountPercent}% de descuento</span>
        </div>
      ) : null}

      {/* Todas las imágenes se mantienen montadas para precargarlas:
          el cambio entre ellas es un crossfade instantáneo, sin re-descargar. */}
      {images.map((img, index) => (
        <motion.div
          key={img.id}
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: index === activeIndex ? 1 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ zIndex: index === activeIndex ? 1 : 0 }}
          aria-hidden={index !== activeIndex}
        >
          <Image
            src={img.image_url}
            alt={img.alt_text ?? productName}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            priority={index === 0}
            onLoad={() => markLoaded(img.id)}
            onError={() => markLoaded(img.id)}
          />
        </motion.div>
      ))}

      {href ? (
        <Link
          href={href}
          className="absolute inset-0 z-10"
          aria-label={`Ver ${productName}`}
          tabIndex={-1}
        />
      ) : null}

      {isActiveLoading ? (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-muted/60 backdrop-blur-sm"
          aria-label="Cargando imagen"
          role="status"
        >
          <Loader2 className="size-6 animate-spin text-vite-purple dark:text-cyber-yellow" />
        </div>
      ) : null}

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            className={cn(navButtonClass, "left-2")}
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className={cn(navButtonClass, "right-2")}
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="size-4 sm:size-5" />
          </button>

          <div
            className="absolute inset-x-0 bottom-2 z-30 flex justify-center gap-1.5"
            aria-hidden="true"
          >
            {images.map((img, index) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "size-1.5 rounded-full transition-all duration-200",
                  index === activeIndex
                    ? "w-4 bg-vite-purple dark:bg-cyber-yellow"
                    : "bg-foreground/40 hover:bg-foreground/70",
                )}
                aria-label={`Ver imagen ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
