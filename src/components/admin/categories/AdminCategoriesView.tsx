"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { AdminErrorBanner } from "@/components/admin/AdminErrorBanner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { CategoriesTable } from "@/components/admin/categories/CategoriesTable";
import { CategoryFormSheet } from "@/components/admin/categories/CategoryFormSheet";
import { Button } from "@/components/ui/button";
import { useAdminCategories } from "@/hooks/useAdminCategories";
import type {
  AdminCategoryCreateInput,
  AdminCategoryUpdateInput,
} from "@/lib/schemas/admin-category";
import type { AdminCategory } from "@/types/admin";

export function AdminCategoriesView() {
  const {
    categories,
    isLoading,
    isSaving,
    error,
    refresh,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useAdminCategories();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<AdminCategory | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreate = useCallback(() => {
    setSheetMode("create");
    setSelectedCategory(null);
    setSheetOpen(true);
  }, []);

  const openEdit = useCallback((category: AdminCategory) => {
    setSheetMode("edit");
    setSelectedCategory(category);
    setSheetOpen(true);
  }, []);

  const handleDelete = useCallback((category: AdminCategory) => {
    setDeleteTarget(category);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCategory(deleteTarget.id);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteCategory, deleteTarget]);

  const handleCreate = useCallback(
    async (values: AdminCategoryCreateInput) => {
      await createCategory(values);
    },
    [createCategory],
  );

  const handleUpdate = useCallback(
    async (values: AdminCategoryUpdateInput) => {
      if (!selectedCategory) return;
      await updateCategory(selectedCategory.id, values);
    },
    [selectedCategory, updateCategory],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title="Categorías"
          description="Organiza el catálogo. Las categorías activas aparecen en la home y en el menú de productos."
        />
        <Button
          onClick={openCreate}
          className="shrink-0 bg-vite-purple text-white hover:bg-vite-purple/90"
        >
          <Plus className="size-4" />
          Nueva categoría
        </Button>
      </div>

      {error ? (
        <AdminErrorBanner message={error} onRetry={() => void refresh()} />
      ) : null}

      <CategoriesTable
        categories={categories}
        isLoading={isLoading}
        onEdit={openEdit}
        onDelete={handleDelete}
        onCreate={openCreate}
      />

      <CategoryFormSheet
        mode={sheetMode}
        category={selectedCategory}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        isSaving={isSaving}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Eliminar categoría"
        description={
          deleteTarget
            ? `¿Eliminar la categoría "${deleteTarget.name}"? Esta acción no se puede deshacer.`
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
