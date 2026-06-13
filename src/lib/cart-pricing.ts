import type { CartItem } from "@/types/cart";

/** Descuento por volumen alineado con BulkDiscountNotice (2+) + incentivo 3+. */
const BULK_DISCOUNT_RATES: ReadonlyArray<{ minItems: number; rate: number }> = [
  { minItems: 3, rate: 0.15 },
  { minItems: 2, rate: 0.1 },
];

export function getCartItemUnitPrice(item: CartItem): number {
  return item.product_variants?.price ?? item.products?.price ?? 0;
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce(
    (total, item) => total + getCartItemUnitPrice(item) * item.quantity,
    0,
  );
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getBulkDiscountRate(itemCount: number): number {
  const tier = BULK_DISCOUNT_RATES.find(({ minItems }) => itemCount >= minItems);
  return tier?.rate ?? 0;
}

export function getBulkDiscountLabel(itemCount: number): string | null {
  if (itemCount >= 3) return "Pedido multi-letrero (3+ carteles)";
  if (itemCount >= 2) return "Pedido multi-letrero (2 carteles)";
  return null;
}

export function getNextTierHint(itemCount: number): string | null {
  if (itemCount === 1) {
    return "Añade 1 letrero más y obtén 10% de descuento automático.";
  }
  if (itemCount === 2) {
    return "Añade 1 letrero más y sube al 15% de descuento.";
  }
  return null;
}

export interface CartPricing {
  subtotal: number;
  discountRate: number;
  savingsAmount: number;
  total: number;
  discountLabel: string | null;
  nextTierHint: string | null;
}

export function calculateCartPricing(items: CartItem[]): CartPricing {
  const itemCount = getCartItemCount(items);
  const subtotal = getCartSubtotal(items);
  const discountRate = getBulkDiscountRate(itemCount);
  const savingsAmount = subtotal * discountRate;
  const total = subtotal - savingsAmount;

  return {
    subtotal,
    discountRate,
    savingsAmount,
    total,
    discountLabel: getBulkDiscountLabel(itemCount),
    nextTierHint: getNextTierHint(itemCount),
  };
}

export function getCartItemImage(
  item: CartItem,
): { url: string; alt: string } | null {
  const images = item.products?.product_images;
  if (!images?.length) return null;

  const sorted = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return 0;
  });

  const primary = sorted[0];
  if (!primary?.image_url) return null;

  return {
    url: primary.image_url,
    alt: primary.alt_text ?? item.products?.name ?? "Producto",
  };
}
