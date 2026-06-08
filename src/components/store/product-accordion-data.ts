import { Package, Ruler, ShieldCheck, Wrench } from "lucide-react";
import type { ProductAccordionItem } from "@/components/store/ProductAccordion";

export const PRODUCT_ACCORDION_ITEMS: ProductAccordionItem[] = [
  {
    id: "envio-garantia",
    title: "Envío y Garantía",
    icon: ShieldCheck,
    content:
      "Tu letrero de neón hecho a mano en 2-5 días y luego empaquetado en un embalaje de alta calidad súper resistente. Enviado exprés a todo el país (2-5 días) y totalmente asegurado. Si tu cartel se daña durante el tránsito, lo reemplazaremos inmediatamente, sin preguntas. Todos nuestros productos vienen con una garantía de 2 años.",
  },
  {
    id: "montaje",
    title: "Montaje",
    icon: Wrench,
    content:
      "Hardware de montaje tradicional incluido en cada pedido. Las tiras 3M Command opcionales son una gran opción si no puedes hacer agujeros en tus paredes.",
  },
  {
    id: "caja",
    title: "¿Qué hay en la caja?",
    icon: Package,
    content:
      "¡Tu increíble letrero de neón! Suministro eléctrico, regulador con mando a distancia, hardware de montaje.",
  },
  {
    id: "como-montar",
    title: "Cómo montar tu cartel",
    icon: Ruler,
    content:
      "Hardware de montaje tradicional incluido en cada pedido. Las tiras 3M Command opcionales. Si no puedes hacer agujeros en tus paredes, las tiras 3M Command son una gran opción.",
  },
];
