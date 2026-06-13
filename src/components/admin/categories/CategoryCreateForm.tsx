"use client";

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { CategoryImageDropzone } from "@/components/admin/categories/CategoryImageDropzone";
import { CategorySharedFields } from "@/components/admin/categories/CategorySharedFields";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  adminCategoryCreateSchema,
  type AdminCategoryCreateInput,
  type AdminCategoryUpdateInput,
} from "@/lib/schemas/admin-category";

interface CategoryCreateFormProps {
  isSaving: boolean;
  onSubmit: (values: AdminCategoryCreateInput) => Promise<void>;
}

export function CategoryCreateForm({
  isSaving,
  onSubmit,
}: CategoryCreateFormProps) {
  const slugEditedRef = useRef(false);

  const form = useForm<AdminCategoryCreateInput>({
    resolver: zodResolver(adminCategoryCreateSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      display_order: 0,
      is_active: true,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.reset({
      name: "",
      slug: "",
      description: "",
      display_order: 0,
      is_active: true,
    });
    slugEditedRef.current = false;
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CategorySharedFields
          form={
            form as unknown as UseFormReturn<AdminCategoryUpdateInput>
          }
          isSaving={isSaving}
          slugEditedRef={slugEditedRef}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Imagen</FormLabel>
              <FormControl>
                <CategoryImageDropzone
                  value={field.value instanceof File ? field.value : null}
                  onChange={field.onChange}
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
          {isSaving || form.formState.isSubmitting
            ? "Guardando..."
            : "Crear categoría"}
        </Button>
      </form>
    </Form>
  );
}
