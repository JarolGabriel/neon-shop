import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductStatusBadgeProps {
  isActive: boolean | null;
  stock: number | null;
  isFeatured?: boolean | null;
  isBestSeller?: boolean | null;
}

export function ProductStatusBadge({
  isActive,
  stock,
  isFeatured,
  isBestSeller,
}: ProductStatusBadgeProps) {
  const stockValue = stock ?? 0;
  const isLowStock = stockValue > 0 && stockValue <= 3;

  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge
        variant="outline"
        className={cn(
          "border-slate-200 text-xs",
          isActive === false
            ? "bg-slate-100 text-slate-600"
            : "bg-emerald-50 text-emerald-700",
        )}
      >
        {isActive === false ? "Inactivo" : "Activo"}
      </Badge>
      {stockValue === 0 ? (
        <Badge
          variant="outline"
          className="border-red-200 bg-red-50 text-xs text-red-700"
        >
          Agotado
        </Badge>
      ) : isLowStock ? (
        <Badge
          variant="outline"
          className="border-amber-200 bg-amber-50 text-xs text-amber-700"
        >
          Stock bajo
        </Badge>
      ) : null}
      {isFeatured === true ? (
        <Badge
          variant="outline"
          className="border-fuchsia-200 bg-fuchsia-50 text-xs text-fuchsia-700"
        >
          Destacado
        </Badge>
      ) : null}
      {isBestSeller === true ? (
        <Badge
          variant="outline"
          className="border-violet-200 bg-violet-50 text-xs text-violet-700"
        >
          Más vendido
        </Badge>
      ) : null}
    </div>
  );
}
