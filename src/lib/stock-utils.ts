import type { CartItem } from "@/types/cart";

export const LOW_STOCK_THRESHOLD = 3;

export type StockWarningType =
  | "out_of_stock"
  | "low_stock"
  | "exceeds_stock";

export interface StockWarning {
  itemId: string;
  productName: string;
  stock: number;
  quantity: number;
  type: StockWarningType;
}

export function getCartItemStock(item: CartItem): number | null {
  if (item.product_variants) {
    return item.product_variants.stock;
  }
  return null;
}

export function getCartStockWarnings(items: CartItem[]): StockWarning[] {
  const warnings: StockWarning[] = [];

  for (const item of items) {
    const stock = getCartItemStock(item);
    if (stock == null) continue;

    const productName = item.products?.name ?? "Producto";

    if (stock <= 0) {
      warnings.push({
        itemId: item.id,
        productName,
        stock,
        quantity: item.quantity,
        type: "out_of_stock",
      });
      continue;
    }

    if (item.quantity > stock) {
      warnings.push({
        itemId: item.id,
        productName,
        stock,
        quantity: item.quantity,
        type: "exceeds_stock",
      });
      continue;
    }

    if (stock <= LOW_STOCK_THRESHOLD) {
      warnings.push({
        itemId: item.id,
        productName,
        stock,
        quantity: item.quantity,
        type: "low_stock",
      });
    }
  }

  return warnings;
}

export function hasBlockingStockWarnings(warnings: StockWarning[]): boolean {
  return warnings.some(
    (warning) =>
      warning.type === "out_of_stock" || warning.type === "exceeds_stock",
  );
}

export function getStockWarningMessage(warning: StockWarning): string {
  switch (warning.type) {
    case "out_of_stock":
      return `${warning.productName} está agotado. Elimínalo del carrito para continuar.`;
    case "exceeds_stock":
      return `${warning.productName}: solo quedan ${warning.stock} unidades (tienes ${warning.quantity}).`;
    case "low_stock":
      return `${warning.productName}: quedan pocas unidades (${warning.stock}).`;
    default:
      return "";
  }
}
