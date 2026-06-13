"use client";

import { useCallback, useEffect, useState } from "react";
import { createShowroomComment, getShowroomComments } from "@/lib/api";
import type { ShowroomComment } from "@/types/showroom";

interface UseShowroomCommentsOptions {
  reviewId: string;
  accessToken?: string | null;
  enabled?: boolean;
}

export function useShowroomComments({
  reviewId,
  accessToken,
  enabled = true,
}: UseShowroomCommentsOptions) {
  const [comments, setComments] = useState<ShowroomComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getShowroomComments(reviewId);
      setComments(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar los comentarios.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [enabled, reviewId]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  const addComment = useCallback(
    async (comment: string) => {
      if (!accessToken) {
        throw new Error("Debes iniciar sesión para comentar.");
      }

      const response = await createShowroomComment(accessToken, reviewId, comment);
      return response.message;
    },
    [accessToken, reviewId],
  );

  return {
    comments,
    isLoading,
    error,
    reload: loadComments,
    addComment,
  };
}
