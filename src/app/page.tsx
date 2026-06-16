import type { Metadata } from "next";
import { AboutFounder } from "@/components/store/AboutFounder";
import { BestSellerProductsSection } from "@/components/store/BestSellerProductsSection";
import { FeaturedCategoriesSection } from "@/components/store/FeaturedCategoriesSection";
import { FeaturedProductsSection } from "@/components/store/FeaturedProductsSection";
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
import { fetchSiteSettings } from "@/lib/site-settings-server";
import { getSiteMetadata } from "@/lib/site-settings-utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSiteSettings();
  const { fullTitle, siteDescription, ogImageUrl } = getSiteMetadata(settings);

  return {
    title: fullTitle,
    description: siteDescription,
    openGraph: {
      title: fullTitle,
      description: siteDescription,
      type: "website",
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
  };
}

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesCTA />
      <FeaturedCategoriesSection />
      <FeaturedProductsSection />
      <BestSellerProductsSection />
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
