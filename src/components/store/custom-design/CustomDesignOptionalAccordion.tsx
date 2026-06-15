"use client";

import type { Control } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomDesignSelectField } from "@/components/store/custom-design/CustomDesignSelectField";
import {
  BUDGET_OPTIONS,
  DELIVERY_TIME_OPTIONS,
  MATERIAL_OPTIONS,
  PURPOSE_OPTIONS,
  SIZE_OPTIONS_LABEL_ONLY,
  USAGE_OPTIONS,
} from "@/components/store/custom-design/custom-design-options";
import type { CustomDesignFormInput } from "@/lib/schemas/custom-design-form";

interface CustomDesignOptionalAccordionProps {
  control: Control<CustomDesignFormInput>;
}

export function CustomDesignOptionalAccordion({
  control,
}: CustomDesignOptionalAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-xl border border-border/60 bg-background/40 px-4 sm:px-5"
    >
      <AccordionItem value="specs" className="border-none">
        <AccordionTrigger className="py-4 text-foreground hover:no-underline hover:text-neon-pink! dark:hover:text-cyber-yellow!">
          <div className="space-y-0.5 text-left">
            <span className="font-heading text-sm font-semibold sm:text-base">
              Especificaciones técnicas
            </span>
            <p className="text-xs font-normal text-muted-foreground">
              Tamaño, presupuesto, material y entrega — todos opcionales
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pb-5">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CustomDesignSelectField
              control={control}
              name="preferred_size"
              label="Tamaño aproximado"
              options={SIZE_OPTIONS_LABEL_ONLY}
              placeholder="Selecciona un tamaño"
              optional
            />
            <CustomDesignSelectField
              control={control}
              name="budget_range"
              label="Presupuesto estimado"
              options={BUDGET_OPTIONS}
              optional
            />
            <CustomDesignSelectField
              control={control}
              name="purpose"
              label="¿Para qué usarás el letrero?"
              options={PURPOSE_OPTIONS}
              optional
            />
            <FormField
              control={control}
              name="delivery_address"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    Dirección de entrega
                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                      (opcional)
                    </span>
                  </FormLabel>
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
              control={control}
              name="material"
              label="Material"
              options={MATERIAL_OPTIONS}
              optional
            />
            <CustomDesignSelectField
              control={control}
              name="usage_type"
              label="¿Uso interior o exterior?"
              options={USAGE_OPTIONS}
              optional
            />
          </div>

          <div className="mt-6">
            <CustomDesignSelectField
              control={control}
              name="delivery_time"
              label="Tiempo de entrega estimado (producción + envío)"
              options={DELIVERY_TIME_OPTIONS}
              optional
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
