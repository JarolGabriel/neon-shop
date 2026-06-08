"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type RefObject,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { CustomShowcaseCompareMobile } from "@/components/store/CustomShowcaseCompareMobile";
import {
  SHOWCASE_CENTER_ITEMS,
  SHOWCASE_LEFT_ITEMS,
  SHOWCASE_RIGHT_ITEMS,
  type ShowcaseGalleryItem,
} from "@/components/store/showcase-gallery-data";
import { neonTextStyle } from "@/lib/neon-glow";
import {
  SHOWCASE_NEON_PREVIEWS,
  type ShowcaseNeonPreview,
} from "@/lib/showcase-neon-previews";
import { cn } from "@/lib/utils";

const GREY_CANVAS_BG = "#2e2e2e";

function getCardClipPercent(
  gridEl: HTMLElement,
  cardEl: HTMLElement,
  lineOffsetPx: number,
): number {
  const gridRect = gridEl.getBoundingClientRect();
  const cardRect = cardEl.getBoundingClientRect();
  const cardLeft = cardRect.left - gridRect.left;
  const cardWidth = cardRect.width;
  if (cardWidth <= 0) return 50;
  const raw = ((lineOffsetPx - cardLeft) / cardWidth) * 100;
  return Math.min(100, Math.max(0, raw));
}

function NeonPreviewText({ preview }: { preview: ShowcaseNeonPreview }) {
  const baseStyle = {
    fontFamily: `"${preview.fontFamily}", cursive`,
    fontWeight: preview.fontWeight,
    fontSize: preview.fontSize ?? "clamp(1.2rem, 4vw, 2rem)",
  };

  if (typeof preview.letters === "string") {
    const glow = preview.glowColor ?? "#ffffff";
    return (
      <p
        className={cn("px-3 text-center leading-tight", preview.className)}
        style={{ ...baseStyle, ...neonTextStyle(glow) }}
      >
        {preview.letters}
      </p>
    );
  }

  return (
    <p
      className={cn("px-3 text-center leading-tight", preview.className)}
      style={baseStyle}
    >
      {preview.letters.map((letter, index) => (
        <span
          key={`${letter.char}-${index}`}
          style={neonTextStyle(letter.color)}
        >
          {letter.char}
        </span>
      ))}
    </p>
  );
}

interface CompareTileProps {
  item: ShowcaseGalleryItem;
  gridRef: RefObject<HTMLDivElement | null>;
  lineOffsetPx: number;
  variant?: "grid" | "compact" | "hero";
  className?: string;
}

function CompareTile({
  item,
  gridRef,
  lineOffsetPx,
  variant = "grid",
  className,
}: CompareTileProps) {
  const cardRef = useRef<HTMLElement>(null);
  const preview = SHOWCASE_NEON_PREVIEWS[item.id];

  const clipPercent =
    gridRef.current && cardRef.current
      ? getCardClipPercent(gridRef.current, cardRef.current, lineOffsetPx)
      : 50;

  return (
    <article
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/50 bg-[#2e2e2e]",
        variant === "grid" && "aspect-square",
        variant === "compact" && "md:min-h-0 md:flex-1",
        variant === "hero" && "md:aspect-square md:shrink-0",
        item.gridClass,
        className,
      )}
    >
      <span className="absolute top-3 left-3 z-20 rounded-md border border-border/70 bg-black/50 px-2 py-0.5 font-sans text-[10px] font-semibold tracking-[0.2em] text-white backdrop-blur-sm">
        {item.badge}
      </span>

      <div className="relative size-full min-h-[inherit]">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: GREY_CANVAS_BG }}
        >
          {preview ? <NeonPreviewText preview={preview} /> : null}
        </div>

        <div
          className="absolute inset-0 z-10"
          style={{ clipPath: `inset(0 0 0 ${clipPercent}%)` }}
        >
          <Image
            src={item.imageSrc}
            alt={item.alt}
            fill
            quality={item.quality ?? 80}
            unoptimized={item.unoptimized}
            sizes={item.sizes ?? "(max-width: 768px) 85vw, 33vw"}
            className={cn("object-cover object-center", item.imageClass)}
            draggable={false}
          />
        </div>
      </div>
    </article>
  );
}

