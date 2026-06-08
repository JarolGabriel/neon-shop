/** Brillo LED: núcleo blanco + halo ajustado al color (sin blur excesivo). */
export function buildNeonShadow(glowColor: string): string {
  if (glowColor.toLowerCase() === "#ffffff") {
    return "0 0 2px #fff, 0 0 6px #fff, 0 0 12px rgba(255,255,255,0.65)";
  }
  return `0 0 2px #fff, 0 0 4px ${glowColor}, 0 0 8px ${glowColor}, 0 0 14px ${glowColor}80`;
}

export function neonTextStyle(glowColor: string): {
  color: string;
  textShadow: string;
} {
  return {
    color: "#ffffff",
    textShadow: buildNeonShadow(glowColor),
  };
}
