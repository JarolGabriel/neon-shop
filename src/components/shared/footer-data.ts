export interface FooterLinkItem {
  label: string;
  href: string;
}

export const CUSTOM_SIGNS_LINKS: FooterLinkItem[] = [
  { label: "Diseñador de letreros de neón personalizados", href: "#" },
  { label: "Consigue un presupuesto gratuito", href: "#" },
  { label: "Pedidos corporativos", href: "#" },
  { label: "Preguntas frecuentes sobre signos personalizados", href: "#" },
  { label: "Proyectos destacados", href: "#" },
];

export const NEON_SIGNS_LINKS: FooterLinkItem[] = [
  { label: "Más vendidos", href: "#" },
  { label: "Carteles de comida", href: "#" },
  { label: "Carteles abiertos", href: "#" },
  { label: "Carteles infantiles", href: "#" },
];

export const SUPPORT_LINKS: FooterLinkItem[] = [
  { label: "Política de envío", href: "#" },
  { label: "Política de reembolsos", href: "#" },
  { label: "Contáctanos", href: "#" },
  { label: "Preguntas frecuentes", href: "#" },
];

export const FOOTER_LINK_CLASS =
  "text-neutral-400 transition-colors duration-200 hover:text-cyber-yellow!";

export const SOCIAL_ICON_CLASS =
  "size-5 text-neutral-300 transition-colors duration-200 hover:text-cyber-yellow!";
