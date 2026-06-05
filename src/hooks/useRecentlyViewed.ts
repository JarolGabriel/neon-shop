"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "recently_viewed";
const MAX_HISTORY = 12;
const MAX_DISPLAY = 8;

function readHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((s): s is string => typeof s === "string")
      : [];
  } catch {
    return [];
  }
}

/**
 * Registra el producto visitado en el historial (localStorage) y devuelve
 * los slugs de los productos vistos anteriormente (excluyendo el actual).
 */
export function useRecentlyViewed(currentSlug?: string) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const history = readHistory();

    // Lista a mostrar: historial previo sin el producto actual.
    setSlugs(history.filter((slug) => slug !== currentSlug).slice(0, MAX_DISPLAY));
    setReady(true);

    // Registrar la visita actual al frente del historial.
    if (currentSlug) {
      const updated = [
        currentSlug,
        ...history.filter((slug) => slug !== currentSlug),
      ].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Almacenamiento no disponible (modo privado, etc.): se ignora.
      }
    }
  }, [currentSlug]);

  return { slugs, ready };
}
