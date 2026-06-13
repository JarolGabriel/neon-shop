export interface NavItem {
  label: string;
  href: string;
}

export const STORE_NAV_ITEMS: NavItem[] = [
  { label: "Anime", href: "/productos?category=anime" },
  { label: "Cumpleaños", href: "/productos?category=cumpleanos" },
  { label: "Bodas", href: "/productos?category=bodas" },
  { label: "Negocios", href: "/productos?category=negocios" },
  { label: "Favoritos", href: "/favoritos" },
  { label: "Ver Todo", href: "/productos" },
];

export const CUSTOM_NAV_ITEMS: NavItem[] = [
  { label: "Subir logo/gráfico", href: "/diseno-personalizado" },
  {
    label: "Diseña tu letrero de neón",
    href: "/personalizar",
  },
];

/** Enlaces del dropdown de navegación (Tienda y Carteles) */
export const NAV_MENU_LINK_CLASS =
  "block select-none space-y-1 rounded-md p-2 text-xs leading-none no-underline outline-none transition-colors text-foreground hover:text-neon-pink! dark:hover:text-cyber-yellow!";

/** Pill flotante del navbar — fondo translúcido con blur (glass) */
export const NAVBAR_PILL_CLASS =
  "flex h-14 w-full items-center justify-between gap-3 rounded-full border border-border/50 bg-neon-surface/50 px-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150 dark:bg-neon-surface/45 dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] sm:gap-4 sm:px-5 lg:px-6";

/** Botones/íconos de acción — override del ghost de shadcn */
export const NAV_ACTION_BTN =
  "rounded-full text-muted-foreground hover:!bg-transparent hover:!text-neon-pink dark:hover:!text-cyber-yellow";

/** Trigger de dropdown */
export const NAV_TRIGGER_CLASS =
  "h-9 rounded-full bg-transparent px-3 text-sm font-medium text-foreground/90 transition-colors duration-200 ease-in-out hover:bg-transparent hover:text-neon-pink data-open:text-neon-pink dark:hover:text-cyber-yellow dark:data-open:text-cyber-yellow";
