import type { CSSProperties } from "react";
import { buildNeonShadow } from "@/lib/neon-glow";

export const NEON_COLORS = [
  { id: "blanco", label: "Blanco", color: "#ffffff" },
  { id: "cyan", label: "Azul Neón", color: "#00d4ff" },
  { id: "rosa", label: "Rosa", color: "#ff007a" },
  { id: "amarillo", label: "Amarillo", color: "#fcee0a" },
  { id: "verde", label: "Verde", color: "#00ff87" },
  { id: "purpura", label: "Púrpura", color: "#bd34fe" },
  { id: "naranja", label: "Naranja", color: "#ff6b00" },
] as const;

export const BACKGROUNDS = [
  {
    id: "desing1",
    src: "/images/text-diseno-big/text-diseno-big1.webp",
    label: "Escena 1",
    width: 1000,
    height: 625,
  },
  {
    id: "desing2",
    src: "/images/text-diseno-big/text-diseno-big2.webp",
    label: "Escena 2",
    width: 1000,
    height: 625,
  },
  {
    id: "desing3",
    src: "/images/text-diseno-big/text-diseno-big4.webp",
    label: "Escena 3",
    width: 1000,
    height: 625,
  },
  {
    id: "desing4",
    src: "/images/text-diseno-big/text-diseno-big5.webp",
    label: "Escena 4",
    width: 1000,
    height: 625,
  },
  {
    id: "desing5",
    src: "/images/text-diseno-big/text-diseno-big6.webp",
    label: "Escena 5",
    width: 1000,
    height: 625,
  },
  {
    id: "desing6",
    src: "/images/text-diseno-big/text-diseno-big10.webp",
    label: "Escena 6",
    width: 1000,
    height: 625,
  },
  {
    id: "desing7",
    src: "/images/text-diseno-big/text-diseno-big11.webp",
    label: "Escena 7",
    width: 1000,
    height: 625,
  },
  {
    id: "desing8",
    src: "/images/text-diseno-big/text-diseno-big12.webp",
    label: "Escena 8",
    width: 1000,
    height: 625,
  },
  {
    id: "desing9",
    src: "/images/text-diseno-big/text-diseno-big13.webp",
    label: "Escena 9",
    width: 1000,
    height: 625,
  },
  {
    id: "desing10",
    src: "/images/text-diseno-big/text-diseno-big14.webp",
    label: "Escena 10",
    width: 1000,
    height: 625,
  },
  { id: "dark", src: "", label: "Negro", width: 0, height: 0 },
] as const;

export const SIZE_OPTIONS = [
  { value: "pequeno", label: "Pequeño · hasta 40 cm" },
  { value: "mediano", label: "Mediano · 40–80 cm" },
  { value: "grande", label: "Grande · 80–120 cm" },
  { value: "xl", label: "XL · 120–180 cm" },
  { value: "xxl", label: "XXL · +180 cm" },
] as const;

export const SPECIAL_EFFECTS = [
  {
    id: "single",
    label: "Color único",
    sublabel: "Con dimmer y mando a distancia — gratis",
    icon: "💡",
  },
  {
    id: "dynamic",
    label: "Neón Dinámico",
    sublabel: "Arcoíris animado de izquierda a derecha",
    icon: "✨",
  },
  {
    id: "multicolor",
    label: "Texto Multicolor",
    sublabel: "Toca cada letra para asignarle un color",
    icon: "🎨",
  },
  {
    id: "rgb",
    label: "Cambio RGB",
    sublabel: "La palabra cambia de color cíclicamente",
    icon: "🌈",
  },
] as const;

export type SpecialEffectId = (typeof SPECIAL_EFFECTS)[number]["id"];

export const LETTER_PALETTE = [
  "#fcee0a",
  "#ffffff",
  "#ffdd57",
  "#ffaa00",
  "#ff6b00",
  "#ff007a",
  "#ff69b4",
  "#bd34fe",
  "#7c3aed",
  "#2563eb",
  "#00d4ff",
  "#06b6d4",
  "#00ff87",
  "#22c55e",
  "#ff4444",
] as const;

export const RGB_CYCLE = [
  "#ff007a",
  "#00d4ff",
  "#fcee0a",
  "#00ff87",
  "#bd34fe",
  "#ff6b00",
] as const;



export type NeonColor = (typeof NEON_COLORS)[number];

export function getFontSize(size: string): string {
  return (
    {
      pequeno: "1.8rem",
      mediano: "2.5rem",
      grande: "3.2rem",
      xl: "4rem",
      xxl: "5rem",
    }[size] ?? "2.5rem"
  );
}

export function getSizeLabel(size: string): string {
  return SIZE_OPTIONS.find((opt) => opt.value === size)?.label ?? size;
}

export function getNeonStyle(
  effect: SpecialEffectId,
  baseColor: { color: string },
  rgbColor: string,
): CSSProperties {
  switch (effect) {
    case "dynamic":
      return {};
    case "rgb":
      return {
        color: "#ffffff",
        textShadow: buildNeonShadow(rgbColor),
        transition: "text-shadow 0.4s ease",
      };
    case "multicolor":
      return {};
    case "single":
    default:
      return {
        color: "#ffffff",
        textShadow: buildNeonShadow(baseColor.color),
      };
  }
}
