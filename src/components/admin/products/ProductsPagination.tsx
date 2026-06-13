import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminProductsMeta } from "@/types/admin";

interface ProductsPaginationProps {
  meta: AdminProductsMeta;
  onPageChange: (page: number) => void;
}

export function ProductsPagination({
  meta,
  onPageChange,
}: ProductsPaginationProps) {
  if (meta.total_pages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 sm:flex-row">
      <p className="text-sm text-slate-600">
        Página {meta.page} de {meta.total_pages} — {meta.total_items} productos
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
          className="border-slate-200 bg-white"
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={meta.page >= meta.total_pages}
          onClick={() => onPageChange(meta.page + 1)}
          className="border-slate-200 bg-white"
        >
          Siguiente
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
