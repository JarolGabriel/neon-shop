"use client";

import { AdminFormSection } from "@/components/admin/AdminFormSection";
import { AdminImageUploadDropzone } from "@/components/admin/AdminImageUploadDropzone";
import { resolvePublicStorageUrl } from "@/lib/storage-url";
import type { AdminPromotionImage } from "@/types/admin";

interface PromotionImagesManagerProps {
  images: AdminPromotionImage[];
  isSaving: boolean;
  onUpload: (file: File) => Promise<void>;
}

export function PromotionImagesManager({
  images,
  isSaving,
  onUpload,
}: PromotionImagesManagerProps) {
  const sortedImages = [...images].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );

  return (
    <AdminFormSection
      label="Imágenes de la promoción"
      description="Sin imagen la promoción no aparecerá en la tienda. Puedes agregar varias; la de menor orden se muestra primero en Home."
    >
      {sortedImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {sortedImages.map((image, index) => {
            const src = resolvePublicStorageUrl(image.image_url);
            return (
              <div
                key={image.id}
                className="overflow-hidden rounded-lg border border-slate-200"
              >
                {src ? (
                  <img
                    src={src}
                    alt={image.alt_text ?? "Imagen de promoción"}
                    className="aspect-video w-full object-cover"
                  />
                ) : null}
                <p className="px-2 py-1 text-xs text-slate-500">
                  Orden {image.display_order ?? index}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Aún no hay imágenes. Arrastra o selecciona al menos una para que se
          vea en la tienda.
        </p>
      )}

      <AdminImageUploadDropzone
        onUpload={onUpload}
        disabled={isSaving}
      />
    </AdminFormSection>
  );
}
