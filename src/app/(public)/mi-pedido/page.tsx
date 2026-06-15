import type { Metadata } from "next";
import { OrderConfirmationView } from "@/components/store/order/OrderConfirmationView";
import { getDefaultPageMetadata } from "@/lib/metadata-utils";

export async function generateMetadata(): Promise<Metadata> {
  return getDefaultPageMetadata("Confirmación de pedido", {
    description:
      "Resumen de tu pedido. Abre WhatsApp para coordinar la entrega con el taller.",
    openGraph: {
      description:
        "Tu pedido fue registrado. Coordina los detalles finales por WhatsApp.",
      type: "website",
    },
  });
}

export default function MiPedidoPage() {
  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <OrderConfirmationView />
      </div>
    </section>
  );
}
