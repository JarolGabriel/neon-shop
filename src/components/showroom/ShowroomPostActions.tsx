"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import {
  SHOWROOM_REACTIONS,
  getTotalReactions,
} from "@/lib/showroom-utils";
import { cn } from "@/lib/utils";
import type { ShowroomPost, ShowroomReactionType } from "@/types/showroom";

interface ShowroomPostActionsProps {
  post: ShowroomPost;
  onToggleReaction: (
    reviewId: string,
    reactionType: ShowroomReactionType,
  ) => Promise<void>;
  onToggleComments: () => void;
  commentsOpen: boolean;
}

export function ShowroomPostActions({
  post,
  onToggleReaction,
  onToggleComments,
  commentsOpen,
}: ShowroomPostActionsProps) {
  const { isAuthenticated } = useAuth();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingType, setPendingType] = useState<ShowroomReactionType | null>(
    null,
  );

  async function handleReaction(reactionType: ShowroomReactionType) {
    if (!isAuthenticated) {
      toast.error("Inicia sesión para reaccionar.");
      return;
    }

    setPendingType(reactionType);

    try {
      await onToggleReaction(post.id, reactionType);
      setPickerOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo registrar la reacción.",
      );
    } finally {
      setPendingType(null);
    }
  }

  const activeReactions = SHOWROOM_REACTIONS.filter(
    (reaction) => (post.reaction_counts[reaction.type] ?? 0) > 0,
  );

  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4">
      <DropdownMenu open={pickerOpen} onOpenChange={setPickerOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
            )}
          >
            <span className="flex -space-x-1">
              {(activeReactions.length > 0
                ? activeReactions
                : SHOWROOM_REACTIONS.slice(0, 3)
              ).map((reaction) => (
                <span key={reaction.type} className="text-base">
                  {reaction.emoji}
                </span>
              ))}
            </span>
            <span>{getTotalReactions(post)} reacciones</span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          side="top"
          sideOffset={8}
          className="flex w-auto min-w-0 gap-1 border-border bg-card p-2 text-foreground shadow-lg"
        >
          {SHOWROOM_REACTIONS.map((reaction) => {
            const count = post.reaction_counts[reaction.type] ?? 0;
            const isActive = post.user_reactions.includes(reaction.type);

            return (
              <button
                key={reaction.type}
                type="button"
                title={reaction.label}
                disabled={pendingType === reaction.type}
                onClick={() => void handleReaction(reaction.type)}
                className={cn(
                  "flex min-w-12 flex-col items-center rounded-lg px-2 py-1 transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "hover:bg-muted/70",
                )}
              >
                <span className="text-xl">{reaction.emoji}</span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </button>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onToggleComments}
        className={cn(commentsOpen && "bg-muted")}
      >
        <MessageCircle className="size-4" />
        {post.comments_count} comentarios
      </Button>
    </div>
  );
}
