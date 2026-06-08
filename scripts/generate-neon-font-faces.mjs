#!/usr/bin/env node
/** Genera bloques @font-face para globals.css desde download-neon-fonts.sh */

const FONTS = [
  ["Dancing Script", "dancing-script", "normal"],
  ["Caveat", "caveat", "normal"],
  ["Indie Flower", "indie-flower", "normal"],
  ["Rouge Script", "rouge-script", "normal"],
  ["Permanent Marker", "permanent-marker", "normal"],
  ["Allura", "allura", "normal"],
  ["Rock Salt", "rock-salt", "normal"],
  ["Parisienne", "parisienne", "normal"],
  ["Shadows Into Light", "shadows-into-light", "normal"],
  ["Mr Dafoe", "mr-dafoe", "normal"],
  ["Euphoria Script", "euphoria-script", "normal"],
  ["Splash", "splash", "normal"],
  ["Passions Conflict", "passions-conflict", "normal"],
  ["Corinthia", "corinthia", "normal"],
  ["Qwigley", "qwigley", "normal"],
  ["Rochester", "rochester", "normal"],
  ["Ms Madi", "ms-madi", "normal"],
  ["The Nautigal", "the-nautigal", "normal"],
  ["Shizuru", "shizuru", "normal"],
  ["Birthstone", "birthstone", "normal"],
  ["Audiowide", "audiowide", "normal"],
  ["Montserrat", "montserrat", "400"],
  ["Comic Neue", "comic-neue", "normal"],
  ["Playfair Display", "playfair-display", "normal"],
  ["Bebas Neue", "bebas-neue", "normal"],
  ["Raleway", "raleway", "normal"],
  ["Orbitron", "orbitron", "normal"],
  ["Josefin Sans", "josefin-sans", "normal"],
  ["Nunito", "nunito", "normal"],
  ["Jost", "jost", "200"],
  ["Special Elite", "special-elite", "normal"],
  ["Oswald", "oswald", "normal"],
  ["Berkshire Swash", "berkshire-swash", "normal"],
  ["Bungee", "bungee", "normal"],
  ["Fredoka", "fredoka", "normal"],
  ["Cinzel", "cinzel", "normal"],
  ["Exo 2", "exo-2", "normal"],
  ["Black Ops One", "black-ops-one", "normal"],
];

const blocks = FONTS.map(([family, slug, weight]) => {
  const w = weight === "normal" ? "normal" : weight;
  return `@font-face {
  font-family: "${family}";
  src: url("/fonts/${slug}.woff2") format("woff2");
  font-weight: ${w};
  font-style: normal;
  font-display: swap;
}`;
});

process.stdout.write(`${blocks.join("\n\n")}\n`);
