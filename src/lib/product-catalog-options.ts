import { NEON_COLORS, SIZE_OPTIONS } from "@/lib/neon-customizer-config";
import type { AdminProductVariantInput } from "@/lib/schemas/admin-product";

export { NEON_COLORS };

export const PRODUCT_SIZE_PRESETS = SIZE_OPTIONS;

export const CUSTOM_SIZE_VALUE = "__custom__";

export function normalizeCustomSize(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("custom:")) return trimmed;
  return `custom:${trimmed}`;
}

export function getProductSizeLabel(size: string | null | undefined): string {
  if (!size) return "";
  if (size.startsWith("custom:")) return size.slice("custom:".length);
  return (
    PRODUCT_SIZE_PRESETS.find((preset) => preset.value === size)?.label ?? size
  );
}

function randomSkuSuffix(): string {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

function skuToken(value: string, max = 6): string {
  const token = value.replace(/[^a-z0-9]/gi, "").toUpperCase();
  return token.slice(0, max) || "ITEM";
}

export function generateProductSku(slug: string): string {
  return `NS-${skuToken(slug, 8)}-${randomSkuSuffix()}`;
}

export function generateVariantSku(
  productSlug: string,
  size?: string,
  color?: string,
): string {
  const base = skuToken(productSlug, 6);
  const sizeToken = size
    ? size.startsWith("custom:")
      ? skuToken(size.slice(7), 4)
      : skuToken(size, 3)
    : "STD";
  const colorToken = color ? skuToken(color, 4) : "DEF";
  return `NS-${base}-${sizeToken}-${colorToken}`;
}

export function suggestVariantName(size?: string, color?: string): string {
  const parts = [
    size ? getProductSizeLabel(size) : null,
    color?.trim() || null,
  ].filter(Boolean);
  return parts.join(" · ");
}

export function lookupNeonColorHex(colorName: string | null | undefined): string | null {
  if (!colorName?.trim()) return null;
  const lower = colorName.trim().toLowerCase();
  const found = NEON_COLORS.find(
    (item) =>
      item.label.toLowerCase() === lower || item.id.toLowerCase() === lower,
  );
  return found?.color ?? null;
}

export function encodeStoredProductColor(
  color: string,
  colorHex?: string | null,
): string {
  const name = color.trim();
  if (!name) return "";

  const preset = NEON_COLORS.find(
    (item) => item.label === name || item.id === name.toLowerCase(),
  );
  if (preset) return `${preset.label}|${preset.color}`;

  const hex = colorHex?.trim();
  if (hex && /^#[0-9A-Fa-f]{6}$/.test(hex)) return `${name}|${hex}`;

  const lookup = lookupNeonColorHex(name);
  if (lookup) return `${name}|${lookup}`;

  return name;
}

export function parseStoredProductColor(value: string | null | undefined): {
  color: string;
  colorHex: string | null;
} {
  if (!value?.trim()) return { color: "", colorHex: null };

  const pipeIndex = value.indexOf("|");
  if (pipeIndex > 0) {
    const color = value.slice(0, pipeIndex).trim();
    const hex = value.slice(pipeIndex + 1).trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      return { color, colorHex: hex };
    }
  }

  const color = value.trim();
  return { color, colorHex: lookupNeonColorHex(color) };
}

export function sanitizeColorHex(hex: unknown): string | null {
  if (typeof hex !== "string" || !hex.trim()) return null;
  const normalized = hex.trim();
  return /^#[0-9A-Fa-f]{6}$/.test(normalized) ? normalized : null;
}

export function normalizeVariantForSubmit(
  variant: AdminProductVariantInput,
  productSlug: string,
  basePrice: number,
): AdminProductVariantInput {
  const size = variant.size?.trim() || "";
  const color = variant.color?.trim() || "";
  const colorHex =
    sanitizeColorHex(variant.color_hex) ?? lookupNeonColorHex(color) ?? "";

  return {
    ...variant,
    size,
    color,
    color_hex: colorHex,
    name: variant.name?.trim() || suggestVariantName(size, color),
    sku:
      variant.sku?.trim() ||
      generateVariantSku(productSlug, size || undefined, color || undefined),
    price: variant.price ?? basePrice,
    stock: variant.stock ?? 0,
    is_active: variant.is_active ?? true,
  };
}

export function isVariantRowFilled(variant: AdminProductVariantInput): boolean {
  return Boolean(variant.size?.trim() || variant.color?.trim());
}

export interface VariantColorSelection {
  color: string;
  color_hex: string;
}

function variantCombinationKey(size: string, color: string): string {
  return `${size.trim()}|${color.trim().toLowerCase()}`;
}

export function buildVariantCombinations(
  sizes: string[],
  colors: VariantColorSelection[],
  basePrice: number,
  baseStock: number,
): AdminProductVariantInput[] {
  const variants: AdminProductVariantInput[] = [];

  for (const size of sizes) {
    const normalizedSize = size.trim();
    if (!normalizedSize) continue;

    for (const { color, color_hex } of colors) {
      const normalizedColor = color.trim();
      if (!normalizedColor) continue;

      variants.push({
        name: suggestVariantName(normalizedSize, normalizedColor),
        sku: "",
        size: normalizedSize,
        color: normalizedColor,
        color_hex: color_hex,
        price: basePrice > 0 ? basePrice : undefined,
        stock: baseStock,
        is_active: true,
      });
    }
  }

  return variants;
}

export function mergeVariantCombinations(
  existing: AdminProductVariantInput[],
  generated: AdminProductVariantInput[],
): AdminProductVariantInput[] {
  const map = new Map<string, AdminProductVariantInput>();

  for (const variant of existing) {
    if (!isVariantRowFilled(variant)) continue;
    map.set(
      variantCombinationKey(variant.size ?? "", variant.color ?? ""),
      variant,
    );
  }

  for (const variant of generated) {
    const key = variantCombinationKey(variant.size ?? "", variant.color ?? "");
    if (!map.has(key)) {
      map.set(key, variant);
    }
  }

  return [...map.values()];
}
