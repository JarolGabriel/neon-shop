import { getCartItemUnitPrice } from "@/lib/cart-pricing";
import { parseProductSelectionNotes } from "@/lib/product-catalog-options";
import { DEFAULT_STORE_NAME } from "@/lib/store-branding";
import {
  buildWhatsAppUrl,
  truncateWhatsappMessage,
} from "@/lib/whatsapp-utils";
import { formatSizeLabel } from "@/lib/utils";
import type { CheckoutInput } from "@/lib/schemas/checkout";
import type { CartItem } from "@/types/cart";

export const LAST_ORDER_KEY = "neon_last_order";

export interface LastOrderSnapshot {
  orderId: string;
  whatsappNumber: string;
  whatsappMessage: string;
  customerName: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

export function saveLastOrder(snapshot: LastOrderSnapshot): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(snapshot));
}

export function getLastOrder(): LastOrderSnapshot | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(LAST_ORDER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LastOrderSnapshot;
  } catch {
    return null;
  }
}

export function clearLastOrder(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(LAST_ORDER_KEY);
}

function formatCartItemLine(item: CartItem, index: number): string {
  const price = getCartItemUnitPrice(item);
  const variantParts = [
    item.product_variants?.size
      ? formatSizeLabel(item.product_variants.size)
      : null,
    item.product_variants?.color,
  ].filter(Boolean);

  let variantLabel = variantParts.join(" · ");
  let userNote: string | null = null;

  if (item.notes?.trim()) {
    if (variantLabel) {
      userNote = item.notes.trim();
    } else {
      const parsed = parseProductSelectionNotes(item.notes);
      variantLabel = [parsed.sizeLabel, parsed.colorName]
        .filter(Boolean)
        .join(" · ");
      userNote = parsed.userNote;
    }
  }

  const noteLine = userNote ? `\n   Nota: ${userNote}` : "";

  return `${index + 1}. ${item.products?.name}${variantLabel ? ` (${variantLabel})` : ""} — Cant: ${item.quantity} — $${(price * item.quantity).toFixed(2)}${noteLine}`;
}

export function buildWhatsAppMessage(
  orderId: string,
  values: CheckoutInput,
  items: CartItem[],
  savingsAmount: number,
  total: number,
  storeName: string = DEFAULT_STORE_NAME,
): string {
  const orderNum = orderId.slice(0, 8).toUpperCase();
  const lines = items.map((item, index) => formatCartItemLine(item, index));

  const savingsLine =
    savingsAmount > 0
      ? `\nAhorro multi-letrero: -$${savingsAmount.toFixed(2)} USD`
      : "";

  const message = `Nuevo pedido ${storeName}\nOrden: ${orderNum}\nCliente: ${values.customer_name}\nEmail: ${values.customer_email}\nTelefono: ${values.customer_phone}\nEntrega: ${values.delivery_city} — ${values.delivery_address}\n\n${lines.join("\n")}${savingsLine}\n\nTOTAL: $${total.toFixed(2)} USD`;

  return truncateWhatsappMessage(message);
}

export function openWhatsAppOrder(
  number: string | null | undefined,
  message: string,
): boolean {
  if (!number) return false;

  const url = buildWhatsAppUrl(number, message);
  if (!url) return false;

  window.open(url, "_blank");
  return true;
}
