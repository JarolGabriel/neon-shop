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
import {
  SHOWCASE_MOBILE_COMPARE_HERO,
  SHOWCASE_MOBILE_COMPARE_LEFT,
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

function getPreviewLabel(preview: ShowcaseNeonPreview): string {
  const colorName =
    typeof preview.letters === "string"
      ? preview.glowColor === "#ffffff"
        ? "White"
        : "Neon"
      : "Multicolor";

  return `${preview.fontFamily} - ${colorName}`;
}

function NeonPreviewText({ preview }: { preview: ShowcaseNeonPreview }) {
  const baseStyle = {
    fontFamily: `"${preview.fontFamily}", cursive`,
    fontWeight: preview.fontWeight,
    fontSize: preview.fontSize ?? "clamp(0.9rem, 3.5vw, 1.4rem)",
  };

  if (typeof preview.letters === "string") {
    const glow = preview.glowColor ?? "#ffffff";
    return (
      <p
        className={cn("px-2 text-center leading-tight", preview.className)}
        style={{ ...baseStyle, ...neonTextStyle(glow) }}
      >
        {preview.letters}
      </p>
    );
  }

  return (
    <p
      className={cn("px-2 text-center leading-tight", preview.className)}
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

interface MobileCompareTileProps {
  item: ShowcaseGalleryItem;
  gridRef: RefObject<HTMLDivElement | null>;
  lineOffsetPx: number;
  className?: string;
}

function MobileCompareTile({
  item,
  gridRef,
  lineOffsetPx,
  className,
}: MobileCompareTileProps) {
  const cardRef = useRef<HTMLElement>(null);
  const preview = SHOWCASE_NEON_PREVIEWS[item.id];

  const clipPercent =
    gridRef.current && cardRef.current
      ? getCardClipPercent(gridRef.current, cardRef.current, lineOffsetPx)
      : 50;

  return (
    <article
      ref={cardRef}
      className={cn("relative min-h-0 overflow-hidden bg-[#2e2e2e]", className)}
    >
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
            sizes="50vw"
            className={cn("object-cover object-center", item.imageClass)}
            draggable={false}
          />
        </div>
      </div>

      {preview ? (
        <span className="pointer-events-none absolute bottom-2 left-2 z-20 font-sans text-[10px] text-white/90">
          {getPreviewLabel(preview)}
        </span>
      ) : null}
    </article>
  );
}

export function CustomShowcaseCompareMobile() {
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

  const [leftTop, leftBottom] = SHOWCASE_MOBILE_COMPARE_LEFT;

  return (
    <div
      ref={gridRef}
      className="relative mx-4 cursor-ew-resize touch-none select-none md:hidden"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div className="grid h-[min(92vw,440px)] grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] overflow-hidden rounded-lg border border-white/15">
        <div className="flex min-h-0 flex-col divide-y divide-white/15">
          <MobileCompareTile
            item={leftTop}
            gridRef={gridRef}
            lineOffsetPx={lineOffsetPx}
            className="flex-1"
          />
          <MobileCompareTile
            item={leftBottom}
            gridRef={gridRef}
            lineOffsetPx={lineOffsetPx}
            className="flex-1"
          />
        </div>

        <MobileCompareTile
          item={SHOWCASE_MOBILE_COMPARE_HERO}
          gridRef={gridRef}
          lineOffsetPx={lineOffsetPx}
          className="h-full"
        />
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
  );
}
