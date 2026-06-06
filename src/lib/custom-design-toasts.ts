import { toast } from "sonner";
import { showFirstFieldErrorToast } from "@/lib/form-errors";
import type { CustomDesignFormInput } from "@/lib/schemas/custom-design-form";

const FIELD_LABELS: Record<keyof CustomDesignFormInput, string> = {
  preferred_size: "Tamaño aproximado",
  budget_range: "Presupuesto estimado",
  purpose: "Uso del letrero",
  delivery_address: "Dirección de entrega",
  material: "Material",
  usage_type: "Uso interior o exterior",
  delivery_time: "Tiempo de entrega",
  customer_notes: "Detalles del letrero",
  customer_name: "Nombre / empresa",
  customer_email: "Correo electrónico",
  file: "Archivo de diseño",
};

const FIELD_ORDER: (keyof CustomDesignFormInput)[] = [
  "preferred_size",
  "budget_range",
  "purpose",
  "delivery_address",
  "material",
  "usage_type",
  "delivery_time",
  "customer_notes",
  "customer_name",
  "customer_email",
  "file",
];

const TOAST_SUCCESS_CLASS =
  "group-[.toaster]:border-l-4 group-[.toaster]:border-l-vite-purple group-[.toaster]:bg-neon-surface dark:group-[.toaster]:border-l-cyber-yellow";

const TOAST_ERROR_CLASS =
  "group-[.toaster]:border-l-4 group-[.toaster]:border-l-neon-pink group-[.toaster]:bg-neon-surface";

export function showCustomDesignValidationToasts(
  errors: Parameters<typeof showFirstFieldErrorToast<CustomDesignFormInput>>[0],
): void {
  showFirstFieldErrorToast(errors, {
    order: FIELD_ORDER,
    labels: FIELD_LABELS,
    position: "bottom-center",
  });
}

export function showCustomDesignSuccessToast(message: string): void {
  toast.success("¡Solicitud enviada!", {
    description: message,
    duration: 6000,
    classNames: {
      toast: TOAST_SUCCESS_CLASS,
      title: "font-heading font-semibold text-foreground",
      description: "text-muted-foreground",
    },
  });
}

export function showCustomDesignErrorToast(message: string): void {
  toast.error("No pudimos enviar tu solicitud", {
    description: message,
    duration: 5000,
    classNames: {
      toast: TOAST_ERROR_CLASS,
      title: "font-heading font-semibold text-foreground",
      description: "text-muted-foreground",
    },
  });
}
