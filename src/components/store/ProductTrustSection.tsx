import { Box } from "lucide-react";
import { PaymentInfoCard } from "@/components/store/PaymentInfoCard";
import { ProductAccordion } from "@/components/store/ProductAccordion";
import { ProductBenefits } from "@/components/store/ProductBenefits";
import { PRODUCT_ACCORDION_ITEMS } from "@/components/store/product-accordion-data";
import { cn } from "@/lib/utils";

interface ProductTrustSectionProps {
  description?: string;
  className?: string;
}

const DEFAULT_DESCRIPTION =
  "Dale un toque cyberpunk a tu espacio con un letrero de neón personalizado hecho a medida. Materiales duraderos y tecnología LED eficiente.";

export function ProductTrustSection({
  description = DEFAULT_DESCRIPTION,
  className,
}: ProductTrustSectionProps) {
  return (
    <section
      className={cn("mx-auto w-full max-w-3xl px-4 py-12 sm:px-6", className)}
      aria-label="Garantías, envío y pago"
    >
      <div className="flex flex-col gap-6">
        <div className="border-y border-border py-6">
          <ProductBenefits />
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Box className="size-3.5" aria-hidden="true" />
          Envío gratis a todo Venezuela
        </div>

        <ProductAccordion items={PRODUCT_ACCORDION_ITEMS} />
        <PaymentInfoCard />
      </div>
    </section>
  );
}
