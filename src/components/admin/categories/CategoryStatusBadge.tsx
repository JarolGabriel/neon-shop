import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryStatusBadgeProps {
  isActive: boolean | null;
}

export function CategoryStatusBadge({ isActive }: CategoryStatusBadgeProps) {
  if (isActive) {
    return (
      <Badge
        className={cn(
          "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
        )}
      >
        Activa
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-100"
    >
      Inactiva
    </Badge>
  );
}
