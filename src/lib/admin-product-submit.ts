import {
  encodeStoredProductColor,
  generateProductSku,
  isVariantRowFilled,
  normalizeVariantForSubmit,
  parseStoredProductColor,
} from "@/lib/product-catalog-options";
import type {
  AdminProductCreateInput,
  AdminProductUpdateInput,
} from "@/lib/schemas/admin-product";

export function prepareProductCreateValues(
  values: AdminProductCreateInput,
): AdminProductCreateInput {
  const slug = values.slug.trim();
  const parsedColor = parseStoredProductColor(values.color);

  return {
    ...values,
    slug,
    sku: values.sku?.trim() || generateProductSku(slug),
    color: encodeStoredProductColor(
      parsedColor.color || values.color?.trim() || "",
      values.color_hex || parsedColor.colorHex,
    ),
    variants: (values.variants ?? [])
      .filter(isVariantRowFilled)
      .map((variant) => normalizeVariantForSubmit(variant, slug, values.price)),
  };
}

export function prepareProductUpdateValues(
  values: AdminProductUpdateInput,
): AdminProductUpdateInput {
  const slug = values.slug.trim();
  const parsedColor = parseStoredProductColor(values.color);

  return {
    ...values,
    slug,
    sku: values.sku?.trim() || generateProductSku(slug),
    color: encodeStoredProductColor(
      parsedColor.color || values.color?.trim() || "",
      values.color_hex || parsedColor.colorHex,
    ),
    variants: (values.variants ?? [])
      .filter(isVariantRowFilled)
      .map((variant) => normalizeVariantForSubmit(variant, slug, values.price)),
  };
}
