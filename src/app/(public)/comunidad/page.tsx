import type { Metadata } from "next";
import { ShowroomPage } from "@/components/showroom/ShowroomPage";
import { getDefaultPageMetadata } from "@/lib/metadata-utils";

export async function generateMetadata(): Promise<Metadata> {
  return getDefaultPageMetadata("Comunidad Neon", {
    description:
      "Clientes comparten cómo quedaron sus letreros instalados. Reacciona, comenta y conecta con la comunidad.",
    openGraph: {
      description:
        "Instalaciones reales, proyectos de clientes y experiencias con letreros de neón LED.",
      type: "website",
    },
  });
}

export default function CommunityPage() {
  return <ShowroomPage />;
}
