"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ADMIN_INPUT_CLASS, ADMIN_TEXTAREA_CLASS } from "@/lib/admin-ui";
import {
  adminCustomDesignManageSchema,
  CUSTOM_DESIGN_STATUS_OPTIONS,
  type AdminCustomDesignManageInput,
} from "@/lib/schemas/admin-custom-design";
import type { AdminCustomDesign } from "@/types/admin";

interface CustomDesignManageFormProps {
  design: AdminCustomDesign;
  isSaving: boolean;
  onSave: (
    id: string,
    values: AdminCustomDesignManageInput,
  ) => Promise<AdminCustomDesign>;
}

export function CustomDesignManageForm({
  design,
  isSaving,
  onSave,
}: CustomDesignManageFormProps) {
  const form = useForm<AdminCustomDesignManageInput>({
    resolver: zodResolver(adminCustomDesignManageSchema),
    defaultValues: {
      status: design.status,
      final_price: design.final_price,
      mockup_url: design.mockup_url ?? "",
      admin_notes: design.admin_notes ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      status: design.status,
      final_price: design.final_price,
      mockup_url: design.mockup_url ?? "",
      admin_notes: design.admin_notes ?? "",
    });
  }, [design, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSave(design.id, values);
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border-t border-slate-200 pt-4"
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Estado</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSaving}
              >
                <FormControl>
                  <SelectTrigger className={ADMIN_INPUT_CLASS}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white text-foreground">
                  {CUSTOM_DESIGN_STATUS_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="final_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Precio final (USD)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={field.value ?? ""}
                  onChange={(event) =>
                    field.onChange(
                      event.target.value
                        ? Number(event.target.value)
                        : null,
                    )
                  }
                  className={ADMIN_INPUT_CLASS}
                  disabled={isSaving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mockup_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">URL del mockup</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://..."
                  className={ADMIN_INPUT_CLASS}
                  disabled={isSaving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="admin_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Notas internas</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Notas visibles solo para el equipo..."
                  className={ADMIN_TEXTAREA_CLASS}
                  disabled={isSaving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-vite-purple text-white hover:bg-vite-purple/90"
          disabled={isSaving || form.formState.isSubmitting}
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </Form>
  );
}
