"use client";

import { ProductCreateForm } from "@/components/admin/products/ProductCreateForm";
import { ProductEditForm } from "@/components/admin/products/ProductEditForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type {
  AdminProductCreateInput,
  AdminProductUpdateInput,
} from "@/lib/schemas/admin-product";
import type { AdminCategory, AdminProduct, AdminProductImage } from "@/types/admin";

interface ProductFormSheetProps {
  mode: "create" | "edit";
  product: AdminProduct | null;
  categories: AdminCategory[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaving: boolean;
  onCreate: (values: AdminProductCreateInput) => Promise<void>;
  onUpdate: (values: AdminProductUpdateInput) => Promise<void>;
  onUploadImage: (file: File, isPrimary: boolean) => Promise<AdminProduct>;
  onDeleteImage: (imageId: string) => Promise<AdminProduct>;
  onSetPrimaryImage: (image: AdminProductImage) => Promise<AdminProduct>;
}

export function ProductFormSheet({
  mode,
  product,
  categories,
  open,
  onOpenChange,
  isSaving,
  onCreate,
  onUpdate,
  onUploadImage,
  onDeleteImage,
  onSetPrimaryImage,
}: ProductFormSheetProps) {
  const isCreate = mode === "create";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-slate-200 bg-white sm:max-w-xl"
      >
        <SheetHeader>
          <SheetTitle className="text-slate-900">
            {isCreate ? "Nuevo producto" : "Editar producto"}
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            {isCreate
              ? "Crea un producto con al menos una imagen y una categoría."
              : "Actualiza datos, stock, precio e imágenes del producto."}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6">
          {isCreate ? (
            <ProductCreateForm
              categories={categories}
              isSaving={isSaving}
              onSubmit={async (values) => {
                await onCreate(values);
                onOpenChange(false);
              }}
            />
          ) : product ? (
            <ProductEditForm
              key={product.id}
              product={product}
              categories={categories}
              isSaving={isSaving}
              onSubmit={async (values) => {
                await onUpdate(values);
                onOpenChange(false);
              }}
              onUploadImage={onUploadImage}
              onDeleteImage={onDeleteImage}
              onSetPrimaryImage={onSetPrimaryImage}
            />
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
