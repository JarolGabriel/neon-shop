"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getAdminModeration, patchAdminModeration } from "@/lib/admin-api";
import type {
  AdminModerationData,
  PatchAdminModerationPayload,
} from "@/types/admin";

interface UseAdminModerationResult {
  pending: AdminModerationData;
  published: AdminModerationData;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  moderate: (payload: PatchAdminModerationPayload) => Promise<void>;
}

const EMPTY_DATA: AdminModerationData = { reviews: [], comments: [] };

export function useAdminModeration(): UseAdminModerationResult {
  const [pending, setPending] = useState<AdminModerationData>(EMPTY_DATA);
  const [published, setPublished] = useState<AdminModerationData>(EMPTY_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [pendingRes, publishedRes] = await Promise.all([
        getAdminModeration("pending"),
        getAdminModeration("published"),
      ]);
      setPending(pendingRes.data);
      setPublished(publishedRes.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar la moderación",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const moderate = useCallback(
    async (payload: PatchAdminModerationPayload) => {
      const response = await patchAdminModeration(payload);
      toast.success(response.message ?? "Contenido moderado");

      if (payload.action === "delete") {
        setPublished((current) => {
          if (payload.target_type === "review") {
            return {
              ...current,
              reviews: current.reviews.filter(
                (review) => review.id !== payload.target_id,
              ),
            };
          }

          return {
            ...current,
            comments: current.comments.filter(
              (comment) => comment.id !== payload.target_id,
            ),
          };
        });
        return;
      }

      setPending((current) => {
        if (payload.target_type === "review") {
          return {
            ...current,
            reviews: current.reviews.filter(
              (review) => review.id !== payload.target_id,
            ),
          };
        }

        return {
          ...current,
          comments: current.comments.filter(
            (comment) => comment.id !== payload.target_id,
          ),
        };
      });
    },
    [],
  );

  return { pending, published, isLoading, error, refresh, moderate };
}
