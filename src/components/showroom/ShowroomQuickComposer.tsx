"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { COMMUNITY_LOGIN_REDIRECT } from "@/lib/community-routes";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface ShowroomQuickComposerProps {
  onOpenFullEditor: () => void;
  onSubmit: (payload: {
    title: string;
    comment: string;
    rating: number;
  }) => Promise<string>;
}

const MAX_CHARS = 256;

export function ShowroomQuickComposer({
  onOpenFullEditor,
  onSubmit,
}: ShowroomQuickComposerProps) {
  const { isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Enviando publicación...");

    try {
      const message = await onSubmit({
        title: trimmed.slice(0, 80),
        comment: trimmed,
        rating: 5,
      });
      setText("");
      toast.success(message, { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo publicar.",
        { id: toastId },
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">
          ¿Tienes un letrero Neon?{" "}
          <Link href={COMMUNITY_LOGIN_REDIRECT} className="text-foreground underline">
            Inicia sesión
          </Link>{" "}
          para compartir tu experiencia.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Textarea
        value={text}
        onChange={(event) => setText(event.target.value.slice(0, MAX_CHARS))}
        placeholder="¿Qué letrero quieres compartir hoy?"
        className="min-h-24 resize-none border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            {text.length}/{MAX_CHARS}
          </span>
          <button
            type="button"
            onClick={onOpenFullEditor}
            className={cn(
              "underline-offset-2 hover:underline hover:text-neon-pink! dark:hover:text-cyber-yellow!",
            )}
          >
            Abrir editor completo
          </button>
        </div>

        <Button
          type="button"
          size="sm"
          disabled={!text.trim() || isSubmitting}
          onClick={() => void handleSubmit()}
        >
          Publicar
        </Button>
      </div>
    </div>
  );
}
