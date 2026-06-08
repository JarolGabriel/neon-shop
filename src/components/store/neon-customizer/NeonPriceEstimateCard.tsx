import {
  NEON_PRICE_MAX_USD,
  NEON_PRICE_MIN_USD,
  type NeonPriceEstimate,
} from "@/lib/neon-price-estimate";
import { formatUsd } from "@/lib/utils";

interface NeonPriceEstimateCardProps {
  estimate: NeonPriceEstimate | null;
  hasText: boolean;
}

export function NeonPriceEstimateCard({
  estimate,
  hasText,
}: NeonPriceEstimateCardProps) {
  return (
    <div className="rounded-xl border border-border bg-neon-surface/80 p-4 lg:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Estimación orientativa
      </p>

      {estimate ? (
        <>
          <p className="mt-2 font-heading text-3xl font-bold text-neon-pink dark:text-cyber-yellow">
            {formatUsd(estimate.amountUsd)}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Referencia según texto ({estimate.characterCount}{" "}
            {estimate.characterCount === 1 ? "carácter" : "caracteres"}), tamaño,
            uso y efecto. Rango habitual: {formatUsd(NEON_PRICE_MIN_USD)} –{" "}
            {formatUsd(NEON_PRICE_MAX_USD)}.
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          {hasText
            ? "Elige tamaño y uso en los pasos anteriores para calcular una estimación."
            : "Escribe tu texto y completa tamaño y uso para ver una estimación."}
        </p>
      )}

      <p className="mt-3 border-t border-border/60 pt-3 text-xs leading-relaxed text-muted-foreground">
        El precio final se confirma por WhatsApp al revisar tu diseño. Puede
        ser menor o mayor según detalles, materiales o urgencia.
      </p>
    </div>
  );
}
