"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { StarRating } from "./StarRating";

const reviewSchema = z.object({
  rating: z
    .number({ message: "Selecciona una calificación" })
    .int()
    .min(1, "Selecciona una calificación")
    .max(5),
  title: z.string().min(1, "El título es obligatorio").max(100),
  content: z.string().min(1, "Escribe el contenido de tu reseña"),
  user_name: z.string().min(1, "Ingresa tu nombre de visualización"),
  email: z.string().email("Correo electrónico inválido"),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  onSubmit: (values: ReviewFormValues) => Promise<void>;
}

const LABEL = "block text-center text-sm font-medium text-foreground";
const INPUT =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-vite-purple focus-visible:ring-2 focus-visible:ring-vite-purple/40";

export function ReviewForm({ onSubmit }: ReviewFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 as unknown as number },
  });

  const rating = watch("rating");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-1">
        <span className={LABEL}>Clasificación</span>
        <StarRating
          value={rating ?? 0}
          size="lg"
          interactive
          onChange={(v) =>
            setValue("rating", v, { shouldValidate: true, shouldDirty: true })
          }
        />
        {errors.rating && (
          <p className="text-xs text-destructive">{errors.rating.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className={LABEL} htmlFor="review-title">
          Título de la reseña <span className="text-muted-foreground">(100)</span>
        </label>
        <input
          id="review-title"
          className={INPUT}
          placeholder="Dale un título a tu reseña"
          maxLength={100}
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className={LABEL} htmlFor="review-content">
          Contenido de la reseña
        </label>
        <textarea
          id="review-content"
          className={`${INPUT} min-h-28 resize-y`}
          placeholder="Empieza a escribir aquí..."
          {...register("content")}
        />
        {errors.content && (
          <p className="text-xs text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className={LABEL}>Imagen/Vídeo (opcional)</span>
        <label className="flex size-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-input bg-background text-muted-foreground transition-colors hover:border-vite-purple hover:text-vite-purple">
          <Upload className="size-7" />
          <input type="file" accept="image/*,video/*" className="sr-only" />
        </label>
      </div>

      <div className="flex flex-col gap-1">
        <label className={LABEL} htmlFor="review-name">
          Nombre de visualización
        </label>
        <input
          id="review-name"
          className={INPUT}
          placeholder="Coloca tu nombre aquí"
          {...register("user_name")}
        />
        {errors.user_name && (
          <p className="text-xs text-destructive">{errors.user_name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className={LABEL} htmlFor="review-email">
          Dirección de correo electrónico
        </label>
        <input
          id="review-email"
          type="email"
          className={INPUT}
          placeholder="Tu dirección de correo electrónico"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
        <DialogClose asChild>
          <Button type="button" variant="outline" className="h-10 px-6">
            Cancelar reseña
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 bg-foreground px-6 text-background hover:bg-foreground/90"
        >
          {isSubmitting ? "Enviando..." : "Enviar reseña"}
        </Button>
      </div>
    </form>
  );
}
