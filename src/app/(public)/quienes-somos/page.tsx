import type { Metadata } from "next";
import { AboutUsMovement } from "@/components/store/AboutUsMovement";
import { AboutUsSpotlight } from "@/components/store/AboutUsSpotlight";
import { AboutUsStory } from "@/components/store/AboutUsStory";
import { BackToTop } from "@/components/store/BackToTop";
import { getDefaultPageMetadata } from "@/lib/metadata-utils";

export async function generateMetadata(): Promise<Metadata> {
  return getDefaultPageMetadata("Quiénes Somos", {
    description:
      "Conoce la historia del taller: tres hermanos que transformaron la idea de letreros de neón personalizados en una tienda moderna y accesible.",
    openGraph: {
      description:
        "La historia de Frank, Jose y Nany y cómo nació la tienda en Venezuela.",
      type: "website",
    },
  });
}

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
