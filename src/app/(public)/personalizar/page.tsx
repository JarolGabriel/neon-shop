import type { Metadata } from "next";
import { CustomShowcaseCompare } from "@/components/store/CustomShowcaseCompare";
import { HowItWorksSection } from "@/components/store/HowItWorksSection";
import { ImageTestimonials } from "@/components/store/ImageTestimonials";
import { NeonTextCustomizer } from "@/components/store/neon-customizer/NeonTextCustomizer";
import { ProductTrustSection } from "@/components/store/ProductTrustSection";
import { getSiteSettings } from "@/lib/api";
import {
  getWhatsappNumberFromSettings,
  isWhatsappConfigured,
} from "@/lib/whatsapp-utils";

export const metadata: Metadata = {
  title: "Personaliza tu Letrero | Neon Shop",
  description:
    "Diseña tu letrero de neón LED personalizado. Escribe tu texto y recibe tu cotización por WhatsApp.",
};

export default async function PersonalizarPage() {
  const settings = await getSiteSettings();
  const whatsappNumber = getWhatsappNumberFromSettings(settings);
  const whatsappConfigured = isWhatsappConfigured(settings);

  return (
    <>
      <NeonTextCustomizer
        whatsappNumber={whatsappNumber}
        whatsappConfigured={whatsappConfigured}
      />
      <CustomShowcaseCompare />
      <HowItWorksSection />
      <ImageTestimonials />
      <ProductTrustSection />
    </>
  );
}
