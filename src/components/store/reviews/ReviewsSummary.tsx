"use client";

import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import type { ReviewStats } from "@/types/review";

interface ReviewsSummaryProps {
  stats: ReviewStats;
  onWriteReview: () => void;
}

function DistributionRow({
  stars,
  count,
  total,
}: {
  stars: number;
  count: number;
  total: number;
}) {
  const percent = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <StarRating value={stars} size="sm" />
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-foreground transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="w-6 text-right text-sm tabular-nums text-muted-foreground">
        {count}
      </span>
    </div>
  );
}

export function ReviewsSummary({ stats, onWriteReview }: ReviewsSummaryProps) {
  const { average, total, distribution } = stats;

  return (
    <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-3">
      <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
        <StarRating value={Math.round(average)} size="md" />
        <p className="font-heading text-2xl font-bold text-foreground">
          {average.toFixed(2)} de 5
        </p>
        <p className="text-sm text-muted-foreground">
          Basado en {total} {total === 1 ? "reseña" : "reseñas"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {[5, 4, 3, 2, 1].map((stars) => (
          <DistributionRow
            key={stars}
            stars={stars}
            count={distribution[stars as 1 | 2 | 3 | 4 | 5]}
            total={total}
          />
        ))}
      </div>

      <div className="flex justify-center md:justify-end">
        <Button
          size="lg"
          className="h-11 bg-foreground px-6 text-background hover:bg-foreground/90"
          onClick={onWriteReview}
        >
          Escribir una reseña
        </Button>
      </div>
    </div>
  );
}
