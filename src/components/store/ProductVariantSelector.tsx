"use client";

import { cn, formatSizeLabel } from "@/lib/utils";
import type { VariantColorOption } from "@/hooks/useProductVariants";

interface ProductVariantSelectorProps {
  sizes: string[];
  colors: VariantColorOption[];
  selectedSize: string | null;
  selectedColorKey: string | null;
  selectedColorName: string | null;
  isSizeAvailable: (size: string) => boolean;
  onSelectSize: (size: string) => void;
  onSelectColor: (key: string) => void;
}

export function ProductVariantSelector({
  sizes,
  colors,
  selectedSize,
  selectedColorKey,
  selectedColorName,
  isSizeAvailable,
  onSelectSize,
  onSelectColor,
}: ProductVariantSelectorProps) {
  return (
    <div className="flex flex-col gap-5">
      {sizes.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Tamaño</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = size === selectedSize;
              const available = isSizeAvailable(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSelectSize(size)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                    active
                      ? "border-vite-purple bg-vite-purple/10 font-medium text-foreground dark:border-cyber-yellow dark:bg-cyber-yellow/10"
                      : "border-border text-muted-foreground hover:border-vite-purple/60 hover:text-foreground dark:hover:border-cyber-yellow/60",
                    !available && "opacity-50",
                  )}
                >
                  {formatSizeLabel(size)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {colors.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">
            Color
            {selectedColorName ? (
              <span className="text-muted-foreground">: {selectedColorName}</span>
            ) : null}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => {
              const active = color.key === selectedColorKey;
              const label = color.color ?? "Color";

              if (!color.colorHex) {
                return (
                  <button
                    key={color.key}
                    type="button"
                    onClick={() => onSelectColor(color.key)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition-colors duration-200",
                      active
                        ? "border-vite-purple bg-vite-purple/10 font-medium text-foreground dark:border-cyber-yellow dark:bg-cyber-yellow/10"
                        : "border-border text-muted-foreground hover:border-vite-purple/60 hover:text-foreground dark:hover:border-cyber-yellow/60",
                    )}
                  >
                    {label}
                  </button>
                );
              }

              return (
                <button
                  key={color.key}
                  type="button"
                  onClick={() => onSelectColor(color.key)}
                  title={label}
                  aria-label={label}
                  className={cn(
                    "size-8 rounded-full border border-border transition-transform duration-200 hover:scale-110",
                    active &&
                      "ring-2 ring-vite-purple ring-offset-2 ring-offset-background dark:ring-cyber-yellow",
                  )}
                  style={{ backgroundColor: color.colorHex }}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
