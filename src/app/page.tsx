import type { Metadata } from "next";
import { AboutFounder } from "@/components/store/AboutFounder";
import { FeaturedCategoriesSection } from "@/components/store/FeaturedCategoriesSection";
import { ImageTestimonials } from "@/components/store/ImageTestimonials";
import { VideoTestimonials } from "@/components/store/VideoTestimonials";
import { CustomShowcase } from "@/components/store/CustomShowcase";
import { FeaturesCTA } from "@/components/store/FeaturesCTA";
import { Hero } from "@/components/store/Hero";
import { ProductGrid } from "@/components/store/ProductGrid";
import { BusinessSolutionsBanner } from "@/components/store/BusinessSolutionsBanner";
import { FAQSection } from "@/components/store/FAQSection";
import { BackToTop } from "@/components/store/BackToTop";
import { StickyStopProvider } from "@/context/StickyStopContext";

export const metadata: Metadata = {
  title: "Neon Shop | Letreros LED y Neón Personalizados",
  description:
    "Tienda de letreros LED y neón en Venezuela. Catálogo listo para enviar, diseño personalizado y envío a todo el país.",
  openGraph: {
    title: "Neon Shop | Letreros LED y Neón Personalizados",
    description:
      "Ilumina tu espacio con carteles de neón LED. Catálogo, diseño a medida y comunidad de clientes.",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesCTA />
      <FeaturedCategoriesSection />
      <CustomShowcase />
      <AboutFounder />
      <VideoTestimonials />
      <ImageTestimonials />
      <StickyStopProvider>
        <ProductGrid />
        <BusinessSolutionsBanner />
      </StickyStopProvider>
      <FAQSection />
      <BackToTop />
    </>
  );
}
