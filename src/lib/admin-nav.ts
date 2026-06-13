import {
  FolderTree,
  Image,
  LayoutDashboard,
  Package,
  Palette,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";
import { ADMIN_COMMUNITY_PATH } from "@/lib/community-routes";
import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  enabled: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    enabled: true,
  },
  {
    label: "Órdenes",
    href: "/admin/ordenes",
    icon: ShoppingBag,
    enabled: true,
  },
  {
    label: "Comunidad",
    href: ADMIN_COMMUNITY_PATH,
    icon: Users,
    enabled: true,
  },
  {
    label: "Productos",
    href: "/admin/productos",
    icon: Package,
    enabled: true,
  },
  {
    label: "Categorías",
    href: "/admin/categorias",
    icon: FolderTree,
    enabled: true,
  },
  {
    label: "Promociones",
    href: "/admin/promociones",
    icon: Image,
    enabled: true,
  },
  {
    label: "Diseños",
    href: "/admin/disenos",
    icon: Palette,
    enabled: true,
  },
  {
    label: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
    enabled: true,
  },
];
