"use client";

import { useEffect, useState } from "react";

export type ScrollDirection = "up" | "down";

interface ScrollState {
  direction: ScrollDirection;
  scrollY: number;
}

/**
 * Detecta la dirección del scroll vertical con throttling vía requestAnimationFrame
 * y un único listener pasivo, para evitar conflictos de performance.
 */
export function useScrollDirection(threshold = 8): ScrollState {
  const [state, setState] = useState<ScrollState>({
    direction: "up",
    scrollY: 0,
  });

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;

      if (Math.abs(delta) >= threshold) {
        setState({ direction: delta > 0 ? "down" : "up", scrollY: y });
        lastY = y;
      } else {
        setState((prev) => (prev.scrollY === y ? prev : { ...prev, scrollY: y }));
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return state;
}

/**
 * Devuelve true cuando el Navbar debe ocultarse: el usuario baja y ya superó
 * el offset inicial. Compartido por el Navbar y el StickySidebar para que ambos
 * se coordinen con la misma lógica.
 */
export function useNavbarHidden(offset = 160): boolean {
  const { direction, scrollY } = useScrollDirection();
  return direction === "down" && scrollY > offset;
}
