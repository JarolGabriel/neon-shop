import type { Metadata } from "next";
import { BackToTop } from "@/components/store/BackToTop";
import { FAQSection } from "@/components/store/FAQSection";
import { FAQAboutSection } from "@/components/store/faq/FAQAboutSection";
import { FAQHeroBanner } from "@/components/store/faq/FAQHeroBanner";
import { getSiteSettings } from "@/lib/api";
import {
  getSupportEmail,
  getWhatsappContact,
} from "@/lib/site-settings-utils";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | Neon Shop",
  description:
    "Ayuda, atención al cliente y respuestas sobre envíos, garantía y carteles de neón LED en Neon Shop.",
  openGraph: {
    title: "Preguntas frecuentes | Neon Shop",
    description:
      "¿Dudas sobre tu cartel de neón? Encuentra respuestas o contáctanos por WhatsApp.",
    type: "website",
  },
};

export default async function PreguntasFrecuentesPage() {
  const settings = await getSiteSettings();
  const phone = getWhatsappContact(settings);
  const supportEmail = getSupportEmail(settings);

  return (
    <>
      <FAQHeroBanner phone={phone} />
      <FAQAboutSection
        supportEmail={supportEmail}
        whatsappHref={phone?.href ?? null}
      />
      <FAQSection />
      <BackToTop />
    </>
  );
}
