"use client";

import { CategoryCreateForm } from "@/components/admin/categories/CategoryCreateForm";
import { CategoryEditForm } from "@/components/admin/categories/CategoryEditForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  AdminCategoryCreateInput,
  AdminCategoryUpdateInput,
} from "@/lib/schemas/admin-category";
import type { AdminCategory } from "@/types/admin";

interface CategoryFormSheetProps {
  mode: "create" | "edit";
  category: AdminCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaving: boolean;
  onCreate: (values: AdminCategoryCreateInput) => Promise<void>;
  onUpdate: (values: AdminCategoryUpdateInput) => Promise<void>;
}

export function CategoryFormSheet({
  mode,
  category,
  open,
  onOpenChange,
  isSaving,
  onCreate,
  onUpdate,
}: CategoryFormSheetProps) {
  const isCreate = mode === "create";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-slate-200 bg-white sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-slate-900">
            {isCreate ? "Nueva categoría" : "Editar categoría"}
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            {isCreate
              ? "Crea una categoría con imagen para mostrarla en la tienda."
              : "Actualiza nombre, slug, orden y estado de visibilidad."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6">
          {isCreate ? (
            <CategoryCreateForm
              isSaving={isSaving}
              onSubmit={async (values) => {
                await onCreate(values);
                onOpenChange(false);
              }}
            />
          ) : category ? (
            <CategoryEditForm
              category={category}
              isSaving={isSaving}
              onSubmit={async (values) => {
                await onUpdate(values);
                onOpenChange(false);
              }}
            />
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