function CenterColumnStack({
  gridRef,
  lineOffsetPx,
}: {
  gridRef: RefObject<HTMLDivElement | null>;
  lineOffsetPx: number;
}) {
  const [openBanner, mikes, playGame] = SHOWCASE_CENTER_ITEMS;

  return (
    <div className="flex h-full flex-col gap-4 md:col-start-2 md:row-span-2 md:row-start-1">
      <CompareTile
        item={openBanner}
        gridRef={gridRef}
        lineOffsetPx={lineOffsetPx}
        variant="compact"
      />
      <CompareTile
        item={mikes}
        gridRef={gridRef}
        lineOffsetPx={lineOffsetPx}
        variant="hero"
      />
      <CompareTile
        item={playGame}
        gridRef={gridRef}
        lineOffsetPx={lineOffsetPx}
        variant="compact"
      />
    </div>
  );
}

export function CustomShowcaseCompare() {
  const gridRef = useRef<HTMLDivElement>(null);
  const lineRatioRef = useRef(0.5);
  const [lineOffsetPx, setLineOffsetPx] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const syncLineFromWidth = useCallback((width: number) => {
    setLineOffsetPx(width * lineRatioRef.current);
    setIsReady(true);
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    syncLineFromWidth(grid.offsetWidth);

    const observer = new ResizeObserver(() => {
      if (gridRef.current) {
        syncLineFromWidth(gridRef.current.offsetWidth);
      }
    });
    observer.observe(grid);
    return () => observer.disconnect();
  }, [syncLineFromWidth]);

  const updateLine = useCallback((clientX: number) => {
    const grid = gridRef.current;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    const next = Math.min(rect.width, Math.max(0, clientX - rect.left));
    lineRatioRef.current = rect.width > 0 ? next / rect.width : 0.5;
    setLineOffsetPx(next);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    updateLine(event.clientX);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    gridRef.current?.setPointerCapture(event.pointerId);
    updateLine(event.clientX);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (gridRef.current?.hasPointerCapture(event.pointerId)) {
      gridRef.current.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section
      className="relative w-full py-14 md:mx-auto md:max-w-6xl md:px-4 md:py-20"
      aria-label="Galería comparativa de carteles personalizados"
    >
      <header className="mb-8 px-4 text-center md:mb-10">
        <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">
          Carteles de neón personalizados para tu negocio
        </h2>
        <Link
          href="/diseno-personalizado"
          className="mt-3 inline-block text-sm font-medium text-foreground underline underline-offset-4 transition-colors duration-200 hover:text-neon-pink! dark:hover:text-cyber-yellow!"
        >
          Consigue un presupuesto GRATIS
        </Link>
        <p className="mt-2 text-xs text-muted-foreground md:hidden">
          Arrastra horizontalmente para comparar diseño y foto
        </p>
        <p className="mt-2 hidden text-xs text-muted-foreground md:block">
          Mueve el cursor para comparar el diseño con el resultado instalado
        </p>
      </header>

      <CustomShowcaseCompareMobile />

      <div
        ref={gridRef}
        className="relative hidden cursor-ew-resize touch-none select-none md:block"
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] grid-rows-2 gap-4">
          {SHOWCASE_LEFT_ITEMS.map((item) => (
            <CompareTile
              key={item.id}
              item={item}
              gridRef={gridRef}
              lineOffsetPx={lineOffsetPx}
            />
          ))}
          <CenterColumnStack
            gridRef={gridRef}
            lineOffsetPx={lineOffsetPx}
          />
          {SHOWCASE_RIGHT_ITEMS.map((item) => (
            <CompareTile
              key={item.id}
              item={item}
              gridRef={gridRef}
              lineOffsetPx={lineOffsetPx}
            />
          ))}
        </div>

        {isReady ? (
          <div
            className="pointer-events-none absolute top-0 bottom-0 z-30 w-[3px] bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"
            style={{
              left: `${lineOffsetPx}px`,
              transform: "translateX(-50%)",
            }}
            aria-hidden
          >
            <span className="absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-blue-400 bg-[#1a1a1a] text-xs text-blue-300 shadow-lg">
              ↔
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
