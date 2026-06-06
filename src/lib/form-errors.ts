import { toast } from "sonner";
import type { FieldError, FieldErrors, FieldValues } from "react-hook-form";

interface FieldToastConfig {
  order: readonly string[];
  labels: Readonly<Record<string, string>>;
  position?: "top-center" | "bottom-center";
}

const TOAST_ERROR_CLASS =
  "group-[.toaster]:border-l-4 group-[.toaster]:border-l-neon-pink group-[.toaster]:bg-neon-surface";

function getFieldErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;

  const fieldError = error as FieldError;

  if (typeof fieldError.message === "string" && fieldError.message.length > 0) {
    return fieldError.message;
  }

  if (fieldError.types) {
    for (const value of Object.values(fieldError.types)) {
      if (typeof value === "string" && value.length > 0) return value;
      if (Array.isArray(value)) {
        const first = value.find((item) => typeof item === "string" && item.length > 0);
        if (typeof first === "string") return first;
      }
    }
  }

  return undefined;
}

function showFieldToast(
  title: string,
  message: string,
  position: FieldToastConfig["position"],
): void {
  toast.error(title, {
    description: message,
    duration: 4500,
    position: position ?? "bottom-center",
    classNames: {
      toast: TOAST_ERROR_CLASS,
      title: "font-heading font-semibold text-foreground",
      description: "text-muted-foreground",
    },
  });
}

/**
 * Muestra un solo Toast: el primer campo con error según el orden del formulario
 * (de arriba hacia abajo). Al corregirlo y reenviar, aparece el siguiente.
 */
export function showFirstFieldErrorToast<T extends FieldValues>(
  errors: FieldErrors<T>,
  config: FieldToastConfig,
): void {
  const renderToast = () => {
    for (const key of config.order) {
      const message = getFieldErrorMessage(errors[key as keyof typeof errors]);
      if (!message) continue;

      showFieldToast(config.labels[key] ?? key, message, config.position);
      return;
    }

    for (const [key, error] of Object.entries(errors)) {
      const message = getFieldErrorMessage(error);
      if (!message) continue;

      showFieldToast(config.labels[key] ?? key, message, config.position);
      return;
    }

    showFieldToast(
      "Revisa el formulario",
      "Hay campos obligatorios sin completar.",
      config.position,
    );
  };

  queueMicrotask(renderToast);
}
