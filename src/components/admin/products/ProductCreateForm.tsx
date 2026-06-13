"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { ProductImagesDropzone } from "@/components/admin/products/ProductImagesDropzone";
import { ProductSharedFields } from "@/components/admin/products/ProductSharedFields";
import { ProductVariantsEditor } from "@/components/admin/products/ProductVariantsEditor";
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
import { isVariantRowFilled } from "@/lib/product-catalog-options";
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
  const [variants, setVariants] = useState<AdminProductCreateInput["variants"]>(
    [],
  );

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
      size: "",
      color: "",
      color_hex: "",
      voltage: "",
      material: "",
      sku: "",
      is_active: true,
      is_featured: false,
      images: [],
    },
  });

  useEffect(() => {
    if (!form.getValues("category_id") && categories[0]?.id) {
      form.setValue("category_id", categories[0].id);
    }
  }, [categories, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(
      prepareProductCreateValues({
        ...values,
        variants: variants?.filter(isVariantRowFilled),
      }),
    );
    form.reset();
    slugEditedRef.current = false;
    setVariants([]);
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

        <ProductVariantsEditor
          value={variants ?? []}
          onChange={setVariants}
          disabled={isSaving}
          basePrice={form.watch("price") || 0}
          baseStock={form.watch("stock") ?? 0}
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
