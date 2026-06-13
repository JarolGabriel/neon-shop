import { COMMUNITY_PATH } from "@/lib/community-routes";

export interface FooterLinkItem {
  label: string;
  href: string;
}

export const CUSTOM_SIGNS_LINKS: FooterLinkItem[] = [
  {
    label: "Diseñador de letreros de neón personalizados",
    href: "/personalizar",
  },
  { label: "Consigue un presupuesto gratuito", href: "/diseno-personalizado" },
  { label: "Pedidos corporativos", href: "/diseno-personalizado" },
  { label: "Preguntas frecuentes sobre signos personalizados", href: "/diseno-personalizado" },
  { label: "Proyectos destacados", href: COMMUNITY_PATH },
];

export const NEON_SIGNS_LINKS: FooterLinkItem[] = [
  { label: "Más vendidos", href: "/productos?sort=best_seller" },
  { label: "Ver catálogo completo", href: "/productos" },
  { label: "Comunidad Neon", href: COMMUNITY_PATH },
  { label: "Quiénes somos", href: "/quienes-somos" },
];

export const FOOTER_LINK_CLASS =
  "text-neutral-400 transition-colors duration-200 hover:text-cyber-yellow!";

export const SOCIAL_ICON_CLASS =
  "size-5 text-neutral-300 transition-colors duration-200 hover:text-cyber-yellow!";
