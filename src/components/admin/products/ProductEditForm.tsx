"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProductAdvancedVariantsSection } from "@/components/admin/products/ProductAdvancedVariantsSection";
import { ProductImagesManager } from "@/components/admin/products/ProductImagesManager";
import { ProductOptionsSelector } from "@/components/admin/products/ProductOptionsSelector";
import { ProductSharedFields } from "@/components/admin/products/ProductSharedFields";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { prepareProductUpdateValues } from "@/lib/admin-product-submit";
import {
  adminProductUpdateSchema,
  type AdminProductUpdateInput,
} from "@/lib/schemas/admin-product";
import {
  lookupNeonColorHex,
  parseAvailableColorsFromDb,
  productHasConfiguredOptions,
} from "@/lib/product-catalog-options";
import type { AdminCategory, AdminProduct, AdminProductImage } from "@/types/admin";

interface ProductEditFormProps {
  product: AdminProduct;
  categories: AdminCategory[];
  isSaving: boolean;
  onSubmit: (values: AdminProductUpdateInput) => Promise<void>;
  onUploadImage: (file: File, isPrimary: boolean) => Promise<AdminProduct>;
  onDeleteImage: (imageId: string) => Promise<AdminProduct>;
  onSetPrimaryImage: (image: AdminProductImage) => Promise<AdminProduct>;
}

function getInitialOptions(product: AdminProduct) {
  return {
    available_sizes: product.available_sizes ?? [],
    available_colors: parseAvailableColorsFromDb(product.available_colors),
  };
}

function mapProductVariants(product: AdminProduct) {
  return product.product_variants.map((variant) => ({
    id: variant.id,
    name: variant.name ?? "",
    sku: variant.sku ?? "",
    size: variant.size ?? "",
    color: variant.color ?? "",
    color_hex:
      variant.color_hex ?? lookupNeonColorHex(variant.color ?? "") ?? "",
    price: variant.price,
    stock: variant.stock ?? 0,
    is_active: variant.is_active !== false,
  }));
}

export function ProductEditForm({
  product,
  categories,
  isSaving,
  onSubmit,
  onUploadImage,
  onDeleteImage,
  onSetPrimaryImage,
}: ProductEditFormProps) {
  const slugEditedRef = useRef(true);
  const [images, setImages] = useState(product.product_images);
  const initialOptions = getInitialOptions(product);
  const initialVariants = mapProductVariants(product);

  const form = useForm<AdminProductUpdateInput>({
    resolver: zodResolver(adminProductUpdateSchema),
    values: {
      name: product.name,
      slug: product.slug,
      description: product.short_description ?? product.description ?? "",
      short_description: product.short_description ?? product.description ?? "",
      price: product.price,
      compare_at_price: product.compare_at_price,
      category_id: product.category_id ?? categories[0]?.id ?? "",
      stock: product.stock ?? 0,
      voltage: product.voltage ?? "",
      material: product.material ?? "",
      sku: product.sku ?? "",
      is_active: product.is_active !== false,
      is_featured: product.is_featured === true,
      is_best_seller: product.is_best_seller === true,
      available_sizes: initialOptions.available_sizes,
      available_colors: initialOptions.available_colors,
      variants: initialVariants,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(prepareProductUpdateValues(values));
  });

  const syncImages = async (action: () => Promise<AdminProduct>) => {
    const updated = await action();
    setImages(updated.product_images);
  };

  const availableSizes = form.watch("available_sizes");
  const availableColors = form.watch("available_colors");

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProductSharedFields
          form={form}
          categories={categories}
          isSaving={isSaving}
          slugEditedRef={slugEditedRef}
          showBestSeller
        />

        <ProductImagesManager
          images={images}
          isSaving={isSaving}
          onUpload={(file, isPrimary) =>
            syncImages(() => onUploadImage(file, isPrimary))
          }
          onDelete={(imageId) => syncImages(() => onDeleteImage(imageId))}
          onSetPrimary={(image) => syncImages(() => onSetPrimaryImage(image))}
        />

        <ProductOptionsSelector
          availableSizes={availableSizes}
          availableColors={availableColors}
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
          hasConfiguredOptions={productHasConfiguredOptions({
            available_sizes: availableSizes,
            available_colors: availableColors,
          })}
          disabled={isSaving}
          defaultOpen={initialVariants.length > 0}
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
