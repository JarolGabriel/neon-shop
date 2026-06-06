"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductReviews } from "@/hooks/useProductReviews";
import {
  showReviewSubmitErrorToast,
  showReviewSuccessToast,
} from "@/lib/review-toasts";
import type { ReviewFormValues } from "@/lib/schemas/review";
import { ReviewForm } from "./ReviewForm";
import { ReviewsList } from "./ReviewsList";
import { ReviewsSummary } from "./ReviewsSummary";

export function ReviewsSection({ productId }: { productId: string }) {
  const { reviews, stats, isLoading, error, addReview } =
    useProductReviews(productId);
  const [open, setOpen] = useState(false);

  async function handleReviewSubmit(
    values: ReviewFormValues,
    file?: File | null,
  ) {
    try {
      await addReview(
        {
          rating: values.rating,
          title: values.title,
          content: values.content,
          user_name: values.user_name,
          email: values.email,
        },
        file,
      );
      showReviewSuccessToast();
      setOpen(false);
    } catch (err) {
      showReviewSubmitErrorToast(
        err instanceof Error
          ? err.message
          : "Inténtalo de nuevo en unos momentos.",
      );
    }
  }

  return (
    <section className="w-full py-12" aria-label="Opiniones de clientes">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Opiniones de clientes
        </h2>

        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Cargando reseñas...
          </p>
        ) : error ? (
          <p className="py-8 text-center text-sm text-destructive/90">
            {error}
          </p>
        ) : (
          <>
            <ReviewsSummary stats={stats} onWriteReview={() => setOpen(true)} />
            <div className="mt-10">
              <ReviewsList reviews={reviews} />
            </div>
          </>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Escribe una reseña</DialogTitle>
            <DialogDescription className="sr-only">
              Comparte tu experiencia con este producto. Los campos marcados son
              obligatorios.
            </DialogDescription>
          </DialogHeader>
          <ReviewForm onSubmit={handleReviewSubmit} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
