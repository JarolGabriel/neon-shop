import { Info } from "lucide-react";

export function ProductCatalogHelp() {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
      <Info className="mt-0.5 size-4 shrink-0 text-vite-purple" />
      <div className="space-y-1">
        <p>
          <strong>Tamaños y colores del producto</strong> (arriba) es lo normal:
          mismas opciones en la tienda con el mismo precio y stock del producto.
        </p>
        <p>
          <strong>Precio o stock por combinación</strong> (sección opcional abajo)
          solo si Grande cuesta más, Rosa tiene otro stock, etc.
        </p>
        <p>
          Si no abres la sección opcional, no se crean variantes en la base de
          datos.
        </p>
      </div>
    </div>
  );
}
