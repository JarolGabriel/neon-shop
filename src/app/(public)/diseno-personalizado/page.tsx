import type { Metadata } from "next";
import { CustomDesignCarousel } from "@/components/store/custom-design/CustomDesignCarousel";
import { FeatureShowcase } from "@/components/store/custom-design/FeatureShowcase";
import { CustomDesignForm } from "@/components/store/custom-design/CustomDesignForm";
import { CustomDesignIntro } from "@/components/store/custom-design/CustomDesignIntro";
import { CustomDesignQualityBanner } from "@/components/store/custom-design/CustomDesignQualityBanner";
import { CustomDesignSteps } from "@/components/store/custom-design/CustomDesignSteps";
import { BackToTop } from "@/components/store/BackToTop";
import { FAQSection } from "@/components/store/FAQSection";

export const metadata: Metadata = {
  title: "Diseño Personalizado | Neon Shop",
  description:
    "Transforma tu logo, texto o idea en un letrero de neón LED a medida. Servicio de diseño gratuito, asesoría experta y producción profesional en Neon Shop.",
  openGraph: {
    title: "Diseño Personalizado | Neon Shop",
    description:
      "Crea tu cartel de neón LED personalizado. Sube tu imagen o describe tu idea y nuestro equipo de diseño te ayudará a darle vida.",
    type: "website",
  },
};

export default function CustomDesignPage() {
  return (
    <div className="bg-background">
      <header className="mx-auto max-w-5xl px-4 pt-12 text-center sm:px-6 sm:pt-16 lg:pt-20">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          <span className="text-neon-pink transition-colors duration-200 dark:text-cyber-yellow">
            Diseño
          </span>{" "}
          Personalizado
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Convierte tu visión en un letrero de neón LED único con nuestro
          equipo creativo.
        </p>
      </header>

      <CustomDesignCarousel className="mt-10 sm:mt-12" />

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <CustomDesignIntro />
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <CustomDesignForm />
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <CustomDesignSteps />
      </section>

      <CustomDesignQualityBanner className="mt-2" />

      <FeatureShowcase />

      <FAQSection />

      <BackToTop />
    </div>
  );
}
