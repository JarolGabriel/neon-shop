"use client";

import { PromotionForm } from "@/components/admin/promotions/PromotionForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { AdminPromotionFormInput } from "@/lib/schemas/admin-promotion";
import type { AdminPromotion } from "@/types/admin";

interface PromotionFormSheetProps {
  mode: "create" | "edit";
  promotion: AdminPromotion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaving: boolean;
  onCreate: (values: AdminPromotionFormInput) => Promise<AdminPromotion>;
  onUpdate: (values: AdminPromotionFormInput) => Promise<AdminPromotion>;
  onUploadImage?: (file: File) => Promise<void>;
}

export function PromotionFormSheet({
  mode,
  promotion,
  open,
  onOpenChange,
  isSaving,
  onCreate,
  onUpdate,
  onUploadImage,
}: PromotionFormSheetProps) {
  const isCreate = mode === "create";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-slate-200 bg-white sm:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-slate-900">
            {isCreate ? "Nueva promoción" : "Editar promoción"}
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            {isCreate
              ? "Crea la promoción y luego sube al menos una imagen."
              : "Actualiza datos, fechas e imágenes de la promoción."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6">
          <PromotionForm
            promotion={isCreate ? null : promotion}
            isSaving={isSaving}
            onSubmit={async (values) => {
              if (isCreate) {
                await onCreate(values);
              } else {
                await onUpdate(values);
              }
            }}
            onUploadImage={onUploadImage}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
