import { Info } from "lucide-react";

export function ProductCatalogHelp() {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
      <Info className="mt-0.5 size-4 shrink-0 text-vite-purple" />
      <div className="space-y-1">
        <p>
          <strong>Un solo tamaño y color:</strong> elige tamaño y color arriba y
          deja la sección de abajo vacía.
        </p>
        <p>
          <strong>Varios tamaños y colores:</strong> en la sección de abajo marca
          todos los tamaños y colores que ofreces y pulsa &quot;Generar
          combinaciones&quot; (ej. Pequeño + Mediano + Grande × Rosa + Azul = 6
          variantes).
        </p>
        <p>
          El cliente verá botones de tamaño y color en la ficha del producto.
        </p>
      </div>
    </div>
  );
}
