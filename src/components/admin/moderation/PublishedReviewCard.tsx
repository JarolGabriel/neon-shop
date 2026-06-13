"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { formatAdminDateTime, getModerationAuthorName } from "@/lib/admin-utils";
import type { AdminPendingReview } from "@/types/admin";

interface PublishedReviewCardProps {
  review: AdminPendingReview;
  onDelete: (targetId: string) => Promise<void>;
}

export function PublishedReviewCard({
  review,
  onDelete,
}: PublishedReviewCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(review.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <article className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="space-y-3 p-4">
          {review.image_url ? (
            <div className="relative aspect-video w-[60%] max-w-xs overflow-hidden rounded-md bg-slate-100">
              <Image
                src={review.image_url}
                alt={review.title}
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
          ) : null}

          <div>
            <h3 className="font-medium text-slate-900">{review.title}</h3>
            <p className="text-sm text-slate-500">
              {getModerationAuthorName(review.profiles)} ·{" "}
              {formatAdminDateTime(review.created_at)}
            </p>
          </div>

          <p className="text-sm text-slate-600">{review.comment}</p>

          <Button
            size="sm"
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="size-4" />
            Eliminar publicación
          </Button>
        </div>
      </article>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar publicación"
        description="Esta publicación ya es visible en /comunidad. Se eliminará de forma permanente."
        confirmLabel="Eliminar"
        variant="destructive"
        tone="admin"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
