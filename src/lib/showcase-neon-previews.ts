export type ShowcaseLetter = { char: string; color: string };

export interface ShowcaseNeonPreview {
  /** Texto simple o letras con color individual */
  letters: string | ShowcaseLetter[];
  fontFamily: string;
  fontWeight?: number;
  fontSize?: string;
  className?: string;
  /** Color del halo cuando `letters` es un string */
  glowColor?: string;
}

/** Vista previa neón (fondo gris) emparejada con cada imagen gallery-* */
export const SHOWCASE_NEON_PREVIEWS: Record<string, ShowcaseNeonPreview> = {
  charleys: {
    letters: "Charley's",
    fontFamily: "Bebas Neue",
    glowColor: "#ffffff",
    fontSize: "clamp(1.4rem, 5vw, 2.4rem)",
    className: "uppercase tracking-wide",
  },
  patron: {
    letters: "PATRÓN",
    fontFamily: "Bebas Neue",
    glowColor: "#fcee0a",
    fontSize: "clamp(1.6rem, 6vw, 2.8rem)",
    className: "uppercase",
  },
  open: {
    letters: [
      { char: "O", color: "#ff007a" },
      { char: "P", color: "#ff6b00" },
      { char: "E", color: "#00d4ff" },
      { char: "N", color: "#fcee0a" },
    ],
    fontFamily: "Bungee",
    fontSize: "clamp(2rem, 8vw, 3.5rem)",
  },
  mikes: {
    letters: "Mike's",
    fontFamily: "Dancing Script",
    glowColor: "#ff6b00",
    fontSize: "clamp(1.8rem, 7vw, 3rem)",
  },
  "play-game": {
    letters: [
      { char: "△", color: "#00ff87" },
      { char: "○", color: "#ff4444" },
      { char: "✕", color: "#00d4ff" },
      { char: "□", color: "#ff007a" },
    ],
    fontFamily: "Fredoka",
    fontSize: "clamp(2rem, 8vw, 3.2rem)",
    className: "tracking-[0.35em]",
  },
  volcan: {
    letters: "VOLCÁN",
    fontFamily: "Oswald",
    glowColor: "#00ff87",
    fontSize: "clamp(1.3rem, 5vw, 2.2rem)",
    className: "uppercase tracking-widest",
  },
  bacardi: {
    letters: [
      { char: "D", color: "#ff6b00" },
      { char: "O", color: "#ffffff" },
      { char: " ", color: "#ffffff" },
      { char: "W", color: "#00d4ff" },
      { char: "H", color: "#ff007a" },
      { char: "A", color: "#fcee0a" },
      { char: "T", color: "#00ff87" },
    ],
    fontFamily: "Montserrat",
    fontWeight: 400,
    fontSize: "clamp(0.85rem, 3.2vw, 1.35rem)",
    className: "uppercase tracking-wider",
  },
};
