"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ProductCustomizationNoteProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string | null;
}

export function ProductCustomizationNote({
  value,
  onChange,
  disabled = false,
  error,
}: ProductCustomizationNoteProps) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <Label
        htmlFor="product-customization-note"
        className="text-sm font-medium text-foreground"
      >
        Personalización{" "}
        <span className="font-normal text-muted-foreground">(opcional)</span>
      </Label>
      <Textarea
        id="product-customization-note"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ej: color rosado, cable negro, texto personalizado…"
        disabled={disabled}
        maxLength={200}
        rows={3}
        className={cn(
          "mt-2 resize-none text-foreground",
          error && "border-destructive",
        )}
      />
      <div className="mt-1.5 flex items-center justify-between gap-2">
        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Cuéntanos detalles de color, cable o texto.
          </p>
        )}
        <span className="shrink-0 text-xs text-muted-foreground">
          {value.length}/200
        </span>
      </div>
    </div>
  );
}
