"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createShowroomPost,
  getShowroomPosts,
  reactToShowroomPost,
} from "@/lib/api";
import { SHOWROOM_FEED_PAGE_SIZE } from "@/lib/showroom-utils";
import type { ShowroomFeedSort, ShowroomPost, ShowroomReactionType } from "@/types/showroom";

interface UseShowroomFeedOptions {
  accessToken?: string | null;
  sort: ShowroomFeedSort;
}

export function useShowroomFeed({ accessToken, sort }: UseShowroomFeedOptions) {
  const [posts, setPosts] = useState<ShowroomPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (pageNum: number, append: boolean) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const { data, meta } = await getShowroomPosts(accessToken, {
          page: pageNum,
          limit: SHOWROOM_FEED_PAGE_SIZE,
          sort,
        });

        setPosts((current) => (append ? [...current, ...data] : data));
        setPage(pageNum);
        setHasMore(meta.has_more);
        setTotalItems(meta.total_items);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las publicaciones.",
        );
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [accessToken, sort],
  );

  useEffect(() => {
    void fetchPage(1, false);
  }, [fetchPage]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchPage(1, false);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchPage]);

  const removePost = useCallback((id: string) => {
    setPosts((current) => current.filter((post) => post.id !== id));
    setTotalItems((current) => Math.max(0, current - 1));
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isLoading) return;
    await fetchPage(page + 1, true);
  }, [fetchPage, hasMore, isLoading, isLoadingMore, page]);

  const createPost = useCallback(
    async (payload: {
      title: string;
      comment: string;
      rating: number;
      file?: File | null;
    }) => {
      if (!accessToken) {
        throw new Error("Debes iniciar sesión para publicar.");
      }

      const response = await createShowroomPost(accessToken, payload);
      return response.message;
    },
    [accessToken],
  );

  const toggleReaction = useCallback(
    async (reviewId: string, reactionType: ShowroomReactionType) => {
      if (!accessToken) {
        throw new Error("Debes iniciar sesión para reaccionar.");
      }

      const response = await reactToShowroomPost(
        accessToken,
        reviewId,
        reactionType,
      );

      setPosts((current) =>
        current.map((post) => {
          if (post.id !== reviewId) return post;

          const counts = { ...post.reaction_counts };
          const userReactions = [...post.user_reactions];
          const hadReaction = userReactions.includes(reactionType);

          if (response.liked) {
            if (!hadReaction) {
              userReactions.push(reactionType);
              counts[reactionType] = (counts[reactionType] ?? 0) + 1;
            }
          } else if (hadReaction) {
            const index = userReactions.indexOf(reactionType);
            userReactions.splice(index, 1);
            counts[reactionType] = Math.max((counts[reactionType] ?? 1) - 1, 0);
          }

          const total = Object.values(counts).reduce(
            (sum, value) => sum + (value ?? 0),
            0,
          );

          return {
            ...post,
            reaction_counts: counts,
            user_reactions: userReactions,
            likes_count: total,
            user_has_liked: userReactions.includes("like"),
          };
        }),
      );
    },
    [accessToken],
  );

  return {
    posts,
    hasMore,
    totalItems,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    refresh,
    removePost,
    loadMore,
    createPost,
    toggleReaction,
  };
}
