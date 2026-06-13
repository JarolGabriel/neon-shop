"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteAdminCustomDesign,
  getAdminCustomDesigns,
  patchAdminCustomDesign,
} from "@/lib/admin-api";
import type { AdminCustomDesignManageInput } from "@/lib/schemas/admin-custom-design";
import type {
  AdminCustomDesign,
  PatchAdminCustomDesignPayload,
} from "@/types/admin";

interface UseAdminCustomDesignsResult {
  designs: AdminCustomDesign[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateDesign: (
    id: string,
    values: AdminCustomDesignManageInput,
  ) => Promise<AdminCustomDesign>;
  deleteDesign: (id: string) => Promise<void>;
}

function buildPatchPayload(
  values: AdminCustomDesignManageInput,
): PatchAdminCustomDesignPayload {
  return {
    status: values.status,
    final_price: values.final_price ?? undefined,
    mockup_url: values.mockup_url?.trim() || undefined,
    admin_notes: values.admin_notes?.trim() || undefined,
  };
}

export function useAdminCustomDesigns(): UseAdminCustomDesignsResult {
  const [designs, setDesigns] = useState<AdminCustomDesign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAdminCustomDesigns();
      setDesigns(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las solicitudes",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateDesign = useCallback(
    async (id: string, values: AdminCustomDesignManageInput) => {
      setIsSaving(true);
      try {
        const response = await patchAdminCustomDesign(
          id,
          buildPatchPayload(values),
        );
        setDesigns((current) =>
          current.map((item) => (item.id === id ? response.data : item)),
        );
        toast.success("Solicitud actualizada");
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

  const deleteDesign = useCallback(async (id: string) => {
    setIsSaving(true);
    try {
      await deleteAdminCustomDesign(id);
      setDesigns((current) => current.filter((item) => item.id !== id));
      toast.success("Solicitud eliminada");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "No se pudo eliminar",
      );
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    designs,
    isLoading,
    isSaving,
    error,
    refresh,
    updateDesign,
    deleteDesign,
  };
}
