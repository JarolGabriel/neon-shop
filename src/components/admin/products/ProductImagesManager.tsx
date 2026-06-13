"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { resolvePublicStorageUrl } from "@/lib/storage-url";
import type { AdminProductImage } from "@/types/admin";

interface ProductImagesManagerProps {
  images: AdminProductImage[];
  isSaving: boolean;
  onUpload: (file: File, isPrimary: boolean) => Promise<void>;
  onDelete: (imageId: string) => Promise<void>;
  onSetPrimary: (image: AdminProductImage) => Promise<void>;
}

export function ProductImagesManager({
  images,
  isSaving,
  onUpload,
  onDelete,
  onSetPrimary,
}: ProductImagesManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [markPrimary, setMarkPrimary] = useState(false);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      await onUpload(file, markPrimary);
      setMarkPrimary(false);
      if (inputRef.current) inputRef.current.value = "";
    },
    [markPrimary, onUpload],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">Imágenes del producto</p>
        <div className="flex items-center gap-2">
          <Checkbox
            id="mark-primary"
            checked={markPrimary}
            onCheckedChange={(checked) => setMarkPrimary(checked === true)}
            disabled={isSaving}
          />
          <Label htmlFor="mark-primary" className="text-xs text-slate-600">
            Marcar nueva como principal
          </Label>
        </div>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((image) => {
            const src = resolvePublicStorageUrl(image.image_url);
            return (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-lg border border-slate-200"
              >
                {src ? (
                  <img
                    src={src}
                    alt={image.alt_text ?? "Imagen de producto"}
                    className="aspect-square w-full object-cover"
                  />
                ) : null}
                {image.is_primary ? (
                  <Badge className="absolute left-2 top-2 bg-vite-purple text-white">
                    Principal
                  </Badge>
                ) : null}
                <div className="absolute bottom-2 right-2 flex gap-1">
                  {!image.is_primary ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="size-7 bg-white"
                      disabled={isSaving}
                      onClick={() => void onSetPrimary(image)}
                      title="Marcar como principal"
                    >
                      <Star className="size-3.5" />
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="size-7 bg-white"
                    disabled={isSaving || image.is_primary === true}
                    onClick={() => void onDelete(image.id)}
                    title={
                      image.is_primary
                        ? "Marca otra como principal antes de eliminar"
                        : "Eliminar imagen"
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500">Este producto no tiene imágenes.</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={isSaving}
        onChange={(event) => void handleFileChange(event)}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full border-slate-200 bg-white"
        disabled={isSaving}
        onClick={() => inputRef.current?.click()}
      >
        <ImagePlus className="size-4" />
        Subir imagen
      </Button>
    </div>
  );
}
