"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteShowroomPost } from "@/lib/api";

interface ShowroomPostOwnerMenuProps {
  postId: string;
  accessToken: string;
  onDeleted: (postId: string) => void;
}

export function ShowroomPostOwnerMenu({
  postId,
  accessToken,
  onDeleted,
}: ShowroomPostOwnerMenuProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteShowroomPost(accessToken, postId);
      toast.success(response.message);
      onDeleted(postId);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la publicación.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6 shrink-0 text-muted-foreground hover:bg-transparent"
            disabled={isDeleting}
            aria-label="Opciones de tu publicación"
          >
            <MoreHorizontal className="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-card text-foreground">
          <DropdownMenuItem
            variant="destructive"
            disabled={isDeleting}
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="size-4" />
            Eliminar publicación
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar publicación"
        description="¿Eliminar esta publicación? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
