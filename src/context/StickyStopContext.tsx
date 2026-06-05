"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface StickyStopValue {
  /** Callback ref que debe adjuntarse al elemento que detiene el sticky. */
  registerStopElement: (element: Element | null) => void;
  /** True cuando el elemento de parada está visible en el viewport. */
  isStopVisible: boolean;
}

const StickyStopContext = createContext<StickyStopValue | null>(null);

export function StickyStopProvider({ children }: { children: ReactNode }) {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.05 });

  return (
    <StickyStopContext.Provider
      value={{ registerStopElement: ref, isStopVisible: isIntersecting }}
    >
      {children}
    </StickyStopContext.Provider>
  );
}

export function useStickyStop(): StickyStopValue | null {
  return useContext(StickyStopContext);
}
