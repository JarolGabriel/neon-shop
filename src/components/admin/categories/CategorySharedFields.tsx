"use client";

import type { RefObject } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { AdminCategoryUpdateInput } from "@/lib/schemas/admin-category";
import { ADMIN_INPUT_CLASS, ADMIN_TEXTAREA_CLASS } from "@/lib/admin-ui";
import { slugifyName } from "@/lib/utils";

interface CategorySharedFieldsProps {
  form: UseFormReturn<AdminCategoryUpdateInput>;
  isSaving: boolean;
  slugEditedRef: RefObject<boolean>;
}

export function CategorySharedFields({
  form,
  isSaving,
  slugEditedRef,
}: CategorySharedFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">Nombre</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Ej. Letreros de neón"
                className={ADMIN_INPUT_CLASS}
                disabled={isSaving}
                onChange={(event) => {
                  field.onChange(event);
                  if (!slugEditedRef.current) {
                    form.setValue("slug", slugifyName(event.target.value), {
                      shouldValidate: true,
                    });
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">Slug</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="letreros-neon"
                className={`${ADMIN_INPUT_CLASS} font-mono text-sm`}
                disabled={isSaving}
                onChange={(event) => {
                  slugEditedRef.current = true;
                  field.onChange(event);
                }}
              />
            </FormControl>
            <FormDescription className="text-slate-500">
              URL: /productos?category={field.value || "slug"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">Descripción</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                rows={3}
                placeholder="Descripción opcional para la tienda..."
                className={ADMIN_TEXTAREA_CLASS}
                disabled={isSaving}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="display_order"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">Orden de visualización</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                min={0}
                className={ADMIN_INPUT_CLASS}
                disabled={isSaving}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            </FormControl>
            <FormDescription className="text-slate-500">
              Menor número = aparece primero en home y menú.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
            <div className="space-y-0.5">
              <FormLabel className="text-slate-700">Categoría activa</FormLabel>
              <FormDescription className="text-slate-500">
                Las inactivas no aparecen en la home ni en el menú.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSaving}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}
