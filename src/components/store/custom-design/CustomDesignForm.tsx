"use client";

import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomDesignFileDropzone } from "@/components/store/custom-design/CustomDesignFileDropzone";
import { CustomDesignSelectField } from "@/components/store/custom-design/CustomDesignSelectField";
import {
  BUDGET_OPTIONS,
  DELIVERY_TIME_OPTIONS,
  MATERIAL_OPTIONS,
  PURPOSE_OPTIONS,
  SIZE_OPTIONS,
  USAGE_OPTIONS,
} from "@/components/store/custom-design/custom-design-options";
import { uploadCustomDesignLogo } from "@/lib/api";
import {
  showCustomDesignErrorToast,
  showCustomDesignSuccessToast,
  showCustomDesignValidationToasts,
} from "@/lib/custom-design-toasts";
import {
  customDesignFormSchema,
  type CustomDesignFormInput,
  type CustomDesignFormValues,
} from "@/lib/schemas/custom-design-form";
import { cn } from "@/lib/utils";

const DEFAULT_VALUES: CustomDesignFormInput = {
  preferred_size: "",
  budget_range: "",
  purpose: "",
  delivery_address: "",
  material: "",
  usage_type: "",
  delivery_time: "",
  customer_notes: "",
  customer_name: "",
  customer_email: "",
  file: undefined,
};

export function CustomDesignForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<
    CustomDesignFormInput,
    unknown,
    CustomDesignFormValues
  >({
    resolver: zodResolver(customDesignFormSchema, undefined, { mode: "sync" }),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
  });

  const handleInvalidSubmit = (errors: FieldErrors<CustomDesignFormInput>) => {
    showCustomDesignValidationToasts(errors);
  };

  const handleSubmit = async (values: CustomDesignFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await uploadCustomDesignLogo(values);
      if (response.success) {
        showCustomDesignSuccessToast(response.message);
        form.reset(DEFAULT_VALUES);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado. Inténtalo de nuevo.";
      showCustomDesignErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-neon-surface p-5 shadow-lg shadow-vite-purple/5 sm:p-8">
      <h2 className="text-center font-heading text-xl font-bold text-foreground sm:text-2xl">
        Sube tu propio diseño o logotipo
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit, handleInvalidSubmit)}
          className="mt-8 space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CustomDesignSelectField
              control={form.control}
              name="preferred_size"
              label="Tamaño aproximado"
              options={SIZE_OPTIONS}
            />
            <CustomDesignSelectField
              control={form.control}
              name="budget_range"
              label="Presupuesto estimado"
              options={BUDGET_OPTIONS}
            />
            <CustomDesignSelectField
              control={form.control}
              name="purpose"
              label="¿Para qué usarás el letrero?"
              options={PURPOSE_OPTIONS}
            />
            <FormField
              control={form.control}
              name="delivery_address"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Dirección de entrega</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Código postal, ciudad (p. ej., 28013 Madrid)"
                      aria-invalid={!!fieldState.error}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CustomDesignSelectField
              control={form.control}
              name="material"
              label="Material"
              options={MATERIAL_OPTIONS}
            />
            <CustomDesignSelectField
              control={form.control}
              name="usage_type"
              label="¿Uso interior o exterior?"
              options={USAGE_OPTIONS}
            />
          </div>

          <CustomDesignSelectField
            control={form.control}
            name="delivery_time"
            label="Tiempo de entrega estimado (producción + envío)"
            options={DELIVERY_TIME_OPTIONS}
          />

          <FormField
            control={form.control}
            name="customer_notes"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Detalles del letrero de neón</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="El tamaño, los colores y el uso garantizan un presupuesto preciso y personalizado. Si el letrero es para un evento, añade también la fecha."
                    className="min-h-32"
                    aria-invalid={!!fieldState.error}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Nombre / Nombre de la empresa</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="p. ej., Nombre / Nombre de la empresa"
                      aria-invalid={!!fieldState.error}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customer_email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="tu dirección de correo electrónico"
                      autoComplete="email"
                      aria-invalid={!!fieldState.error}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="file"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>
                  Sube un logotipo o una idea de diseño (ej. boceto, dibujo,
                  imagen)
                </FormLabel>
                <FormControl>
                  <CustomDesignFileDropzone
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    hasError={!!fieldState.error}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "h-11 w-full rounded-lg border-0 text-base font-semibold text-white shadow-md",
              "bg-linear-to-r from-vite-purple to-neon-pink",
              "hover:opacity-90 disabled:opacity-60",
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Enviando solicitud…
              </>
            ) : (
              "Obtén un presupuesto y diseño gratis"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
