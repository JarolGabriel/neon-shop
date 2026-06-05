import { AboutFounder } from "@/components/store/AboutFounder";
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

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesCTA />
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
