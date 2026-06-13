"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { filterShowroomPosts } from "@/lib/showroom-utils";
import type { ShowroomPost, ShowroomReactionType } from "@/types/showroom";
import { ShowroomFeedLoadMore } from "./ShowroomFeedLoadMore";
import { ShowroomPostCard } from "./ShowroomPostCard";

interface ShowroomFeedProps {
  posts: ShowroomPost[];
  searchQuery: string;
  highlightedPostId: string | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  totalItems: number;
  error: string | null;
  onLoadMore: () => void;
  onToggleReaction: (
    reviewId: string,
    reactionType: ShowroomReactionType,
  ) => Promise<void>;
  onDeletePost?: (postId: string) => void;
}

export function ShowroomFeed({
  posts,
  searchQuery,
  highlightedPostId,
  isLoading,
  isLoadingMore,
  hasMore,
  totalItems,
  error,
  onLoadMore,
  onToggleReaction,
  onDeletePost,
}: ShowroomFeedProps) {
  const { accessToken, user } = useAuth();

  const visiblePosts = useMemo(
    () => filterShowroomPosts(posts, searchQuery),
    [posts, searchQuery],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-72 animate-pulse rounded-xl border border-border bg-card"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-card p-6 text-center">
        <p className="text-sm text-destructive/90">{error}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Si estás en desarrollo local, verifica que WSL tenga conexión a Supabase.
        </p>
      </div>
    );
  }

  if (visiblePosts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="font-heading text-lg font-bold text-foreground">
          Aún no hay publicaciones
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Sé el primero en compartir tu letrero Neon con la comunidad.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {visiblePosts.map((post) => (
        <ShowroomPostCard
          key={post.id}
          post={post}
          accessToken={accessToken}
          currentUserId={user?.id}
          highlighted={highlightedPostId === post.id}
          onToggleReaction={onToggleReaction}
          onDeletePost={onDeletePost}
        />
      ))}

      {!searchQuery.trim() ? (
        <ShowroomFeedLoadMore
          hasMore={hasMore}
          isLoading={isLoadingMore}
          loadedCount={posts.length}
          totalItems={totalItems}
          onLoadMore={onLoadMore}
        />
      ) : null}
    </div>
  );
}
