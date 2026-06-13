"use client";

import {
  formatShowroomDate,
  getShowroomAuthorName,
} from "@/lib/showroom-utils";
import { ShowroomAuthorAvatar } from "./ShowroomAuthorAvatar";
import { ShowroomCommentForm } from "./ShowroomCommentForm";
import { useShowroomComments } from "@/hooks/useShowroomComments";

interface ShowroomCommentsSectionProps {
  reviewId: string;
  accessToken?: string | null;
}

export function ShowroomCommentsSection({
  reviewId,
  accessToken,
}: ShowroomCommentsSectionProps) {
  const { comments, isLoading, error, addComment } = useShowroomComments({
    reviewId,
    accessToken,
  });

  return (
    <div className="space-y-4 border-t border-border pt-4">
      <ShowroomCommentForm onSubmit={addComment} />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando comentarios...</p>
      ) : error ? (
        <p className="text-sm text-destructive/90">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sé el primero en comentar esta publicación.
        </p>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-lg bg-muted/50 p-3"
            >
              <div className="flex items-center gap-2">
                <ShowroomAuthorAvatar
                  profile={comment.profiles}
                  size={24}
                  className="size-6"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {getShowroomAuthorName(comment.profiles)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatShowroomDate(comment.created_at)}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-foreground">{comment.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
