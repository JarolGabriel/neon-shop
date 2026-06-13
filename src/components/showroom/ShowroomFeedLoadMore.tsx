"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShowroomFeedLoadMoreProps {
  hasMore: boolean;
  isLoading: boolean;
  loadedCount: number;
  totalItems: number;
  onLoadMore: () => void;
}

export function ShowroomFeedLoadMore({
  hasMore,
  isLoading,
  loadedCount,
  totalItems,
  onLoadMore,
}: ShowroomFeedLoadMoreProps) {
  if (!hasMore) return null;

  return (
    <div className="flex flex-col items-center gap-2 pt-2">
      <p className="text-xs text-muted-foreground">
        Mostrando {loadedCount} de {totalItems} publicaciones
      </p>
      <Button
        type="button"
        variant="outline"
        className="min-w-40"
        disabled={isLoading}
        onClick={() => void onLoadMore()}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Cargando...
          </>
        ) : (
          "Ver más publicaciones"
        )}
      </Button>
    </div>
  );
}
