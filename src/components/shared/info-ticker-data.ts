import {
  Award,
  Clock,
  Heart,
  Plane,
  Truck,
  Undo2,
  type LucideIcon,
} from "lucide-react";

export interface InfoTickerItem {
  icon: LucideIcon;
  label: string;
}

export const INFO_TICKER_ITEMS: InfoTickerItem[] = [
  { icon: Heart, label: "Satisfacción garantizada" },
  { icon: Clock, label: "Tiempo de producción rápido" },
  { icon: Truck, label: "Envío exprés gratuito" },
  { icon: Plane, label: "Envío a toda Venezuela" },
  { icon: Award, label: "Mejor Servicio al Cliente" },
  { icon: Undo2, label: "Devoluciones sin complicaciones" },
];
