"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { NAV_ACTION_BTN } from "@/components/layout/navbar-links";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";

export function FavoritesNavButton() {
  const { isAuthenticated } = useAuth();
  const { count } = useFavorites();

  if (!isAuthenticated) return null;

  const badgeLabel = count > 9 ? "9+" : String(count);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Favoritos${count > 0 ? `, ${count} productos` : ""}`}
      className={cn(NAV_ACTION_BTN, "relative text-foreground")}
      asChild
    >
      <Link href="/favoritos">
        <Heart className="size-4" />
        {count > 0 ? (
          <span
            className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-neon-pink text-[10px] font-bold text-primary-foreground dark:bg-cyber-yellow dark:text-black"
            aria-hidden="true"
          >
            {badgeLabel}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
