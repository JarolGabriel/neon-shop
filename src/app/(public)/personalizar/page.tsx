import type { Metadata } from "next";
import { NeonTextCustomizer } from "@/components/store/neon-customizer/NeonTextCustomizer";

export const metadata: Metadata = {
  title: "Personaliza tu Letrero | Neon Shop",
  description:
    "Diseña tu letrero de neón LED personalizado. Escribe tu texto y recibe tu cotización por WhatsApp.",
};

export default function PersonalizarPage() {
  return <NeonTextCustomizer />;
}
