"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NAV_ACTION_BTN } from "@/components/layout/navbar-links";
import { cn } from "@/lib/utils";

const TOGGLE_BTN_CLASS = cn(
  NAV_ACTION_BTN,
  "rounded-full text-foreground transition-colors duration-200",
);

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Cambiar tema"
        className={TOGGLE_BTN_CLASS}
        disabled
      >
        <Sun className="size-4" aria-hidden="true" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={TOGGLE_BTN_CLASS}
    >
      {isDark ? (
        <Sun className="size-4 transition-transform duration-200" aria-hidden="true" />
      ) : (
        <Moon className="size-4 transition-transform duration-200" aria-hidden="true" />
      )}
    </Button>
  );
}
