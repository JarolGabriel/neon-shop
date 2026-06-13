import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrito | Neon Shop",
  description: "Revisa tu carrito y confirma tu pedido de letreros neón LED.",
  robots: { index: false, follow: false },
};

export default function CarritoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
