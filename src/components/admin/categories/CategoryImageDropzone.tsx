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

interface CategoryImageDropzoneProps {
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export function CategoryImageDropzone({
  value,
  onChange,
  disabled = false,
}: CategoryImageDropzoneProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const onDrop = useCallback(
    (accepted: File[]) => {
      onChange(accepted[0] ?? null);
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected: (rejections) => {
      const code = rejections[0]?.errors[0]?.code;
      const message =
        code === "file-too-large"
          ? "La imagen no puede superar los 5 MB"
          : code === "file-invalid-type"
            ? "Solo se aceptan archivos JPG, PNG o WebP"
            : "No pudimos cargar la imagen. Inténtalo de nuevo.";
      toast.error("Imagen no válida", { description: message });
    },
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: MAX_SIZE,
    disabled,
    noClick: true,
    noKeyboard: true,
  });

  if (previewUrl) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-slate-200">
        <img
          src={previewUrl}
          alt="Vista previa"
          className="max-h-48 w-full object-cover"
        />
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute right-2 top-2 bg-white"
          disabled={disabled}
          onClick={() => onChange(null)}
        >
          <X className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center text-sm transition-colors",
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
        Arrastra una imagen o{" "}
        <span className="font-medium text-vite-purple underline underline-offset-2">
          selecciona un archivo
        </span>
      </p>
      <p className="mt-1 text-xs text-slate-400">JPG, PNG o WebP — máximo 5 MB</p>
    </div>
  );
}
