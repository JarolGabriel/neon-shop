"use client";

import { useEffect, useState } from "react";
import { getCategories, type Category } from "@/lib/api";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((data) => {
        if (cancelled) return;

        setCategories(
          data
            .filter((category) => category.is_active !== false)
            .sort(
              (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
            ),
        );
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;

        setError(
          err instanceof Error ? err.message : "Error al cargar categorías",
        );
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, isLoading, error };
}
