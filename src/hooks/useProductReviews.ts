"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createProductReview, getProductReviews } from "@/lib/api";
import { computeReviewStats } from "@/components/store/reviews/reviewStats";
import { useAuth } from "@/context/AuthContext";
import type { CreateReviewPayload, ProductReview } from "@/types/review";

export function useProductReviews(productId: string) {
  const { accessToken } = useAuth();
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProductReviews(productId);
      setReviews(data);
    } catch (err) {
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError(
          "No pudimos cargar las reseñas. Comprueba tu conexión e inténtalo de nuevo.",
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Error al cargar reseñas",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const addReview = useCallback(
    async (
      payload: Omit<CreateReviewPayload, "product_id">,
      file?: File | null,
    ) => {
      const created = await createProductReview(
        { ...payload, product_id: productId },
        file,
        accessToken,
      );
      setReviews((prev) => [created, ...prev]);
      return created;
    },
    [productId, accessToken],
  );

  const stats = useMemo(() => computeReviewStats(reviews), [reviews]);

  return { reviews, stats, isLoading, error, addReview, reload: loadReviews };
}
