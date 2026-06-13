import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PromotionActiveBadgeProps {
  isActive: boolean | null | undefined;
}

export function PromotionActiveBadge({ isActive }: PromotionActiveBadgeProps) {
  const active = isActive !== false;

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-slate-200 font-normal",
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600",
      )}
    >
      {active ? "Activa" : "Inactiva"}
    </Badge>
  );
}
