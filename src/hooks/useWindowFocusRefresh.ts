"use client";

import { useEffect } from "react";

export function useWindowFocusRefresh(
  callback: () => void,
  debounceMs = 500,
): void {
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const handleFocus = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => callback(), debounceMs);
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
      if (timeout) clearTimeout(timeout);
    };
  }, [callback, debounceMs]);
}
