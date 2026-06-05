import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductRatingProps {
  rating?: number;
  reviewCount?: number | null;
  className?: string;
}

export function ProductRating({
  rating = 5,
  reviewCount,
  className,
}: ProductRatingProps) {
  const clampedRating = Math.min(5, Math.max(0, rating));
  const displayCount =
    reviewCount != null && reviewCount > 0 ? reviewCount : 4;

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      aria-label={`Valoración ${clampedRating} de 5, ${displayCount} reseñas`}
    >
      <div className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i < Math.round(clampedRating);
          return (
            <Star
              key={i}
              className={cn(
                "size-3 sm:size-3.5",
                filled
                  ? "fill-vite-purple text-vite-purple dark:fill-cyber-yellow dark:text-cyber-yellow"
                  : "fill-muted text-muted",
              )}
            />
          );
        })}
      </div>
      <span className="text-[10px] text-muted-foreground sm:text-xs">
        ({displayCount})
      </span>
    </div>
  );
}
