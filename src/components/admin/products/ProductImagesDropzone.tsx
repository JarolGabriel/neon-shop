"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

const MAX_SIZE = 5 * 1024 * 1024;

interface ProductImagesDropzoneProps {
  value: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

export function ProductImagesDropzone({
  value,
  onChange,
  disabled = false,
}: ProductImagesDropzoneProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = value.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [value]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      onChange([...value, ...accepted]);
    },
    [onChange, value],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected: () => toast.error("Imagen no válida (JPG, PNG o WebP, máx. 5 MB)"),
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    disabled,
    noClick: true,
    noKeyboard: true,
  });

  const removeFile = (index: number) => {
    onChange(value.filter((_, fileIndex) => fileIndex !== index));
  };

  return (
    <div className="space-y-3">
      {previews.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {previews.map((preview, index) => (
            <div
              key={preview}
              className="relative overflow-hidden rounded-lg border border-slate-200"
            >
              <img
                src={preview}
                alt={`Vista previa ${index + 1}`}
                className="aspect-square w-full object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-1 top-1 size-7 bg-white"
                disabled={disabled}
                onClick={() => removeFile(index)}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      <div
        {...getRootProps()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-6 text-center text-sm",
          isDragActive
            ? "border-vite-purple bg-vite-purple/5"
            : "border-slate-200 text-slate-500 hover:bg-slate-50",
          disabled && "cursor-not-allowed opacity-60",
        )}
        onClick={() => !disabled && open()}
      >
        <input {...getInputProps()} />
        <ImagePlus className="mb-2 size-6 text-slate-400" />
        <p className="text-slate-700">
          Arrastra imágenes o{" "}
          <span className="font-medium text-vite-purple underline underline-offset-2">
            selecciona archivos
          </span>
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Mínimo 1 imagen — JPG, PNG o WebP (máx. 5 MB c/u)
        </p>
      </div>
    </div>
  );
}
