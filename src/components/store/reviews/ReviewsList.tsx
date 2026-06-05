"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, ChevronLeft, ChevronRight, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StarRating } from "./StarRating";
import type { ProductReview } from "@/types/review";

const PAGE_SIZE = 4;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function ReviewRow({ review }: { review: ProductReview }) {
  return (
    <article className="py-6">
      <div className="flex items-start justify-between gap-2">
        <StarRating value={review.rating} size="sm" />
        <time className="text-xs text-muted-foreground">
          {formatDate(review.created_at)}
        </time>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <User className="size-4" aria-hidden="true" />
        </span>
        <span className="text-sm font-medium text-foreground">
          {review.user_name}
        </span>
        {review.is_verified && (
          <span className="inline-flex items-center gap-1 rounded bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-background">
            <BadgeCheck className="size-3" aria-hidden="true" />
            Verificado
          </span>
        )}
      </div>

      <h4 className="mt-3 font-heading text-sm font-bold text-foreground">
        {review.title}
      </h4>
      <p className="mt-1 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
        {review.content}
      </p>

      {review.media_url && (
        <div className="relative mt-3 h-40 w-full max-w-sm overflow-hidden rounded-lg">
          <Image
            src={review.media_url}
            alt={`Imagen de la reseña de ${review.user_name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      )}
    </article>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <nav
      className="mt-4 flex items-center justify-center gap-1.5"
      aria-label="Paginación de reseñas"
    >
      <Button
        variant="outline"
        size="icon-sm"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft />
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Button
          key={p}
          size="icon-sm"
          variant={p === page ? "default" : "outline"}
          className={cn(
            p === page && "bg-foreground text-background hover:bg-foreground/90",
          )}
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon-sm"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Página siguiente"
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}

export function ReviewsList({ reviews }: { reviews: ProductReview[] }) {
  const [page, setPage] = useState(1);

  if (reviews.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Aún no hay reseñas. ¡Sé el primero en opinar sobre este producto!
      </p>
    );
  }

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = reviews.slice(start, start + PAGE_SIZE);

  return (
    <div>
      <div className="divide-y divide-border border-t border-border">
        {visible.map((review) => (
          <ReviewRow key={review.id} review={review} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={setPage}
        />
      )}
    </div>
  );
}
