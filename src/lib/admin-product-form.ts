import { sanitizeColorHex } from "@/lib/product-catalog-options";
import type {
  AdminProductCreateInput,
  AdminProductUpdateInput,
  AdminProductVariantInput,
} from "@/lib/schemas/admin-product";
import type { UpdateAdminProductPayload } from "@/types/admin";

function mapVariantForApi(variant: AdminProductVariantInput) {
  return {
    id: variant.id,
    name: variant.name?.trim() ?? "",
    sku: variant.sku?.trim() ?? "",
    size: variant.size?.trim() || null,
    color: variant.color?.trim() || null,
    color_hex: sanitizeColorHex(variant.color_hex),
    price: variant.price,
    stock: variant.stock ?? 0,
    is_active: variant.is_active ?? true,
  };
}

export function buildProductCreateFormData(
  values: AdminProductCreateInput,
): FormData {
  const formData = new FormData();
  formData.append("name", values.name.trim());
  formData.append("slug", values.slug.trim());
  formData.append("description", values.description?.trim() ?? "");
  formData.append("short_description", values.short_description?.trim() ?? "");
  formData.append("price", String(values.price));
  if (values.compare_at_price != null) {
    formData.append("compare_at_price", String(values.compare_at_price));
  }
  formData.append("category_id", values.category_id);
  formData.append("stock", String(values.stock));
  formData.append("voltage", values.voltage?.trim() ?? "");
  formData.append("material", values.material?.trim() ?? "");
  formData.append("sku", values.sku?.trim() ?? "");
  formData.append("is_active", values.is_active ? "true" : "false");
  formData.append("is_featured", values.is_featured ? "true" : "false");
  formData.append(
    "available_sizes",
    JSON.stringify(values.available_sizes ?? []),
  );
  formData.append(
    "available_colors",
    JSON.stringify(values.available_colors ?? []),
  );

  values.images.forEach((file) => {
    formData.append("image", file);
  });

  if (values.variants.length > 0) {
    formData.append(
      "variants",
      JSON.stringify(values.variants.map(mapVariantForApi)),
    );
  }

  return formData;
}

export function buildProductUpdatePayload(
  values: AdminProductUpdateInput,
): UpdateAdminProductPayload {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    description: values.description?.trim() || null,
    short_description: values.short_description?.trim() || null,
    price: values.price,
    compare_at_price: values.compare_at_price ?? null,
    category_id: values.category_id,
    stock: values.stock,
    voltage: values.voltage?.trim() || null,
    material: values.material?.trim() || null,
    sku: values.sku?.trim() || null,
    is_active: values.is_active,
    is_featured: values.is_featured,
    is_best_seller: values.is_best_seller,
    available_sizes: values.available_sizes ?? [],
    available_colors: values.available_colors ?? [],
    variants: values.variants.map(mapVariantForApi),
  };
}
