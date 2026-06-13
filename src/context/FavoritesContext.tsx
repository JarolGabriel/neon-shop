"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getFavorites, toggleFavorite as apiToggleFavorite } from "@/lib/api";
import { runAfterPageReady } from "@/lib/defer-client-request";
import { useAuth } from "@/context/AuthContext";
import type { CatalogProduct } from "@/types/product";

export interface FavoritesContextValue {
  favoriteIds: Set<string>;
  favorites: CatalogProduct[];
  count: number;
  isLoading: boolean;
  isFavorited: (productId: string) => boolean;
  fetchFavorites: () => Promise<void>;
  toggleFavorite: (productId: string) => Promise<boolean>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { accessToken, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!accessToken) {
      setFavorites([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await getFavorites(accessToken);
      setFavorites(data);
    } catch {
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      setFavorites([]);
      return;
    }

    let mounted = true;

    const cancelDeferred = runAfterPageReady(() => {
      void (async () => {
        if (!mounted) return;
        setIsLoading(true);
        try {
          const { data } = await getFavorites(accessToken);
          if (mounted) setFavorites(data);
        } catch {
          if (mounted) setFavorites([]);
        } finally {
          if (mounted) setIsLoading(false);
        }
      })();
    }, 900);

    return () => {
      mounted = false;
      cancelDeferred();
    };
  }, [accessToken, isAuthenticated]);

  const toggleFavorite = useCallback(
    async (productId: string) => {
      if (!accessToken) {
        throw new Error("Inicia sesión para guardar favoritos.");
      }

      const wasFavorited = favorites.some((item) => item.id === productId);
      const previous = favorites;

      setFavorites((current) => {
        if (wasFavorited) {
          return current.filter((item) => item.id !== productId);
        }
        return current;
      });

      try {
        const { favorited } = await apiToggleFavorite(accessToken, productId);
        if (favorited && !wasFavorited) {
          await fetchFavorites();
        }
        return favorited;
      } catch {
        setFavorites(previous);
        throw new Error("No se pudo actualizar favoritos.");
      }
    },
    [accessToken, favorites, fetchFavorites],
  );

  const favoriteIds = useMemo(
    () => new Set(favorites.map((item) => item.id)),
    [favorites],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteIds,
      favorites,
      count: favorites.length,
      isLoading,
      isFavorited: (productId: string) => favoriteIds.has(productId),
      fetchFavorites,
      toggleFavorite,
    }),
    [
      favoriteIds,
      favorites,
      isLoading,
      fetchFavorites,
      toggleFavorite,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites debe usarse dentro de un FavoritesProvider");
  }

  return context;
}
