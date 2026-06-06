"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  showReviewImageErrorToast,
  showReviewValidationToasts,
} from "@/lib/review-toasts";
import {
  reviewFormSchema,
  type ReviewFormValues,
} from "@/lib/schemas/review";
import { cn } from "@/lib/utils";
import { StarRating } from "./StarRating";

export type { ReviewFormValues };

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ReviewFormProps {
  onSubmit: (values: ReviewFormValues, file?: File | null) => Promise<void>;
}

function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Solo se aceptan imágenes JPG, PNG, WebP o GIF.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "La imagen no puede superar los 5 MB.";
  }
  return null;
}

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      title: "",
      content: "",
      user_name: "",
      email: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      showReviewImageErrorToast(validationError);
      setSelectedFile(null);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFormSubmit = async (values: ReviewFormValues) => {
    await onSubmit(values, selectedFile);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit, showReviewValidationToasts)}
        className="flex flex-col gap-3"
        noValidate
      >
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="items-center gap-1 text-center">
              <Label className="text-sm font-medium text-foreground">
                Clasificación
              </Label>
              <div className="flex justify-center">
                <StarRating
                  value={field.value}
                  size="lg"
                  interactive
                  onChange={(v) => field.onChange(v)}
                />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="gap-1">
              <Label className="text-center text-sm font-medium text-foreground">
                Título de la reseña{" "}
                <span className="text-muted-foreground">(100)</span>
              </Label>
              <Input
                placeholder="Dale un título a tu reseña"
                maxLength={100}
                {...field}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="gap-1">
              <Label className="text-center text-sm font-medium text-foreground">
                Contenido de la reseña
              </Label>
              <Textarea
                placeholder="Empieza a escribir aquí..."
                className="min-h-20"
                {...field}
              />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-center gap-1 text-center">
          <Label className="text-sm font-medium text-foreground">
            Imagen (opcional)
          </Label>
          <p className="text-xs text-muted-foreground">
            Muestra tu letrero neón instalado. Máx. 5 MB.
          </p>

          {previewUrl ? (
            <div className="relative size-20 overflow-hidden rounded-lg border border-input">
              <Image
                src={previewUrl}
                alt="Vista previa de la imagen"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={clearFile}
                className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-foreground/80 text-background"
                aria-label="Quitar imagen"
              >
                <X className="size-3" />
              </button>
            </div>
          ) : (
            <label
              className={cn(
                "flex size-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-input bg-background text-muted-foreground transition-colors hover:border-vite-purple hover:text-vite-purple",
              )}
            >
              <Upload className="size-6" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>

        <FormField
          control={form.control}
          name="user_name"
          render={({ field }) => (
            <FormItem className="gap-1">
              <Label className="text-center text-sm font-medium text-foreground">
                Nombre de visualización
              </Label>
              <Input placeholder="Coloca tu nombre aquí" {...field} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="gap-1">
              <Label className="text-center text-sm font-medium text-foreground">
                Dirección de correo electrónico
              </Label>
              <Input
                type="email"
                placeholder="Tu dirección de correo electrónico"
                {...field}
              />
            </FormItem>
          )}
        />

        <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="h-10 px-6">
              Cancelar reseña
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-10 bg-foreground px-6 text-background hover:bg-foreground/90"
          >
            {form.formState.isSubmitting ? "Enviando..." : "Enviar reseña"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
