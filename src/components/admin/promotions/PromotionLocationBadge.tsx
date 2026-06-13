import { Badge } from "@/components/ui/badge";
import { PROMOTION_DISPLAY_LOCATIONS } from "@/lib/schemas/admin-promotion";

interface PromotionLocationBadgeProps {
  location: string | null | undefined;
}

export function PromotionLocationBadge({
  location,
}: PromotionLocationBadgeProps) {
  const label =
    PROMOTION_DISPLAY_LOCATIONS.find((item) => item.value === location)
      ?.label ?? location ?? "Sin ubicación";

  return (
    <Badge variant="outline" className="border-slate-200 bg-slate-50 font-normal text-slate-700">
      {label}
    </Badge>
  );
}
