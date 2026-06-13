"use client";

import { useEffect, useState } from "react";
import { Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_INPUT_CLASS } from "@/lib/admin-ui";
import {
  CUSTOM_SIZE_VALUE,
  getProductSizeLabel,
  normalizeCustomSize,
  PRODUCT_SIZE_PRESETS,
} from "@/lib/product-catalog-options";
import { cn } from "@/lib/utils";

interface ProductSizePickerDialogProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
}

export function ProductSizePickerDialog({
  value,
  onChange,
  disabled = false,
  label = "Tamaño",
}: ProductSizePickerDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<string>(
    value.startsWith("custom:") ? CUSTOM_SIZE_VALUE : value || "",
  );
  const [customText, setCustomText] = useState(
    value.startsWith("custom:") ? value.slice("custom:".length) : "",
  );

  useEffect(() => {
    if (!open) return;
    setMode(value.startsWith("custom:") ? CUSTOM_SIZE_VALUE : value || "");
    setCustomText(value.startsWith("custom:") ? value.slice("custom:".length) : "");
  }, [open, value]);

  const apply = () => {
    if (mode === CUSTOM_SIZE_VALUE) {
      onChange(normalizeCustomSize(customText));
    } else if (mode) {
      onChange(mode);
    }
    setOpen(false);
  };

  const display = value ? getProductSizeLabel(value) : "Seleccionar tamaño";

  return (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="h-10 w-full justify-start border-slate-200 bg-white text-slate-700"
      >
        <Ruler className="mr-2 size-4 text-slate-400" />
        {display}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white text-slate-900 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            {PRODUCT_SIZE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setMode(preset.value)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  mode === preset.value
                    ? "border-vite-purple bg-vite-purple/5 text-slate-900"
                    : "border-slate-200 hover:bg-slate-50",
                )}
              >
                {preset.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setMode(CUSTOM_SIZE_VALUE)}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                mode === CUSTOM_SIZE_VALUE
                  ? "border-vite-purple bg-vite-purple/5 text-slate-900"
                  : "border-slate-200 hover:bg-slate-50",
              )}
            >
              Tamaño personalizado
            </button>

            {mode === CUSTOM_SIZE_VALUE ? (
              <div className="space-y-2 pt-1">
                <Label className="text-slate-700">Medida a medida</Label>
                <Input
                  value={customText}
                  onChange={(event) => setCustomText(event.target.value)}
                  placeholder="Ej. 30 cm, 50×25 cm, a medida"
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-200 bg-white"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={apply}
              className="bg-vite-purple text-white hover:bg-vite-purple/90"
            >
              Aplicar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
