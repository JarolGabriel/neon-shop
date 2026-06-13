"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useShowroomFeed } from "@/hooks/useShowroomFeed";
import { useWindowFocusRefresh } from "@/hooks/useWindowFocusRefresh";
import type { ShowroomFeedSort } from "@/types/showroom";
import { ShowroomFeed } from "./ShowroomFeed";
import { ShowroomFeedHeader } from "./ShowroomFeedHeader";
import { ShowroomFullPostDialog } from "./ShowroomFullPostDialog";
import { ShowroomNav } from "./ShowroomNav";
import { ShowroomQuickComposer } from "./ShowroomQuickComposer";
import { ShowroomSearchOverlay } from "./ShowroomSearchOverlay";
import { ShowroomFeaturedCategories } from "./ShowroomFeaturedCategories";
import { ShowroomMobilePromos } from "./ShowroomMobilePromos";
import { ShowroomSidebar } from "./ShowroomSidebar";

export function ShowroomPage() {
  const { accessToken, isAuthenticated } = useAuth();
  const [sort, setSort] = useState<ShowroomFeedSort>("latest");
  const {
    posts,
    hasMore,
    totalItems,
    isLoading,
    isLoadingMore,
    error,
    loadMore,
    createPost,
    toggleReaction,
    refresh,
    removePost,
    isRefreshing,
  } = useShowroomFeed({ accessToken, sort });

  const handleRefresh = useCallback(() => {
    void refresh();
  }, [refresh]);

  useWindowFocusRefresh(handleRefresh);
  const [searchOpen, setSearchOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!highlightedPostId) return;

    const element = document.getElementById(`showroom-post-${highlightedPostId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });

    const timer = window.setTimeout(() => setHighlightedPostId(null), 2400);
    return () => window.clearTimeout(timer);
  }, [highlightedPostId]);

  return (
    <>
      <ShowroomSearchOverlay
        isOpen={searchOpen}
        posts={posts}
        onClose={() => setSearchOpen(false)}
        onSelectPost={setHighlightedPostId}
      />

      <ShowroomFullPostDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        onSubmit={createPost}
      />

      <section className="bg-background pb-8 pt-4 sm:pb-10 sm:pt-5">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_300px]">
          <ShowroomNav
            onCreateClick={() => setEditorOpen(true)}
            isAuthenticated={isAuthenticated}
          />

          <div className="min-w-0 space-y-4">
            <header className="space-y-2">
              <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Comunidad Neon
              </h1>
              <p className="text-sm text-muted-foreground">
                Clientes comparten cómo quedaron sus letreros instalados.
              </p>
            </header>

            <ShowroomFeedHeader
              sort={sort}
              onSortChange={setSort}
              onSearchOpen={() => setSearchOpen(true)}
              isAuthenticated={isAuthenticated}
              onCreateClick={() => setEditorOpen(true)}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />

            <ShowroomMobilePromos />

            <ShowroomFeaturedCategories />

            <div className="hidden lg:block">
              <ShowroomQuickComposer
                onOpenFullEditor={() => setEditorOpen(true)}
                onSubmit={createPost}
              />
            </div>

            <ShowroomFeed
              posts={posts}
              searchQuery=""
              highlightedPostId={highlightedPostId}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              totalItems={totalItems}
              error={error}
              onLoadMore={loadMore}
              onToggleReaction={toggleReaction}
              onDeletePost={removePost}
            />
          </div>

          <ShowroomSidebar />
        </div>
      </section>
    </>
  );
}
