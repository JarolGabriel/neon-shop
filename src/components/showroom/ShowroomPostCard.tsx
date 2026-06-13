"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  extractHashtags,
  formatShowroomDate,
  getCommentBodyForDisplay,
  getShowroomAuthorName,
} from "@/lib/showroom-utils";
import { cn } from "@/lib/utils";
import type { ShowroomPost, ShowroomReactionType } from "@/types/showroom";
import { ShowroomAuthorAvatar } from "./ShowroomAuthorAvatar";
import { ShowroomCommentsSection } from "./ShowroomCommentsSection";
import { ShowroomPostActions } from "./ShowroomPostActions";
import { ShowroomPostOwnerMenu } from "./ShowroomPostOwnerMenu";

interface ShowroomPostCardProps {
  post: ShowroomPost;
  accessToken?: string | null;
  currentUserId?: string | null;
  highlighted?: boolean;
  onToggleReaction: (
    reviewId: string,
    reactionType: ShowroomReactionType,
  ) => Promise<void>;
  onDeletePost?: (postId: string) => void;
}

export function ShowroomPostCard({
  post,
  accessToken,
  currentUserId,
  highlighted = false,
  onToggleReaction,
  onDeletePost,
}: ShowroomPostCardProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const hashtags = extractHashtags(`${post.title} ${post.comment}`);
  const commentBody = getCommentBodyForDisplay(post.comment, hashtags);
  const isOwner =
    Boolean(accessToken && currentUserId && post.profiles?.id === currentUserId);

  return (
    <article
      id={`showroom-post-${post.id}`}
      className={cn(
        "rounded-xl border border-border bg-card transition-shadow",
        highlighted && "ring-2 ring-neon-pink/40 dark:ring-cyber-yellow/40",
      )}
    >
      {post.image_url ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl bg-muted">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
      ) : null}

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <ShowroomAuthorAvatar profile={post.profiles} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              {getShowroomAuthorName(post.profiles)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatShowroomDate(post.created_at)}
            </p>
          </div>
          {isOwner && accessToken && onDeletePost ? (
            <ShowroomPostOwnerMenu
              postId={post.id}
              accessToken={accessToken}
              onDeleted={onDeletePost}
            />
          ) : null}
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-xl font-bold text-foreground">
            {post.title}
          </h2>
          {commentBody ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {commentBody}
            </p>
          ) : null}
        </div>

        {hashtags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <Link
                key={tag}
                href={`/productos?search=${encodeURIComponent(tag.replace("#", ""))}`}
                className="text-xs text-muted-foreground hover:text-neon-pink! dark:hover:text-cyber-yellow!"
              >
                {tag}
              </Link>
            ))}
          </div>
        ) : null}

        <ShowroomPostActions
          post={post}
          onToggleReaction={onToggleReaction}
          onToggleComments={() => setCommentsOpen((open) => !open)}
          commentsOpen={commentsOpen}
        />

        {commentsOpen ? (
          <ShowroomCommentsSection
            reviewId={post.id}
            accessToken={accessToken}
          />
        ) : null}
      </div>
    </article>
  );
}
