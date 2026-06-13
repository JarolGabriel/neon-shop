"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Star, X } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { formatAdminDateTime, getModerationAuthorName } from "@/lib/admin-utils";
import type { AdminPendingReview } from "@/types/admin";

interface ModerationReviewCardProps {
  review: AdminPendingReview;
  onModerate: (
    targetType: "review",
    targetId: string,
    action: "approve" | "reject",
  ) => Promise<void>;
}

export function ModerationReviewCard({
  review,
  onModerate,
}: ModerationReviewCardProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    try {
      await onModerate("review", review.id, "approve");
    } catch (error) {
      // toast handled in hook
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await onModerate("review", review.id, "reject");
    } finally {
      setIsRejecting(false);
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
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium text-slate-900">{review.title}</h3>
              <p className="text-sm text-slate-500">
                {getModerationAuthorName(review.profiles)} ·{" "}
                {formatAdminDateTime(review.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="size-4 fill-current" />
              <span className="text-sm font-medium">{review.rating}</span>
            </div>
          </div>

          <p className="text-sm text-slate-600">{review.comment}</p>

          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => void handleApprove()}
            >
              <Check className="size-4" />
              Aprobar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setRejectOpen(true)}
            >
              <X className="size-4" />
              Rechazar
            </Button>
          </div>
        </div>
      </article>

      <ConfirmDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Rechazar publicación"
        description="¿Rechazar y eliminar esta publicación? No aparecerá en la comunidad."
        confirmLabel="Rechazar"
        variant="destructive"
        tone="admin"
        isLoading={isRejecting}
        onConfirm={handleReject}
      />
    </>
  );
}
