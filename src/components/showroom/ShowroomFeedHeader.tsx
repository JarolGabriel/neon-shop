"use client";

import Link from "next/link";
import { PenSquare, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMMUNITY_LOGIN_REDIRECT } from "@/lib/community-routes";
import { cn } from "@/lib/utils";
import type { ShowroomFeedSort } from "@/types/showroom";

interface ShowroomFeedHeaderProps {
  sort: ShowroomFeedSort;
  onSortChange: (sort: ShowroomFeedSort) => void;
  onSearchOpen: () => void;
  isAuthenticated: boolean;
  onCreateClick: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const TABS: { id: ShowroomFeedSort; label: string }[] = [
  { id: "latest", label: "Recientes" },
  { id: "top", label: "Top" },
];

export function ShowroomFeedHeader({
  sort,
  onSortChange,
  onSearchOpen,
  isAuthenticated,
  onCreateClick,
  onRefresh,
  isRefreshing = false,
}: ShowroomFeedHeaderProps) {
  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={onSearchOpen}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-muted-foreground transition-colors",
          "hover:border-neon-pink/30 dark:hover:border-cyber-yellow/30",
        )}
      >
        <Search className="size-4 shrink-0" />
        Buscar en la comunidad...
      </button>

      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            type="button"
            variant={sort === tab.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onSortChange(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
        {onRefresh ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="ml-auto"
          >
            <RefreshCw
              className={cn("size-4", isRefreshing && "animate-spin")}
            />
            Actualizar
          </Button>
        ) : null}
        <div className={cn("lg:hidden", onRefresh ? "" : "ml-auto")}>
          {isAuthenticated ? (
            <Button type="button" size="sm" onClick={onCreateClick}>
              <PenSquare className="size-4" />
              Crear publicación
            </Button>
          ) : (
            <Link
              href={COMMUNITY_LOGIN_REDIRECT}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Inicia sesión para publicar
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
