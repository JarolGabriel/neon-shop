"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md";
}

const sizeClasses = {
  sm: "size-8",
  md: "size-9",
};

const iconClasses = {
  sm: "size-4",
  md: "size-[1.125rem]",
};

export function FavoriteButton({
  productId,
  className,
  size = "md",
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const { isFavorited, toggleFavorite } = useFavorites();
  const [isPending, setIsPending] = useState(false);

  const favorited = isFavorited(productId);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Inicia sesión para guardar favoritos.");
      return;
    }

    setIsPending(true);
    try {
      const next = await toggleFavorite(productId);
      toast.success(
        next ? "Añadido a favoritos" : "Eliminado de favoritos",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar favoritos.",
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={(event) => void handleClick(event)}
      disabled={isPending}
      aria-label={favorited ? "Quitar de favoritos" : "Añadir a favoritos"}
      aria-pressed={favorited}
      className={cn(
        "absolute top-2 right-2 z-30 flex items-center justify-center rounded-full",
        "border border-border/70 bg-background/90 text-foreground shadow-sm backdrop-blur-md",
        "transition-all duration-200 hover:scale-105 hover:bg-neon-surface!",
        "hover:border-neon-pink hover:text-neon-pink! dark:hover:border-cyber-yellow dark:hover:text-cyber-yellow!",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-70",
        sizeClasses[size],
        favorited && "border-neon-pink text-neon-pink dark:border-cyber-yellow dark:text-cyber-yellow",
        className,
      )}
    >
      {isPending ? (
        <Loader2 className={cn(iconClasses[size], "animate-spin")} />
      ) : (
        <Heart
          className={cn(iconClasses[size], favorited && "fill-current")}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
