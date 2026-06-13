"use client";

import { useState } from "react";
import { Check, MessageSquare, X } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { formatAdminDateTime, getModerationAuthorName } from "@/lib/admin-utils";
import type { AdminPendingComment } from "@/types/admin";

interface ModerationCommentRowProps {
  comment: AdminPendingComment;
  onModerate: (
    targetType: "comment",
    targetId: string,
    action: "approve" | "reject",
  ) => Promise<void>;
}

export function ModerationCommentRow({
  comment,
  onModerate,
}: ModerationCommentRowProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    await onModerate("comment", comment.id, "approve");
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await onModerate("comment", comment.id, "reject");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
            <MessageSquare className="size-4 text-slate-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900">
              {getModerationAuthorName(comment.profiles)}
            </p>
            <p className="text-sm text-slate-600">{comment.comment}</p>
            <p className="text-xs text-slate-400">
              {formatAdminDateTime(comment.created_at)}
            </p>
          </div>
        </div>

        <div className="flex gap-2 sm:shrink-0">
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

      <ConfirmDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Rechazar comentario"
        description="¿Rechazar y eliminar este comentario?"
        confirmLabel="Rechazar"
        variant="destructive"
        tone="admin"
        isLoading={isRejecting}
        onConfirm={handleReject}
      />
    </>
  );
}
