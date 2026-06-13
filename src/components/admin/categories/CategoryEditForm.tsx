"use client";

import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CategoryImage } from "@/components/shared/CategoryImage";
import { CategorySharedFields } from "@/components/admin/categories/CategorySharedFields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  adminCategoryUpdateSchema,
  type AdminCategoryUpdateInput,
} from "@/lib/schemas/admin-category";
import type { AdminCategory } from "@/types/admin";

interface CategoryEditFormProps {
  category: AdminCategory;
  isSaving: boolean;
  onSubmit: (values: AdminCategoryUpdateInput) => Promise<void>;
}

function getDefaults(category: AdminCategory): AdminCategoryUpdateInput {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    display_order: category.display_order ?? 0,
    is_active: category.is_active ?? true,
  };
}

export function CategoryEditForm({
  category,
  isSaving,
  onSubmit,
}: CategoryEditFormProps) {
  const slugEditedRef = useRef(false);

  const form = useForm<AdminCategoryUpdateInput>({
    resolver: zodResolver(adminCategoryUpdateSchema),
    defaultValues: getDefaults(category),
  });

  useEffect(() => {
    slugEditedRef.current = false;
    form.reset(getDefaults(category));
  }, [category, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CategorySharedFields
          form={form}
          isSaving={isSaving}
          slugEditedRef={slugEditedRef}
        />

        {category.image_url ? (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Imagen actual</p>
            <CategoryImage
              src={category.image_url}
              alt={category.name}
              variant="preview"
            />
            <p className="text-xs text-slate-500">
              La imagen solo se define al crear la categoría.
            </p>
          </div>
        ) : null}

        <Button
          type="submit"
          className="w-full bg-vite-purple text-white hover:bg-vite-purple/90"
          disabled={isSaving || form.formState.isSubmitting}
        >
          {isSaving || form.formState.isSubmitting
            ? "Guardando..."
            : "Guardar cambios"}
        </Button>
      </form>
    </Form>
  );
}
