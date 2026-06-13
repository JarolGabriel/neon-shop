"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ADMIN_IMAGE_ACCEPT, ADMIN_IMAGE_MAX_SIZE_BYTES } from "@/lib/admin-ui";
import { cn } from "@/lib/utils";

interface AdminImageUploadDropzoneProps {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
}

function rejectedImageMessage(code: string | undefined): string {
  if (code === "file-too-large") {
    return "La imagen no puede superar los 5 MB";
  }
  if (code === "file-invalid-type") {
    return "Solo se aceptan archivos JPG, PNG o WebP";
  }
  return "No pudimos cargar la imagen. Inténtalo de nuevo.";
}

export function AdminImageUploadDropzone({
  onUpload,
  disabled = false,
  multiple = true,
  className,
}: AdminImageUploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const busy = disabled || isUploading;

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      setIsUploading(true);
      try {
        for (const file of files) {
          await onUpload(file);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "No se pudo subir la imagen.",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [onUpload],
  );

  const onDrop = useCallback(
    (accepted: File[]) => {
      void uploadFiles(accepted);
    },
    [uploadFiles],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected: (rejections) => {
      const code = rejections[0]?.errors[0]?.code;
      toast.error("Imagen no válida", {
        description: rejectedImageMessage(code),
      });
    },
    accept: ADMIN_IMAGE_ACCEPT,
    maxSize: ADMIN_IMAGE_MAX_SIZE_BYTES,
    multiple,
    disabled: busy,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-6 text-center text-sm transition-colors",
        isDragActive
          ? "border-vite-purple bg-vite-purple/5"
          : "border-slate-200 text-slate-500 hover:bg-slate-50",
        busy && "cursor-not-allowed opacity-60",
        className,
      )}
      onClick={() => !busy && open()}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <Loader2 className="mb-2 size-6 animate-spin text-vite-purple" />
      ) : (
        <ImagePlus className="mb-2 size-6 text-slate-400" />
      )}
      <p className="text-slate-700">
        {isUploading ? (
          "Subiendo imagen..."
        ) : (
          <>
            Arrastra {multiple ? "imágenes" : "una imagen"} o{" "}
            <span className="font-medium text-vite-purple underline underline-offset-2">
              selecciona {multiple ? "archivos" : "un archivo"}
            </span>
          </>
        )}
      </p>
      <p className="mt-1 text-xs text-slate-400">
        JPG, PNG o WebP — máximo 5 MB
        {multiple ? " por imagen" : ""}
      </p>
    </div>
  );
}
