"use client";

import { useState } from "react";
import Link from "next/link";
import { COMMUNITY_LOGIN_REDIRECT } from "@/lib/community-routes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";

interface ShowroomCommentFormProps {
  onSubmit: (comment: string) => Promise<string>;
}

export function ShowroomCommentForm({ onSubmit }: ShowroomCommentFormProps) {
  const { isAuthenticated } = useAuth();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link href={COMMUNITY_LOGIN_REDIRECT} className="underline">
          Inicia sesión
        </Link>{" "}
        para comentar.
      </p>
    );
  }

  async function handleSubmit() {
    const trimmed = comment.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Enviando comentario...");

    try {
      const message = await onSubmit(trimmed);
      setComment("");
      toast.success(message, { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo enviar el comentario.",
        { id: toastId },
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Escribe un comentario..."
        className="min-h-20 resize-none"
      />
      <Button
        type="button"
        size="sm"
        disabled={!comment.trim() || isSubmitting}
        onClick={() => void handleSubmit()}
      >
        Comentar
      </Button>
    </div>
  );
}
