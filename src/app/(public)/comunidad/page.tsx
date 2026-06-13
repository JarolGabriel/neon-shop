import type { Metadata } from "next";
import { ShowroomPage } from "@/components/showroom/ShowroomPage";

export const metadata: Metadata = {
  title: "Comunidad Neon | Neon Shop",
  description:
    "Clientes comparten cómo quedaron sus letreros instalados. Reacciona, comenta y conecta con la comunidad Neon Shop.",
  openGraph: {
    title: "Comunidad Neon | Neon Shop",
    description:
      "Instalaciones reales, proyectos de clientes y experiencias con letreros de neón LED.",
    type: "website",
  },
};

export default function CommunityPage() {
  return <ShowroomPage />;
}
