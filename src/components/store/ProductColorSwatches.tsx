import { cn } from "@/lib/utils";
import type { UniqueColorSwatch } from "@/types/product";

interface ProductColorSwatchesProps {
  swatches: UniqueColorSwatch[];
  overflowCount: number;
  className?: string;
}

export function ProductColorSwatches({
  swatches,
  overflowCount,
  className,
}: ProductColorSwatchesProps) {
  if (swatches.length === 0) return null;

  return (
    <div
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      aria-label="Colores disponibles"
    >
      {swatches.map((swatch, index) => (
        <span
          key={swatch.id}
          className={cn(
            "size-4 shrink-0 rounded-full border border-border",
            index === 0 && "ring-1 ring-muted-foreground/50 ring-offset-1 ring-offset-background",
          )}
          style={
            swatch.colorHex
              ? { backgroundColor: swatch.colorHex }
              : undefined
          }
          title={swatch.color ?? undefined}
          aria-hidden="true"
        />
      ))}
      {overflowCount > 0 ? (
        <span className="text-xs font-medium text-muted-foreground">
          +{overflowCount}
        </span>
      ) : null}
    </div>
  );
}
