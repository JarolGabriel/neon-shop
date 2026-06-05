"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProductReviews } from "@/hooks/useProductReviews";
import { ReviewForm, type ReviewFormValues } from "./ReviewForm";
import { ReviewsList } from "./ReviewsList";
import { ReviewsSummary } from "./ReviewsSummary";

export function ReviewsSection({ productId }: { productId: string }) {
  const { reviews, stats, isLoading, error, addReview } =
    useProductReviews(productId);
  const [open, setOpen] = useState(false);

  // Punto único de conexión con el backend: aquí se envía la reseña al API.
  async function handleReviewSubmit(values: ReviewFormValues) {
    try {
      await addReview({
        rating: values.rating,
        title: values.title,
        content: values.content,
        user_name: values.user_name,
        email: values.email,
      });
      setOpen(false);
    } catch (err) {
      console.error("Error al enviar la reseña:", err);
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
          <p className="py-8 text-center text-sm text-destructive">{error}</p>
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
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Escribe una reseña</DialogTitle>
          </DialogHeader>
          <ReviewForm onSubmit={handleReviewSubmit} />
        </DialogContent>
      </Dialog>
    </section>
  );
}
