export interface HowItWorksStep {
  id: string;
  number: number;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: "disena",
    number: 1,
    title: "Diseña tu propio cartel",
    description:
      "Envíanos tu diseño para recibir un presupuesto de nuestro equipo experto de personalización. O si tu cartel es de texto, nuestra increíble app personalizadora te dará precios al instante y podrás pedir sin esperar.",
    imageSrc: "/images/como-funciona/como-funciona1.webp",
    imageAlt: 'Letrero de neón personalizado "Let\'s stay home tonight"',
  },
  {
    id: "produccion",
    number: 2,
    title: "Producción y pruebas",
    description:
      "Una vez confirmado tu pedido, tu cartel entra en producción. Tu cartel está hecho a mano con esmero por artesanos expertos. Una vez finalizada la producción, tu cartel pasa por rigurosas pruebas antes de ser cuidadosamente empaquetado para su envío.",
    imageSrc: "/images/como-funciona/como-funciona2.webp",
    imageAlt: "Artesano ensamblando un letrero de neón en el taller",
  },
  {
    id: "envio",
    number: 3,
    title: "Envío exprés gratuito",
    description:
      "Recibirás tu nuevo cartel entre 7 y 10 días después de realizar tu pedido gracias a nuestro personal de producción cualificado y a nuestro envío exprés ultra RÁPIDO y GRATUITO a nivel mundial. No hace falta esperar semanas para conseguir un letrero de neón personalizado impresionante.",
    imageSrc: "/images/como-funciona/como-funciona3.webp",
    imageAlt: "Camión de envío exprés con letreros de neón",
  },
  {
    id: "instalacion",
    number: 4,
    title: "Consigue tu nuevo cartel",
    description:
      "Tu cartel llega listo para colgar en la pared. La caja incluye tu nuevo cartel, una fuente de alimentación para iluminar tu cartel, un mando a distancia que te permite encender y apagar el letrero y también controlar el nivel de brillo.\n\n*Y también incluimos un conjunto de herrajes de montaje.",
    imageSrc: "/images/como-funciona/como-funciona4.webp",
    imageAlt: "Letrero de neón instalado en ventana con vista a la ciudad",
  },
];
