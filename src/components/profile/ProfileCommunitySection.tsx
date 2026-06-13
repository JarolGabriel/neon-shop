"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProfileActivityAccordion } from "@/components/profile/ProfileActivityAccordion";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteShowroomPost, getMyCommunityActivity } from "@/lib/api";
import { formatShowroomDate, SHOWROOM_REACTIONS } from "@/lib/showroom-utils";
import type { CommunityActivityData } from "@/types/showroom";

interface ProfileCommunitySectionProps {
  accessToken: string;
}

function reactionEmoji(type: string): string {
  return SHOWROOM_REACTIONS.find((item) => item.type === type)?.emoji ?? "👍";
}

function truncate(text: string, max = 80): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function ProfileCommunitySection({
  accessToken,
}: ProfileCommunitySectionProps) {
  const [data, setData] = useState<CommunityActivityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadActivity = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMyCommunityActivity(accessToken);
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar tu actividad en la comunidad.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void loadActivity();
  }, [loadActivity]);

  const handleDeletePost = async (postId: string) => {
    setDeletingId(postId);
    try {
      const response = await deleteShowroomPost(accessToken, postId);
      toast.success(response.message);
      setData((current) =>
        current
          ? {
              ...current,
              posts: current.posts.filter((post) => post.id !== postId),
            }
          : current,
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar la publicación.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Cargando actividad en Comunidad...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 space-y-3 rounded-lg border border-destructive/30 p-4 text-sm">
        <p className="text-destructive">{error}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => void loadActivity()}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const hasActivity =
    data.posts.length > 0 ||
    data.reactions.length > 0 ||
    data.comments.length > 0;

  return (
    <section className="mt-10 space-y-4">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Mi actividad en Comunidad
        </p>
        <div className="h-px bg-border" />
      </div>

      {!hasActivity ? (
        <p className="text-sm text-muted-foreground">
          Aún no tienes publicaciones, reacciones ni comentarios en la comunidad.{" "}
          <Link
            href="/comunidad"
            className="text-neon-pink underline dark:text-cyber-yellow"
          >
            Ir a Comunidad
          </Link>
        </p>
      ) : null}

      <ProfileActivityAccordion
        id="posts"
        title="Mis publicaciones"
        count={data.posts.length}
      >
        <ul className="space-y-2">
          {data.posts.map((post) => (
            <li
              key={post.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 text-sm"
            >
              <div className="min-w-0 space-y-1">
                <p className="font-medium text-foreground">{post.title}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="font-normal">
                    {post.is_approved ? "Aprobada" : "Pendiente"}
                  </Badge>
                  <span>{formatShowroomDate(post.created_at)}</span>
                  {post.likes_count != null ? (
                    <span>{post.likes_count} reacciones</span>
                  ) : null}
                </div>
                {post.is_approved ? (
                  <Link
                    href={`/comunidad#showroom-post-${post.id}`}
                    className="text-xs text-neon-pink underline dark:text-cyber-yellow"
                  >
                    Ver en Comunidad
                  </Link>
                ) : (
                  <p className="text-xs text-muted-foreground">En revisión</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-muted-foreground"
                disabled={deletingId === post.id}
                onClick={() => setConfirmDeleteId(post.id)}
                aria-label="Eliminar publicación"
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      </ProfileActivityAccordion>

      <ProfileActivityAccordion
        id="reactions"
        title="Reacciones recientes"
        count={data.reactions.length}
      >
        <ul className="space-y-2">
          {data.reactions.map((reaction, index) => (
            <li
              key={`${reaction.review_id}-${reaction.created_at}-${index}`}
              className="rounded-lg border border-border p-3 text-sm"
            >
              <p className="text-foreground">
                <span className="mr-2">
                  {reactionEmoji(reaction.reaction_type)}
                </span>
                {reaction.review?.title ?? "Publicación"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatShowroomDate(reaction.created_at)}
              </p>
              {reaction.review?.is_approved ? (
                <Link
                  href={`/comunidad#showroom-post-${reaction.review_id}`}
                  className="mt-1 inline-block text-xs text-neon-pink underline dark:text-cyber-yellow"
                >
                  Ver post
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      </ProfileActivityAccordion>

      {data.comments.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Comentarios recientes
          </h3>
          <ul className="space-y-2">
            {data.comments.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-border p-3 text-sm"
              >
                <p className="text-muted-foreground">{truncate(item.comment)}</p>
                <p className="mt-1 text-xs font-medium text-foreground">
                  En: {item.review?.title ?? "Publicación"}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="font-normal">
                    {item.is_approved ? "Aprobado" : "Pendiente"}
                  </Badge>
                  <span>{formatShowroomDate(item.created_at)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <ConfirmDialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteId(null);
        }}
        title="Eliminar publicación"
        description="¿Eliminar esta publicación? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="destructive"
        isLoading={deletingId === confirmDeleteId}
        onConfirm={async () => {
          if (confirmDeleteId) {
            await handleDeletePost(confirmDeleteId);
          }
        }}
      />
    </section>
  );
}
