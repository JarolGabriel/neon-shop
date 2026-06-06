import { toast } from "sonner";
import type { FieldErrors } from "react-hook-form";
import { showFirstFieldErrorToast } from "@/lib/form-errors";
import type { ReviewFormValues } from "@/lib/schemas/review";

const REVIEW_FIELD_CONFIG = {
  order: ["rating", "title", "content", "user_name", "email"],
  labels: {
    rating: "Clasificación",
    title: "Título de la reseña",
    content: "Contenido de la reseña",
    user_name: "Nombre de visualización",
    email: "Correo electrónico",
  },
} as const;

export function showReviewValidationToasts(
  errors: FieldErrors<ReviewFormValues>,
): void {
  showFirstFieldErrorToast(errors, REVIEW_FIELD_CONFIG);
}

export function showReviewSuccessToast(): void {
  toast.success("¡Gracias por compartir tu experiencia!", {
    description:
      "Tu reseña ya está publicada. Ayudas a otros a imaginar cómo se verá su letrero neón.",
    duration: 5500,
    classNames: {
      toast:
        "group-[.toaster]:border-l-4 group-[.toaster]:border-l-vite-purple group-[.toaster]:bg-neon-surface dark:group-[.toaster]:border-l-cyber-yellow",
      title: "font-heading font-bold text-foreground",
      description: "text-muted-foreground",
      icon: "text-vite-purple dark:text-cyber-yellow",
    },
  });
}

export function showReviewSubmitErrorToast(message: string): void {
  toast.error("No pudimos enviar tu reseña", {
    description: message,
    duration: 5000,
    classNames: {
      toast:
        "group-[.toaster]:border-l-4 group-[.toaster]:border-l-neon-pink group-[.toaster]:bg-neon-surface",
      title: "font-heading font-semibold text-foreground",
      description: "text-muted-foreground",
    },
  });
}

export function showReviewImageErrorToast(message: string): void {
  toast.error("Imagen no válida", {
    description: message,
    duration: 4500,
    classNames: {
      toast:
        "group-[.toaster]:border-l-4 group-[.toaster]:border-l-neon-pink group-[.toaster]:bg-neon-surface",
      title: "font-heading font-semibold text-foreground",
      description: "text-muted-foreground",
    },
  });
}
