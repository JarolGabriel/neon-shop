export interface FeatureShowcaseBlock {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  imageOnLeft: boolean;
}

export const FEATURE_SHOWCASE_BLOCKS: FeatureShowcaseBlock[] = [
  {
    id: "creatividad",
    imageSrc: "/images/logo-diseno/logo-diseno1.webp",
    imageAlt: "Mujer frente a un letrero de neón con alas de ángel",
    title: "Dé rienda suelta a su creatividad con {{store_name}}",
    description:
      "¡Da vida a tus ideas con {{store_name}}! Nos especializamos en la elaboración de letreros de neón LED personalizados que convierten su visión en una obra maestra brillante. Desde diseños intrincados a declaraciones simples y elegantes, nuestro equipo colabora con usted para crear una pieza única que refleje a la perfección su estilo y necesidades.",
    imageOnLeft: true,
  },
  {
    id: "logotipos",
    imageSrc: "/images/logo-diseno/logo-diseno2.webp",
    imageAlt: "Letrero de neón verde personalizado para negocio",
    title: "Brille con logotipos de neón personalizados",
    description:
      "Haga que su negocio sea inolvidable con un logotipo de neón personalizado. Tanto si tiene una acogedora cafetería, un elegante bar, un animado restaurante o una elegante boutique, un vibrante rótulo LED de neón es la forma definitiva de elevar su marca y dejar una impresión duradera. Ilumine su espacio y atraiga clientes con un diseño adaptado a la identidad de su negocio.",
    imageOnLeft: false,
  },
  {
    id: "influencers",
    imageSrc: "/images/logo-diseno/logo-diseno3.webp",
    imageAlt: "Letrero de neón en cafetería con ambiente cálido",
    title:
      "Ilumine su marca: letreros de neón para personas influyentes, jugadores y creadores de contenido",
    description:
      "Transforma tu marca personal en una obra de arte con un letrero de neón LED personalizado. Desde logotipos y hashtags hasta lemas y firmas, convertimos sus ideas en diseños atrevidos y llamativos que llaman la atención y aumentan su presencia. Perfectos para transmisiones en vivo, contenido de redes sociales e incluso eventos en persona, nuestros letreros de neón lo ayudan a destacar y hacer una declaración duradera.",
    imageOnLeft: true,
  },
  {
    id: "exteriores",
    imageSrc: "/images/logo-diseno/logo-diseno4.webp",
    imageAlt: "Letrero de neón exterior para barbería de noche",
    title: "Haga una declaración audaz con letreros de neón para exteriores",
    description:
      "¡Brilla intensamente, llueva o haga sol! Nuestros letreros de neón LED para exteriores duraderos y resistentes a la intemperie son perfectos para escaparates, camiones de comida, festivales y más. Diseñados para resistir los elementos y al mismo tiempo llamar la atención, estos letreros son la solución ideal para cualquier entorno al aire libre.",
    imageOnLeft: false,
  },
];
