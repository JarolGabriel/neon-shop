import type { Metadata } from "next";
import { CustomShowcaseCompare } from "@/components/store/CustomShowcaseCompare";
import { HowItWorksSection } from "@/components/store/HowItWorksSection";
import { ImageTestimonials } from "@/components/store/ImageTestimonials";
import { NeonTextCustomizer } from "@/components/store/neon-customizer/NeonTextCustomizer";
import { ProductTrustSection } from "@/components/store/ProductTrustSection";
import { RecentlyViewedClient } from "@/components/store/RecentlyViewedClient";

export const metadata: Metadata = {
  title: "Personaliza tu Letrero | Neon Shop",
  description:
    "Diseña tu letrero de neón LED personalizado. Escribe tu texto y recibe tu cotización por WhatsApp.",
};

export default function PersonalizarPage() {
  return (
    <>
      <NeonTextCustomizer />
      <CustomShowcaseCompare />
      <HowItWorksSection />
      <ImageTestimonials />
      <RecentlyViewedClient />
      <ProductTrustSection />
    </>
  );
}
