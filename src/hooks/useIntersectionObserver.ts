"use client";

import { useCallback, useEffect, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Observa un elemento (vía callback ref) y reporta si está en el viewport.
 * Usa un callback ref para poder compartir el nodo entre componentes distintos.
 */
export function useIntersectionObserver({
  threshold = 0,
  rootMargin = "0px",
}: UseIntersectionObserverOptions = {}) {
  const [node, setNode] = useState<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const ref = useCallback((element: Element | null) => {
    setNode(element);
  }, []);

  useEffect(() => {
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node, threshold, rootMargin]);

  return { ref, isIntersecting };
}
