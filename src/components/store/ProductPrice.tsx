import { cn, formatUsd } from "@/lib/utils";

interface ProductPriceProps {
  price: number;
  compareAtPrice: number | null;
  showFromLabel?: boolean;
  className?: string;
}

export function ProductPrice({
  price,
  compareAtPrice,
  showFromLabel = false,
  className,
}: ProductPriceProps) {
  const hasCompare =
    compareAtPrice != null && compareAtPrice > price;

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <p className="text-xs text-foreground sm:text-sm">
        {showFromLabel ? (
          <span className="text-muted-foreground">Desde </span>
        ) : null}
        <span className="font-semibold text-foreground dark:text-cyber-yellow">
          {formatUsd(price)}
        </span>
        <span className="text-muted-foreground"> USD</span>
      </p>
      {hasCompare ? (
        <p className="text-[10px] text-muted-foreground line-through sm:text-xs">
          {formatUsd(compareAtPrice)}
        </p>
      ) : null}
    </div>
  );
}
