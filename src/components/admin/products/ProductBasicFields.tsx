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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ADMIN_INPUT_CLASS } from "@/lib/admin-ui";
import type { AdminProductUpdateInput } from "@/lib/schemas/admin-product";
import { slugifyName } from "@/lib/utils";
import type { AdminCategory } from "@/types/admin";

interface ProductBasicFieldsProps {
  form: UseFormReturn<AdminProductUpdateInput>;
  categories: AdminCategory[];
  isSaving: boolean;
  slugEditedRef: RefObject<boolean>;
}

export function ProductBasicFields({
  form,
  categories,
  isSaving,
  slugEditedRef,
}: ProductBasicFieldsProps) {
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
                className={`${ADMIN_INPUT_CLASS} font-mono text-sm`}
                disabled={isSaving}
                onChange={(event) => {
                  slugEditedRef.current = true;
                  field.onChange(event);
                }}
              />
            </FormControl>
            <FormDescription className="text-slate-500">
              URL: /productos/{field.value || "slug"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">Categoría</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={isSaving}
            >
              <FormControl>
                <SelectTrigger className={ADMIN_INPUT_CLASS}>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white text-slate-900">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
