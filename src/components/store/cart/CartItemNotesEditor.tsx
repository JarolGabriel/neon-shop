"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { parseCartNotes } from "@/lib/schemas/cart-notes";
import { cn } from "@/lib/utils";

interface CartItemNotesEditorProps {
  itemId: string;
  notes: string | null;
  disabled?: boolean;
}

export function CartItemNotesEditor({
  itemId,
  notes,
  disabled = false,
}: CartItemNotesEditorProps) {
  const { updateNotes } = useCart();
  const [expanded, setExpanded] = useState(Boolean(notes));
  const [draft, setDraft] = useState(notes ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(notes ?? "");
    if (notes) setExpanded(true);
  }, [notes]);

  const hasChanges = draft.trim() !== (notes ?? "").trim();

  const handleSave = async () => {
    if (isSaving || disabled) return;

    setError(null);
    let parsed: string | undefined;
    try {
      parsed = parseCartNotes(draft);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Nota inválida";
      setError(message);
      return;
    }

    const nextNotes = parsed ?? null;
    if (nextNotes === notes) return;

    setIsSaving(true);
    try {
      await updateNotes(itemId, nextNotes);
      toast.success("Personalización guardada");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la personalización",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setExpanded((current) => !current)}
        className={cn(
          "flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-neon-pink! dark:hover:text-cyber-yellow!",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            expanded && "rotate-180",
          )}
          aria-hidden="true"
        />
        Personalización
        {notes ? " (1 nota)" : ""}
      </button>

      {expanded ? (
        <div className="mt-2 space-y-2">
          <Textarea
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setError(null);
            }}
            placeholder="Ej: color rosado, cable negro, texto personalizado…"
            disabled={disabled || isSaving}
            maxLength={200}
            rows={2}
            className={cn(
              "resize-none text-sm text-foreground",
              error && "border-destructive",
            )}
          />
          {error ? (
            <p className="text-xs text-destructive">{error}</p>
          ) : null}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              {draft.length}/200
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={disabled || isSaving || !hasChanges}
              onClick={() => void handleSave()}
              className="h-7 rounded-full px-3 text-xs"
            >
              {isSaving ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </div>
      ) : notes ? (
        <p className="mt-1 text-xs text-amber-400">{notes}</p>
      ) : null}
    </div>
  );
}
