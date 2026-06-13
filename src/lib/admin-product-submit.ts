import {
  generateProductSku,
  isVariantRowFilled,
  normalizeAvailableColors,
  normalizeAvailableSizes,
  normalizeVariantForSubmit,
} from "@/lib/product-catalog-options";
import type {
  AdminProductCreateInput,
  AdminProductUpdateInput,
} from "@/lib/schemas/admin-product";

function unifyDescription(values: {
  description?: string;
  short_description?: string;
}): { description: string; short_description: string } {
  const description = values.description?.trim() ?? "";
  const shortDescription = description || (values.short_description?.trim() ?? "");

  return {
    description: description || shortDescription,
    short_description: shortDescription,
  };
}

function normalizeVariants<T extends AdminProductCreateInput | AdminProductUpdateInput>(
  values: T,
  slug: string,
): T["variants"] {
  return values.variants
    .filter(isVariantRowFilled)
    .map((variant) => normalizeVariantForSubmit(variant, slug, values.price));
}

export function prepareProductCreateValues(
  values: AdminProductCreateInput,
): AdminProductCreateInput {
  const slug = values.slug.trim();
  const descriptions = unifyDescription(values);

  return {
    ...values,
    ...descriptions,
    slug,
    sku: values.sku?.trim() || generateProductSku(slug),
    available_sizes: normalizeAvailableSizes(values.available_sizes),
    available_colors: normalizeAvailableColors(values.available_colors),
    variants: normalizeVariants(values, slug),
  };
}

export function prepareProductUpdateValues(
  values: AdminProductUpdateInput,
): AdminProductUpdateInput {
  const slug = values.slug.trim();
  const descriptions = unifyDescription(values);

  return {
    ...values,
    ...descriptions,
    slug,
    sku: values.sku?.trim() || generateProductSku(slug),
    available_sizes: normalizeAvailableSizes(values.available_sizes),
    available_colors: normalizeAvailableColors(values.available_colors),
    variants: normalizeVariants(values, slug),
  };
}
