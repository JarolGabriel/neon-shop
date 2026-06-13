import { getCartItemUnitPrice } from "@/lib/cart-pricing";
import { buildWhatsAppUrl } from "@/lib/whatsapp-utils";
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

export function buildWhatsAppMessage(
  orderId: string,
  values: CheckoutInput,
  items: CartItem[],
  savingsAmount: number,
  total: number,
): string {
  const orderNum = orderId.slice(0, 8).toUpperCase();
  const lines = items.map((item, index) => {
    const price = getCartItemUnitPrice(item);
    const variant = [
      item.product_variants?.size
        ? formatSizeLabel(item.product_variants.size)
        : null,
      item.product_variants?.color,
    ]
      .filter(Boolean)
      .join(" · ");
    const noteLine = item.notes ? `\n   📝 ${item.notes}` : "";
    return `${index + 1}. *${item.products?.name}*${variant ? ` (${variant})` : ""} — Cant: ${item.quantity} — $${(price * item.quantity).toFixed(2)}${noteLine}`;
  });

  const savingsLine =
    savingsAmount > 0
      ? `\n🏷️ *Ahorro multi-letrero:* -$${savingsAmount.toFixed(2)} USD`
      : "";

  return `⚡ *Nuevo pedido Neon Shop*\n🆔 Orden: \`${orderNum}\`\n👤 ${values.customer_name}\n📱 ${values.customer_phone}\n📍 ${values.delivery_city} — ${values.delivery_address}\n\n${lines.join("\n")}${savingsLine}\n\n💰 *TOTAL: $${total.toFixed(2)} USD*`;
}

export function openWhatsAppOrder(number: string, message: string): void {
  window.open(buildWhatsAppUrl(number, message), "_blank");
}
