"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FavoritesGrid } from "@/components/store/FavoritesGrid";
import { useAuth } from "@/context/AuthContext";

export function FavoritosPageContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" aria-hidden />
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Mis{" "}
          <span className="text-neon-pink transition-colors duration-200 dark:text-cyber-yellow">
            favoritos
          </span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Productos que guardaste para revisar después.
        </p>
      </div>
      <FavoritesGrid />
    </>
  );
}
