import { Info } from "lucide-react";

export function PromotionCatalogHelp() {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
      <Info className="mt-0.5 size-4 shrink-0 text-vite-purple" />
      <div className="space-y-1">
        <p>
          <strong>Visible en tienda:</strong> activa + fechas válidas (si las
          defines) + al menos una imagen.
        </p>
        <p>
          <strong>Home:</strong> usa la primera imagen por orden de visualización.
        </p>
        <p>
          <strong>Orden menor = más prioridad</strong> (igual que categorías).
        </p>
        <p className="text-slate-500">
          No hay eliminación de imágenes sueltas; para quitar una imagen debes
          eliminar la promoción completa.
        </p>
      </div>
    </div>
  );
}
