import { Badge } from "@/components/ui/badge";
import { getCustomDesignStatusLabel } from "@/lib/admin-custom-design-labels";
import { cn } from "@/lib/utils";
import type { CustomDesignStatus } from "@/types/custom-design";

const STATUS_STYLES: Record<CustomDesignStatus, string> = {
  pendiente: "bg-amber-50 text-amber-800 border-amber-200",
  cotizacion_enviada: "bg-sky-50 text-sky-800 border-sky-200",
  en_produccion: "bg-violet-50 text-violet-800 border-violet-200",
  entregado: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelado: "bg-slate-100 text-slate-600 border-slate-200",
};

interface CustomDesignStatusBadgeProps {
  status: CustomDesignStatus;
}

export function CustomDesignStatusBadge({
  status,
}: CustomDesignStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-normal", STATUS_STYLES[status])}
    >
      {getCustomDesignStatusLabel(status)}
    </Badge>
  );
}
