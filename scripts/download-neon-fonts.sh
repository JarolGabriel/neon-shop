#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT/public/fonts"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

mkdir -p "$OUT_DIR"

# slug|google_query|weight (empty = normal)
FONTS=(
  "dancing-script|Dancing+Script|"
  "caveat|Caveat|"
  "indie-flower|Indie+Flower|"
  "rouge-script|Rouge+Script|"
  "permanent-marker|Permanent+Marker|"
  "allura|Allura|"
  "rock-salt|Rock+Salt|"
  "parisienne|Parisienne|"
  "shadows-into-light|Shadows+Into+Light|"
  "mr-dafoe|Mr+Dafoe|"
  "euphoria-script|Euphoria+Script|"
  "splash|Splash|"
  "passions-conflict|Passions+Conflict|"
  "corinthia|Corinthia|"
  "qwigley|Qwigley|"
  "rochester|Rochester|"
  "ms-madi|Ms+Madi|"
  "the-nautigal|The+Nautigal|"
  "shizuru|Shizuru|"
  "birthstone|Birthstone|"
  "audiowide|Audiowide|"
  "montserrat|Montserrat:wght@400|400"
  "comic-neue|Comic+Neue|"
  "playfair-display|Playfair+Display|"
  "bebas-neue|Bebas+Neue|"
  "raleway|Raleway|"
  "orbitron|Orbitron|"
  "josefin-sans|Josefin+Sans|"
  "nunito|Nunito|"
  "jost|Jost:wght@200|200"
  "special-elite|Special+Elite|"
  "oswald|Oswald|"
  "berkshire-swash|Berkshire+Swash|"
  "bungee|Bungee|"
  "fredoka|Fredoka|"
  "cinzel|Cinzel|"
  "exo-2|Exo+2|"
  "black-ops-one|Black+Ops+One|"
)

SUCCESS=()
FAILED=()

extract_woff2_url() {
  local css="$1"
  local weight="$2"

  if [[ -n "$weight" ]]; then
    echo "$css" | awk -v w="$weight" '
      /@font-face/ { block = "" }
      { block = block $0 "\n" }
      /}/ {
        if (block ~ "font-weight:[[:space:]]*" w) {
          match(block, /url\(([^)]+)\)/, m)
          if (m[1] != "") {
            gsub(/'\''|"/, "", m[1])
            print m[1]
            exit
          }
        }
        block = ""
      }
    '
  else
    echo "$css" | grep -oE 'https://fonts\.gstatic\.com[^)]+\.woff2' | head -1
  fi
}

for entry in "${FONTS[@]}"; do
  IFS='|' read -r slug query weight <<< "$entry"
  dest="$OUT_DIR/${slug}.woff2"

  css=$(curl -fsSL "https://fonts.googleapis.com/css2?family=${query}&display=swap" -H "User-Agent: $UA") || {
    FAILED+=("$slug (css fetch failed)")
    continue
  }

  url=$(extract_woff2_url "$css" "$weight")

  if [[ -z "$url" ]]; then
    FAILED+=("$slug (no woff2 url)")
    continue
  fi

  if curl -fsSL "$url" -o "$dest"; then
    SUCCESS+=("$slug")
  else
    FAILED+=("$slug (download failed)")
    rm -f "$dest"
  fi
done

echo "=== Downloaded (${#SUCCESS[@]}) ==="
printf '%s\n' "${SUCCESS[@]}"

if ((${#FAILED[@]} > 0)); then
  echo "=== Failed (${#FAILED[@]}) ==="
  printf '%s\n' "${FAILED[@]}"
  exit 1
fi
