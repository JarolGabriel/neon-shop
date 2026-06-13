"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  addAdminPromotionImage,
  createAdminPromotion,
  deleteAdminPromotion,
  getAdminPromotions,
  patchAdminPromotion,
} from "@/lib/admin-api";
import {
  buildPromotionCreatePayload,
  buildPromotionUpdatePayload,
} from "@/lib/admin-promotion-form";
import type { AdminPromotionFormInput } from "@/lib/schemas/admin-promotion";
import type {
  AdminPromotion,
  PatchAdminPromotionPayload,
} from "@/types/admin";

interface UseAdminPromotionsResult {
  promotions: AdminPromotion[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createPromotion: (values: AdminPromotionFormInput) => Promise<AdminPromotion>;
  updatePromotion: (
    id: string,
    values: AdminPromotionFormInput,
  ) => Promise<AdminPromotion>;
  patchPromotion: (
    id: string,
    payload: PatchAdminPromotionPayload,
  ) => Promise<AdminPromotion>;
  deletePromotion: (id: string) => Promise<void>;
  addPromotionImage: (
    promotionId: string,
    file: File,
    options?: { altText?: string; displayOrder?: number },
  ) => Promise<AdminPromotion>;
}

function findPromotion(
  promotions: AdminPromotion[],
  id: string,
): AdminPromotion | undefined {
  return promotions.find((item) => item.id === id);
}

export function useAdminPromotions(): UseAdminPromotionsResult {
  const [promotions, setPromotions] = useState<AdminPromotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAdminPromotions();
      setPromotions(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las promociones",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const reloadPromotion = useCallback(
    async (promotionId: string) => {
      const response = await getAdminPromotions();
      setPromotions(response.data);
      return findPromotion(response.data, promotionId) ?? null;
    },
    [],
  );

  const createPromotion = useCallback(
    async (values: AdminPromotionFormInput) => {
      setIsSaving(true);
      try {
        const created = await createAdminPromotion(
          buildPromotionCreatePayload(values),
        );
        toast.success("Promoción creada");
        const fresh = await reloadPromotion(created.id);
        return fresh ?? { ...created, promotion_images: [] };
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No se pudo crear la promoción",
        );
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [reloadPromotion],
  );

  const updatePromotion = useCallback(
    async (id: string, values: AdminPromotionFormInput) => {
      setIsSaving(true);
      try {
        await patchAdminPromotion(id, buildPromotionUpdatePayload(values));
        toast.success("Promoción actualizada");
        const fresh = await reloadPromotion(id);
        if (!fresh) throw new Error("Promoción no encontrada");
        return fresh;
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "No se pudo actualizar la promoción",
        );
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [reloadPromotion],
  );

  const patchPromotion = useCallback(
    async (id: string, payload: PatchAdminPromotionPayload) => {
      setIsSaving(true);
      try {
        const response = await patchAdminPromotion(id, payload);
        setPromotions((current) =>
          current.map((item) =>
            item.id === id
              ? { ...item, ...response.data, promotion_images: item.promotion_images }
              : item,
          ),
        );
        return response.data;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No se pudo actualizar",
        );
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const deletePromotion = useCallback(
    async (id: string) => {
      setIsSaving(true);
      try {
        await deleteAdminPromotion(id);
        setPromotions((current) => current.filter((item) => item.id !== id));
        toast.success("Promoción eliminada");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No se pudo eliminar",
        );
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const addPromotionImage = useCallback(
    async (
      promotionId: string,
      file: File,
      options?: { altText?: string; displayOrder?: number },
    ) => {
      setIsSaving(true);
      try {
        const formData = new FormData();
        formData.append("promotion_id", promotionId);
        formData.append("file", file);
        formData.append("alt_text", options?.altText ?? "");
        formData.append(
          "display_order",
          String(options?.displayOrder ?? 0),
        );
        await addAdminPromotionImage(formData);
        toast.success("Imagen agregada");
        const fresh = await reloadPromotion(promotionId);
        if (!fresh) throw new Error("Promoción no encontrada");
        return fresh;
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "No se pudo subir la imagen",
        );
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [reloadPromotion],
  );

  return {
    promotions,
    isLoading,
    isSaving,
    error,
    refresh,
    createPromotion,
    updatePromotion,
    patchPromotion,
    deletePromotion,
    addPromotionImage,
  };
}
