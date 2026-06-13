"use client";

import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { ProductAdvancedVariantsSection } from "@/components/admin/products/ProductAdvancedVariantsSection";
import { ProductImagesDropzone } from "@/components/admin/products/ProductImagesDropzone";
import { ProductOptionsSelector } from "@/components/admin/products/ProductOptionsSelector";
import { ProductSharedFields } from "@/components/admin/products/ProductSharedFields";
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
  adminProductCreateSchema,
  type AdminProductCreateInput,
  type AdminProductUpdateInput,
} from "@/lib/schemas/admin-product";
import { prepareProductCreateValues } from "@/lib/admin-product-submit";
import type { AdminCategory } from "@/types/admin";

interface ProductCreateFormProps {
  categories: AdminCategory[];
  isSaving: boolean;
  onSubmit: (values: AdminProductCreateInput) => Promise<void>;
}

export function ProductCreateForm({
  categories,
  isSaving,
  onSubmit,
}: ProductCreateFormProps) {
  const slugEditedRef = useRef(false);

  const form = useForm<AdminProductCreateInput>({
    resolver: zodResolver(adminProductCreateSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      short_description: "",
      price: 0,
      compare_at_price: null,
      category_id: categories[0]?.id ?? "",
      stock: 0,
      voltage: "",
      material: "",
      sku: "",
      is_active: true,
      is_featured: false,
      available_sizes: [],
      available_colors: [],
      variants: [],
      images: [],
    },
  });

  useEffect(() => {
    if (!form.getValues("category_id") && categories[0]?.id) {
      form.setValue("category_id", categories[0].id);
    }
  }, [categories, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(prepareProductCreateValues(values));
    form.reset();
    slugEditedRef.current = false;
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProductSharedFields
          form={form as unknown as UseFormReturn<AdminProductUpdateInput>}
          categories={categories}
          isSaving={isSaving}
          slugEditedRef={slugEditedRef}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Imágenes</FormLabel>
              <FormControl>
                <ProductImagesDropzone
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSaving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ProductOptionsSelector
          availableSizes={form.watch("available_sizes")}
          availableColors={form.watch("available_colors")}
          onSizesChange={(sizes) =>
            form.setValue("available_sizes", sizes, { shouldDirty: true })
          }
          onColorsChange={(colors) =>
            form.setValue("available_colors", colors, { shouldDirty: true })
          }
          disabled={isSaving}
        />

        <ProductAdvancedVariantsSection
          variants={form.watch("variants")}
          onChange={(variants) =>
            form.setValue("variants", variants, { shouldDirty: true })
          }
          basePrice={form.watch("price") || 0}
          baseStock={form.watch("stock") ?? 0}
          hasConfiguredOptions={
            form.watch("available_sizes").length > 0 ||
            form.watch("available_colors").length > 0
          }
          disabled={isSaving}
        />

        <Button
          type="submit"
          className="w-full bg-vite-purple text-white hover:bg-vite-purple/90"
          disabled={isSaving || form.formState.isSubmitting}
        >
          {isSaving ? "Guardando..." : "Crear producto"}
        </Button>
      </form>
    </Form>
  );
}
