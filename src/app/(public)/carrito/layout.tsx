import type { Metadata } from "next";
import { getDefaultPageMetadata } from "@/lib/metadata-utils";

export async function generateMetadata(): Promise<Metadata> {
  return getDefaultPageMetadata("Carrito", {
    description: "Revisa tu carrito y confirma tu pedido de letreros neón LED.",
    robots: { index: false, follow: false },
  });
}

export default function CarritoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
