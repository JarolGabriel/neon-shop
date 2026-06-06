"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileImage, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};

interface CustomDesignFileDropzoneProps {
  value: File | undefined;
  onChange: (file: File | undefined) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export function CustomDesignFileDropzone({
  value,
  onChange,
  disabled = false,
  hasError = false,
}: CustomDesignFileDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      onChange(accepted[0]);
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected: (rejections) => {
      const code = rejections[0]?.errors[0]?.code;
      const message =
        code === "file-too-large"
          ? "El archivo no puede superar los 10 MB"
          : code === "file-invalid-type"
            ? "Solo se aceptan archivos JPG, PNG, WebP o PDF"
            : "No pudimos cargar el archivo. Inténtalo de nuevo.";
      toast.error("Archivo no válido", {
        description: message,
        classNames: {
          toast:
            "group-[.toaster]:border-l-4 group-[.toaster]:border-l-neon-pink group-[.toaster]:bg-neon-surface",
        },
      });
    },
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled,
    noClick: true,
    noKeyboard: true,
  });

  const handleRemove = () => onChange(undefined);

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors",
          isDragActive
            ? "border-vite-purple bg-vite-purple/5 dark:border-cyber-yellow dark:bg-cyber-yellow/5"
            : "border-border/70 bg-background/50 hover:border-vite-purple/60 dark:hover:border-cyber-yellow/60",
          hasError && "border-destructive/60",
          disabled && "cursor-not-allowed opacity-60",
        )}
        onClick={() => !disabled && open()}
      >
        <input {...getInputProps()} />
        <Upload className="mb-2 size-8 text-muted-foreground" aria-hidden />
        <p className="text-sm text-foreground">
          Arrastra y suelta tus archivos o{" "}
          <span className="font-medium text-neon-pink underline underline-offset-2 dark:text-cyber-yellow">
            navega
          </span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG, PNG, WebP o PDF — máximo 10 MB
        </p>
      </div>

      {value && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/80 px-3 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <FileImage
              className="size-4 shrink-0 text-vite-purple dark:text-cyber-yellow"
              aria-hidden
            />
            <span className="truncate text-sm text-foreground">{value.name}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Quitar archivo"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
