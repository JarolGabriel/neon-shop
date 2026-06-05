import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "¿Cuánto tiempo tarda en recibir mi cartel de neón?",
    answer:
      "Los carteles de neón suelen tardar entre 2 y 4 días en producirse, y el envío suele tardar entre 3 y 5 días hábiles adicionales si es fuera de Caracas; en Caracas, un solo día. En total, puedes esperar que tu Letrero esté listo en 4-6 días, teniendo en cuenta los fines de semana.",
  },
  {
    question:
      "¿Puedo pedir carteles de neón personalizados para entregas Nacionales?",
    answer:
      "Sí, los carteles de neón LED personalizados pueden enviarse a todo el país. Sin embargo, los carteles de neón de cristal solo se envían a Caracas, La Guaira y estados cercanos como Miranda debido a su fragilidad.",
  },
  {
    question: "¿Qué debo hacer si mi cartel de neón llega roto?",
    answer:
      "Si tu cartel llega dañado, mándanos un correo electrónico o un WhatsApp con fotos del cartel y el embalaje dañados. Enviaremos un cartel de reemplazo inmediatamente.",
  },
  {
    question: "¿Mi cartel viene con garantía?",
    answer:
      "Sí, todos nuestros carteles de neón vienen con una garantía de 2 años. Si hay algún problema, enviaremos piezas de repuesto o un cartel nuevo sin coste alguno.",
  },
  {
    question: "¿Cómo cuelgo mi cartel de neón?",
    answer:
      "Cada cartel viene con agujeros pretaladrados en el respaldo acrílico transparente y el hardware necesario para un montaje fácil. También puedes usar productos no destructivos como las tiras 3M Command.",
  },
];

export function FAQSection() {
  return (
    <section
      className="w-full px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="faq-heading"
          className="mb-10 text-center font-heading text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl"
        >
          Preguntas frecuentes
        </h2>

        <Accordion
          type="single"
          collapsible
          className="rounded-2xl border border-border bg-neon-surface/50 px-4 backdrop-blur-md sm:px-6"
        >
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="border-border"
            >
              <AccordionTrigger className="text-foreground hover:no-underline hover:text-neon-pink! dark:hover:text-cyber-yellow! sm:text-base">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground sm:text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
