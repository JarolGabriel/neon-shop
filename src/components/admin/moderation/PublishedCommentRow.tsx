"use client";

import { useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { formatAdminDateTime, getModerationAuthorName } from "@/lib/admin-utils";
import type { AdminPendingComment } from "@/types/admin";

interface PublishedCommentRowProps {
  comment: AdminPendingComment;
  onDelete: (targetId: string) => Promise<void>;
}

export function PublishedCommentRow({
  comment,
  onDelete,
}: PublishedCommentRowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } finally {
      setIsDeleting(false);
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

        <Button
          size="sm"
          variant="outline"
          className="border-red-200 text-red-600 hover:bg-red-50 sm:shrink-0"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="size-4" />
          Eliminar
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar comentario"
        description="Este comentario ya es visible en la comunidad. Se eliminará de forma permanente."
        confirmLabel="Eliminar"
        variant="destructive"
        tone="admin"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
