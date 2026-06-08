import { Lightbulb, ShieldCheck, Trophy, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Benefit {
  icon: LucideIcon;
  label: string;
}

const BENEFITS: Benefit[] = [
  { icon: Lightbulb, label: "En el negocio desde 2024" },
  { icon: Trophy, label: "Materiales de la mejor calidad" },
  { icon: Truck, label: "Envío exprés gratis en Venezuela" },
  { icon: ShieldCheck, label: "Garantía de 2 años" },
];

export function ProductBenefits() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {BENEFITS.map(({ icon: Icon, label }) => (
        <li key={label} className="flex flex-col items-center gap-2 text-center">
          <Icon
            className="size-7 text-vite-purple dark:text-cyber-yellow"
            aria-hidden="true"
          />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
