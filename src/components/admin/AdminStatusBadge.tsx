import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pendiente_pago: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  pago_confirmado: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  en_taller: "bg-violet-100 text-violet-800 hover:bg-violet-100",
  enviado: "bg-sky-100 text-sky-800 hover:bg-sky-100",
  entregado: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  cancelado: "bg-slate-100 text-slate-600 hover:bg-slate-100",
};

interface AdminStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function AdminStatusBadge({ status, className }: AdminStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("font-medium", STATUS_STYLES[status], className)}
    >
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
