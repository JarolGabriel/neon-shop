import type { Metadata } from "next";
import { OrderConfirmationView } from "@/components/store/order/OrderConfirmationView";

export const metadata: Metadata = {
  title: "Confirmación de pedido | Neon Shop",
  description:
    "Resumen de tu pedido en Neon Shop. Abre WhatsApp para coordinar la entrega con el taller.",
  openGraph: {
    title: "Confirmación de pedido | Neon Shop",
    description:
      "Tu pedido fue registrado. Coordina los detalles finales por WhatsApp.",
    type: "website",
  },
};

export default function MiPedidoPage() {
  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <OrderConfirmationView />
      </div>
    </section>
  );
}
