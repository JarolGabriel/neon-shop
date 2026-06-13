"use client";

import { Sparkles } from "lucide-react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminTableSkeleton } from "@/components/admin/AdminTableSkeleton";
import { ModerationCommentRow } from "@/components/admin/moderation/ModerationCommentRow";
import { ModerationReviewCard } from "@/components/admin/moderation/ModerationReviewCard";
import { PublishedCommentRow } from "@/components/admin/moderation/PublishedCommentRow";
import { PublishedReviewCard } from "@/components/admin/moderation/PublishedReviewCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AdminModerationData } from "@/types/admin";

interface ModerationTabsProps {
  pending: AdminModerationData;
  published: AdminModerationData;
  isLoading: boolean;
  onModerate: (
    targetType: "review" | "comment",
    targetId: string,
    action: "approve" | "reject",
  ) => Promise<void>;
  onDeletePublished: (
    targetType: "review" | "comment",
    targetId: string,
  ) => Promise<void>;
}

export function ModerationTabs({
  pending,
  published,
  isLoading,
  onModerate,
  onDeletePublished,
}: ModerationTabsProps) {
  if (isLoading) {
    return <AdminTableSkeleton rows={4} columns={1} />;
  }

  const publishedCount = published.reviews.length + published.comments.length;

  return (
    <Tabs defaultValue="reviews" className="space-y-4">
      <TabsList className="flex h-auto flex-wrap bg-white">
        <TabsTrigger value="reviews">
          Posts pendientes ({pending.reviews.length})
        </TabsTrigger>
        <TabsTrigger value="comments">
          Comentarios pendientes ({pending.comments.length})
        </TabsTrigger>
        <TabsTrigger value="published">
          Publicadas ({publishedCount})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="reviews" className="space-y-4">
        {pending.reviews.length === 0 ? (
          <AdminEmptyState
            icon={Sparkles}
            title="No hay publicaciones pendientes"
            description="Cuando un cliente publique en la comunidad, aparecerá aquí."
          />
        ) : (
          pending.reviews.map((review) => (
            <ModerationReviewCard
              key={review.id}
              review={review}
              onModerate={onModerate}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="comments" className="space-y-3">
        {pending.comments.length === 0 ? (
          <AdminEmptyState
            icon={Sparkles}
            title="No hay comentarios pendientes"
            description="Los comentarios nuevos quedarán en espera de moderación."
          />
        ) : (
          pending.comments.map((comment) => (
            <ModerationCommentRow
              key={comment.id}
              comment={comment}
              onModerate={onModerate}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="published" className="space-y-4">
        <p className="text-sm text-slate-600">
          Estas publicaciones ya son visibles en /comunidad. Elimínalas si hubo
          un error o contenido inapropiado.
        </p>

        {publishedCount === 0 ? (
          <AdminEmptyState
            icon={Sparkles}
            title="No hay publicaciones aprobadas recientes"
            description="Cuando apruebes contenido, aparecerá aquí para gestionarlo."
          />
        ) : (
          <>
            {published.reviews.map((review) => (
              <PublishedReviewCard
                key={review.id}
                review={review}
                onDelete={(id) => onDeletePublished("review", id)}
              />
            ))}
            {published.comments.map((comment) => (
              <PublishedCommentRow
                key={comment.id}
                comment={comment}
                onDelete={(id) => onDeletePublished("comment", id)}
              />
            ))}
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}
