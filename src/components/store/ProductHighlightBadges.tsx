import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductHighlightBadgesProps {
  isFeatured?: boolean | null;
  isBestSeller?: boolean | null;
  variant?: "inline" | "corner";
  className?: string;
}

export function ProductHighlightBadges({
  isFeatured,
  isBestSeller,
  variant = "inline",
  className,
}: ProductHighlightBadgesProps) {
  if (!isFeatured && !isBestSeller) return null;

  if (variant === "corner") {
    return (
      <div
        className={cn(
          "absolute bottom-2 left-2 z-20 flex flex-col items-start gap-1",
          className,
        )}
      >
        {isFeatured ? (
          <Badge
            variant="outline"
            className="border-neon-pink/50 bg-background/90 text-[10px] text-neon-pink backdrop-blur-sm dark:border-cyber-yellow/50 dark:text-cyber-yellow"
          >
            Destacado
          </Badge>
        ) : null}
        {isBestSeller ? (
          <Badge
            variant="outline"
            className="border-vite-purple/50 bg-background/90 text-[10px] text-vite-purple backdrop-blur-sm dark:border-cyber-yellow/50 dark:text-cyber-yellow"
          >
            Más vendido
          </Badge>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {isFeatured ? (
        <Badge
          variant="outline"
          className="border-neon-pink/50 text-neon-pink dark:border-cyber-yellow/50 dark:text-cyber-yellow"
        >
          Destacado
        </Badge>
      ) : null}
      {isBestSeller ? (
        <Badge
          variant="outline"
          className="border-vite-purple/50 text-vite-purple dark:border-cyber-yellow/50 dark:text-cyber-yellow"
        >
          Más vendido
        </Badge>
      ) : null}
    </div>
  );
}
