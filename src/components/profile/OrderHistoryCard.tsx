import { formatUsd } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  type OrderHistoryEntry,
} from "@/types/order";

interface OrderHistoryCardProps {
  order: OrderHistoryEntry;
}

export function OrderHistoryCard({ order }: OrderHistoryCardProps) {
  const orderCode = order.id.slice(0, 8).toUpperCase();
  const date = new Date(order.created_at).toLocaleDateString("es-VE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm font-semibold text-foreground dark:text-cyber-yellow">
            #{orderCode}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{date}</p>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <ul className="mt-4 space-y-2 border-t border-border pt-4">
        {order.order_items.map((item) => (
          <li
            key={item.id}
            className="flex items-start justify-between gap-3 text-sm"
          >
            <div className="min-w-0">
              <p className="font-medium text-foreground">{item.product_name}</p>
              <p className="text-xs text-muted-foreground">
                Cant: {item.quantity}
                {item.notes ? ` · ${item.notes}` : ""}
              </p>
            </div>
            <span className="shrink-0 text-foreground">
              {formatUsd(item.price_usd * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="font-bold text-foreground dark:text-cyber-yellow">
          {formatUsd(order.total_usd)} USD
        </span>
      </div>
    </article>
  );
}
