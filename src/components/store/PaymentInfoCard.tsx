import { Bitcoin, DollarSign, Landmark, Send, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PaymentMethod {
  icon: LucideIcon;
  label: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { icon: Send, label: "Zelle" },
  { icon: DollarSign, label: "Dólares" },
  { icon: Bitcoin, label: "Crypto" },
  { icon: Landmark, label: "BCV" },
  { icon: Smartphone, label: "Pago Móvil" },
];

export function PaymentInfoCard() {
  return (
    <div className="rounded-lg bg-[#f3f4f6] p-6 dark:bg-neon-surface">
      <h3 className="font-heading text-lg font-bold text-neon-pink dark:text-cyber-yellow">
        Pago y Seguridad
      </h3>
      <p className="mt-1 text-sm font-medium text-foreground">Métodos de pago</p>

      <ul className="mt-4 flex flex-wrap gap-2.5">
        {PAYMENT_METHODS.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-1.5 rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-xs font-medium text-foreground"
          >
            <Icon
              className="size-4 text-vite-purple dark:text-cyber-yellow"
              aria-hidden="true"
            />
            {label}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Tu información de pago se procesa de forma segura. Aceptamos pago móvil,
        Zelle, transferencias bancarias o criptomonedas. Escríbenos por WhatsApp
        para más información. No almacenamos datos de tarjetas de crédito.
      </p>
    </div>
  );
}
