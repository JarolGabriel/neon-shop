import { sanitizeColorHex } from "@/lib/product-catalog-options";
import type {
  AdminProductCreateInput,
  AdminProductUpdateInput,
  AdminProductVariantInput,
} from "@/lib/schemas/admin-product";
import type { UpdateAdminProductPayload } from "@/types/admin";

function mapVariantForApi(variant: AdminProductVariantInput) {
  return {
    id: "id" in variant ? variant.id : undefined,
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
  formData.append("size", values.size?.trim() ?? "");
  formData.append("color", values.color?.trim() ?? "");
  formData.append("voltage", values.voltage?.trim() ?? "");
  formData.append("material", values.material?.trim() ?? "");
  formData.append("sku", values.sku?.trim() ?? "");
  formData.append("is_active", values.is_active ? "true" : "false");
  formData.append("is_featured", values.is_featured ? "true" : "false");

  values.images.forEach((file) => {
    formData.append("image", file);
  });

  if (values.variants?.length) {
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
    size: values.size?.trim() || null,
    color: values.color?.trim() || null,
    voltage: values.voltage?.trim() || null,
    material: values.material?.trim() || null,
    sku: values.sku?.trim() || null,
    is_active: values.is_active,
    is_featured: values.is_featured,
    is_best_seller: values.is_best_seller,
    variants: values.variants?.map(mapVariantForApi),
  };
}
