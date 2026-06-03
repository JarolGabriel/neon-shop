import { AboutFounder } from "@/components/store/AboutFounder";
import { ImageTestimonials } from "@/components/store/ImageTestimonials";
import { VideoTestimonials } from "@/components/store/VideoTestimonials";
import { CustomShowcase } from "@/components/store/CustomShowcase";
import { FeaturesCTA } from "@/components/store/FeaturesCTA";
import { Hero } from "@/components/store/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesCTA />
      <CustomShowcase />
      <AboutFounder />
      <VideoTestimonials />
      <ImageTestimonials />
    </>
  );
}
