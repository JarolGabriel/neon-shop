"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PromotionFormSheet } from "@/components/admin/promotions/PromotionFormSheet";
import { PromotionsTable } from "@/components/admin/promotions/PromotionsTable";
import { Button } from "@/components/ui/button";
import { useAdminPromotions } from "@/hooks/useAdminPromotions";
import type { AdminPromotionFormInput } from "@/lib/schemas/admin-promotion";
import type { AdminPromotion } from "@/types/admin";

export function AdminPromotionsView() {
  const {
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
  } = useAdminPromotions();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"create" | "edit">("create");
  const [selectedPromotion, setSelectedPromotion] =
    useState<AdminPromotion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPromotion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!selectedPromotion) return;
    const fresh = promotions.find((item) => item.id === selectedPromotion.id);
    if (fresh) setSelectedPromotion(fresh);
  }, [promotions, selectedPromotion?.id]);

  const openCreate = useCallback(() => {
    setSheetMode("create");
    setSelectedPromotion(null);
    setSheetOpen(true);
  }, []);

  const openEdit = useCallback((promotion: AdminPromotion) => {
    setSheetMode("edit");
    setSelectedPromotion(promotion);
    setSheetOpen(true);
  }, []);

  const handleCreate = useCallback(
    async (values: AdminPromotionFormInput) => {
      const created = await createPromotion(values);
      setSheetMode("edit");
      setSelectedPromotion(created);
      return created;
    },
    [createPromotion],
  );

  const handleUpdate = useCallback(
    async (values: AdminPromotionFormInput) => {
      if (!selectedPromotion) {
        throw new Error("Promoción no seleccionada");
      }
      const updated = await updatePromotion(selectedPromotion.id, values);
      setSelectedPromotion(updated);
      return updated;
    },
    [selectedPromotion, updatePromotion],
  );

  const handleDelete = useCallback((promotion: AdminPromotion) => {
    setDeleteTarget(promotion);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deletePromotion(deleteTarget.id);
      if (selectedPromotion?.id === deleteTarget.id) {
        setSheetOpen(false);
        setSelectedPromotion(null);
      }
    } finally {
      setIsDeleting(false);
    }
  }, [deletePromotion, deleteTarget, selectedPromotion?.id]);

  const handleToggleActive = useCallback(
    async (promotion: AdminPromotion) => {
      await patchPromotion(promotion.id, {
        is_active: promotion.is_active === false,
      });
    },
    [patchPromotion],
  );

  const handleUploadImage = useCallback(
    async (file: File) => {
      if (!selectedPromotion) return;
      const updated = await addPromotionImage(
        selectedPromotion.id,
        file,
        { displayOrder: selectedPromotion.promotion_images.length },
      );
      setSelectedPromotion(updated);
    },
    [addPromotionImage, selectedPromotion],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title="Promociones"
          description="Banners del inicio y de la comunidad móvil."
        />
        <Button
          onClick={openCreate}
          className="shrink-0 bg-vite-purple text-white hover:bg-vite-purple/90"
        >
          <Plus className="size-4" />
          Nueva promoción
        </Button>
      </div>

      {error ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refresh()}
            className="border-red-200 bg-white"
          >
            Reintentar
          </Button>
        </div>
      ) : null}

      <PromotionsTable
        promotions={promotions}
        isLoading={isLoading}
        isSaving={isSaving}
        onEdit={openEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
        onCreate={openCreate}
      />

      <PromotionFormSheet
        mode={sheetMode}
        promotion={selectedPromotion}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        isSaving={isSaving}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onUploadImage={
          sheetMode === "edit" && selectedPromotion
            ? handleUploadImage
            : undefined
        }
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Eliminar promoción"
        description={
          deleteTarget
            ? `¿Eliminar la promoción "${deleteTarget.title}"? También se borrarán sus imágenes.`
            : ""
        }
        confirmLabel="Eliminar"
        variant="destructive"
        tone="admin"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
