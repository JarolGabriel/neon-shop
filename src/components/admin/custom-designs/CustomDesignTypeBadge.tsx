import { Badge } from "@/components/ui/badge";
import { getDesignTypeLabel } from "@/lib/admin-custom-design-labels";
import type { DesignType } from "@/types/custom-design";

interface CustomDesignTypeBadgeProps {
  type: DesignType;
}

export function CustomDesignTypeBadge({ type }: CustomDesignTypeBadgeProps) {
  return (
    <Badge variant="outline" className="border-slate-200 bg-slate-50 font-normal text-slate-700">
      {getDesignTypeLabel(type)}
    </Badge>
  );
}
