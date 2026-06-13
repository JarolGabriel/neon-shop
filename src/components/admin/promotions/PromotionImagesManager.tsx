"use client";

import { useCallback, useRef } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const sortedImages = [...images].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0),
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      await onUpload(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [onUpload],
  );

  return (
    <FormItem>
      <FormLabel className="text-slate-700">Imágenes de la promoción</FormLabel>
      <FormDescription className="text-slate-500">
        Sin imagen la promoción no aparecerá en la tienda. Puedes agregar varias;
        la de menor orden se muestra primero en Home.
      </FormDescription>

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
          Aún no hay imágenes. Sube al menos una para que se vea en la tienda.
        </p>
      )}

      <FormControl>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isSaving}
            onChange={(event) => void handleFileChange(event)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSaving}
            onClick={() => inputRef.current?.click()}
            className="border-slate-200 bg-white"
          >
            <ImagePlus className="size-4" />
            Subir imagen
          </Button>
        </div>
      </FormControl>
    </FormItem>
  );
}
