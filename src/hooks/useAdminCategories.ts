"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "@/lib/admin-api";
import type {
  AdminCategoryCreateInput,
  AdminCategoryUpdateInput,
} from "@/lib/schemas/admin-category";
import type { AdminCategory } from "@/types/admin";

function buildCategoryFormData(values: AdminCategoryCreateInput): FormData {
  const formData = new FormData();
  formData.append("name", values.name.trim());
  formData.append("slug", values.slug.trim());
  formData.append("description", values.description?.trim() ?? "");
  formData.append("display_order", String(values.display_order));
  formData.append("is_active", values.is_active ? "true" : "false");
  formData.append("image", values.image);
  return formData;
}

interface UseAdminCategoriesResult {
  categories: AdminCategory[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createCategory: (values: AdminCategoryCreateInput) => Promise<AdminCategory>;
  updateCategory: (
    id: string,
    values: AdminCategoryUpdateInput,
  ) => Promise<AdminCategory>;
  deleteCategory: (id: string) => Promise<void>;
}

export function useAdminCategories(): UseAdminCategoriesResult {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las categorías",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createCategory = useCallback(async (values: AdminCategoryCreateInput) => {
    setIsSaving(true);

    try {
      const response = await createAdminCategory(buildCategoryFormData(values));
      setCategories((current) =>
        [...current, response.category].sort(
          (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
        ),
      );
      toast.success("Categoría creada");
      return response.category;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo crear la categoría";
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const updateCategory = useCallback(
    async (id: string, values: AdminCategoryUpdateInput) => {
      setIsSaving(true);

      try {
        const response = await updateAdminCategory(id, {
          name: values.name.trim(),
          slug: values.slug.trim(),
          description: values.description?.trim() || null,
          display_order: values.display_order,
          is_active: values.is_active,
        });

        setCategories((current) =>
          current
            .map((item) => (item.id === id ? response.category : item))
            .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)),
        );

        toast.success("Categoría actualizada");
        return response.category;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo actualizar la categoría";
        toast.error(message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const deleteCategory = useCallback(async (id: string) => {
    setIsSaving(true);

    try {
      await deleteAdminCategory(id);
      setCategories((current) => current.filter((item) => item.id !== id));
      toast.success("Categoría eliminada");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo eliminar la categoría";
      toast.error(message);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    categories,
    isLoading,
    isSaving,
    error,
    refresh,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
