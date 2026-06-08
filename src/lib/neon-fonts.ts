export type NeonFont = {
  id: string;
  label: string;
  family: string;
  weight?: number;
  isNew?: boolean;
};

/**
 * Fuentes curadas: cursivas visualmente distintas + bloque inferior de la referencia.
 * Eliminadas las repetitivas (Alexa, Barcelona, Amsterdam, Vintage, etc.).
 */
export const NEON_FONTS = [
  // —— Cursivas distintas ——
  { id: "dancing-script", label: "Chelsea", family: "Dancing Script" },
  { id: "caveat", label: "Freehand", family: "Caveat" },
  { id: "indie-flower", label: "Lazy Sunday", family: "Indie Flower", isNew: true },
  { id: "rouge-script", label: "LoveNote", family: "Rouge Script" },
  {
    id: "permanent-marker",
    label: "Manchester",
    family: "Permanent Marker",
    isNew: true,
  },
  { id: "allura", label: "Neonscript", family: "Allura" },
  { id: "rock-salt", label: "Northshore", family: "Rock Salt" },
  { id: "parisienne", label: "NottingHill", family: "Parisienne", isNew: true },
  {
    id: "shadows-into-light",
    label: "Weekender",
    family: "Shadows Into Light",
    isNew: true,
  },
  { id: "mr-dafoe", label: "WildScript", family: "Mr Dafoe" },
  { id: "euphoria-script", label: "Mayfair", family: "Euphoria Script" },
  { id: "splash", label: "Splash", family: "Splash", isNew: true },
  {
    id: "passions-conflict",
    label: "Passion",
    family: "Passions Conflict",
    isNew: true,
  },
  { id: "corinthia", label: "Corinthia", family: "Corinthia", isNew: true },
  { id: "qwigley", label: "Qwigley", family: "Qwigley", isNew: true },
  { id: "rochester", label: "Rochester", family: "Rochester", isNew: true },
  { id: "ms-madi", label: "Ms Madi", family: "Ms Madi", isNew: true },
  { id: "the-nautigal", label: "Nautigal", family: "The Nautigal", isNew: true },
  { id: "shizuru", label: "Shizuru", family: "Shizuru", isNew: true },
  { id: "birthstone", label: "Birthstone", family: "Birthstone", isNew: true },
  { id: "audiowide", label: "Rocket", family: "Audiowide" },
  // —— Últimas 15 de la referencia + display ——
  { id: "montserrat", label: "Avante", family: "Montserrat", weight: 400 },
  { id: "comic-neue", label: "Buttercup", family: "Comic Neue" },
  {
    id: "playfair-display",
    label: "ClassicType",
    family: "Playfair Display",
  },
  { id: "bebas-neue", label: "LOS ANGELES", family: "Bebas Neue", isNew: true },
  { id: "raleway", label: "Melbourne", family: "Raleway" },
  { id: "orbitron", label: "NeoTokyo", family: "Orbitron" },
  { id: "josefin-sans", label: "MONACO", family: "Josefin Sans" },
  { id: "nunito", label: "SanDiego", family: "Nunito", isNew: true },
  { id: "jost", label: "SIMPLICITY", family: "Jost", weight: 200, isNew: true },
  { id: "special-elite", label: "Typewriter", family: "Special Elite" },
  { id: "oswald", label: "WAIKIKI", family: "Oswald" },
  { id: "berkshire-swash", label: "Bellview", family: "Berkshire Swash" },
  { id: "bungee", label: "LOVENEON", family: "Bungee" },
  { id: "fredoka", label: "Majorca", family: "Fredoka", isNew: true },
  { id: "cinzel", label: "Manhattan", family: "Cinzel", isNew: true },
  { id: "exo-2", label: "MODERNEE", family: "Exo 2" },
  { id: "black-ops-one", label: "MID ART", family: "Black Ops One", isNew: true },
] satisfies readonly NeonFont[];

export type NeonFontOption = NeonFont;

const SANS_FONT_IDS = new Set([
  "montserrat",
  "comic-neue",
  "raleway",
  "orbitron",
  "josefin-sans",
  "nunito",
  "jost",
  "oswald",
  "exo-2",
  "bebas-neue",
  "audiowide",
  "bungee",
  "fredoka",
  "black-ops-one",
  "special-elite",
]);

const SERIF_FONT_IDS = new Set(["playfair-display", "cinzel"]);

function fontFallback(id: string): string {
  if (SANS_FONT_IDS.has(id)) return "sans-serif";
  if (SERIF_FONT_IDS.has(id)) return "serif";
  return "cursive";
}

/** Estilo inline para lienzo y panel — comillas obligatorias en familias con espacio. */
export function neonFontStyle(font: NeonFontOption): {
  fontFamily: string;
  fontWeight?: number;
} {
  const style: { fontFamily: string; fontWeight?: number } = {
    fontFamily: `"${font.family}", ${fontFallback(font.id)}`,
  };
  if (font.weight !== undefined) {
    style.fontWeight = font.weight;
  }
  return style;
}
