import type { Metadata } from "next";
import { AboutUsMovement } from "@/components/store/AboutUsMovement";
import { AboutUsSpotlight } from "@/components/store/AboutUsSpotlight";
import { AboutUsStory } from "@/components/store/AboutUsStory";
import { BackToTop } from "@/components/store/BackToTop";

export const metadata: Metadata = {
  title: "Quiénes Somos | Neon Shop",
  description:
    "Conoce la historia de Neon Shop: tres hermanos que transformaron la idea de letreros de neón personalizados en una tienda moderna y accesible.",
  openGraph: {
    title: "Quiénes Somos | Neon Shop",
    description:
      "La historia de Frank, Jose y Nany y cómo nació Neon Shop en Venezuela.",
    type: "website",
  },
};

export default function QuienesSomosPage() {
  return (
    <>
      <AboutUsStory />
      <AboutUsSpotlight />
      <AboutUsMovement />
      <BackToTop />
    </>
  );
}
