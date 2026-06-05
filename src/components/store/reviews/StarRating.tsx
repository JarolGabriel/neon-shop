"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<StarRatingProps["size"]>, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-8",
};

export function StarRating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? value;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`Calificación: ${value} de ${max}`}
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => {
        const filled = star <= active;
        const StarIcon = (
          <Star
            className={cn(
              SIZE_CLASS[size],
              "transition-colors",
              filled
                ? "fill-vite-purple text-vite-purple dark:fill-cyber-yellow dark:text-cyber-yellow"
                : "fill-transparent text-muted-foreground/40",
            )}
            aria-hidden="true"
          />
        );

        if (!interactive) return <span key={star}>{StarIcon}</span>;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
            className="cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange?.(star)}
          >
            {StarIcon}
          </button>
        );
      })}
    </div>
  );
}
