"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
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
import { NEON_COLORS } from "@/lib/product-catalog-options";
import { cn } from "@/lib/utils";

const CUSTOM_COLOR_VALUE = "__custom_color__";

export interface ProductColorValue {
  color: string;
  color_hex: string;
}

interface ProductColorPickerDialogProps {
  value: ProductColorValue;
  onChange: (value: ProductColorValue) => void;
  disabled?: boolean;
  label?: string;
}

export function ProductColorPickerDialog({
  value,
  onChange,
  disabled = false,
  label = "Color",
}: ProductColorPickerDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<string>(CUSTOM_COLOR_VALUE);
  const [customName, setCustomName] = useState(value.color);
  const [customHex, setCustomHex] = useState(value.color_hex || "#ff007a");

  useEffect(() => {
    if (!open) return;
    const preset = NEON_COLORS.find(
      (item) => item.label === value.color && item.color === value.color_hex,
    );
    setMode(preset?.id ?? CUSTOM_COLOR_VALUE);
    setCustomName(value.color);
    setCustomHex(value.color_hex || "#ff007a");
  }, [open, value.color, value.color_hex]);

  const apply = () => {
    if (mode === CUSTOM_COLOR_VALUE) {
      onChange({
        color: customName.trim() || "Personalizado",
        color_hex: customHex,
      });
    } else {
      const preset = NEON_COLORS.find((item) => item.id === mode);
      if (preset) {
        onChange({ color: preset.label, color_hex: preset.color });
      }
    }
    setOpen(false);
  };

  const display = value.color || "Seleccionar color";

  return (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="h-10 w-full justify-start border-slate-200 bg-white text-slate-700"
      >
        <span
          className="mr-2 size-4 rounded-full border border-slate-300"
          style={{ backgroundColor: value.color_hex || "#e2e8f0" }}
        />
        <Palette className="mr-2 size-4 text-slate-400" />
        {display}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white text-slate-900 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{label}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {NEON_COLORS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setMode(preset.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2 py-2 text-left text-xs",
                  mode === preset.id
                    ? "border-vite-purple bg-vite-purple/5"
                    : "border-slate-200 hover:bg-slate-50",
                )}
              >
                <span
                  className="size-5 shrink-0 rounded-full border border-slate-300"
                  style={{ backgroundColor: preset.color }}
                />
                {preset.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMode(CUSTOM_COLOR_VALUE)}
            className={cn(
              "w-full rounded-lg border px-3 py-2 text-left text-sm",
              mode === CUSTOM_COLOR_VALUE
                ? "border-vite-purple bg-vite-purple/5"
                : "border-slate-200 hover:bg-slate-50",
            )}
          >
            Otro color
          </button>

          {mode === CUSTOM_COLOR_VALUE ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-slate-700">Nombre</Label>
                <Input
                  value={customName}
                  onChange={(event) => setCustomName(event.target.value)}
                  placeholder="Ej. Turquesa"
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Hex</Label>
                <Input
                  value={customHex}
                  onChange={(event) => setCustomHex(event.target.value)}
                  placeholder="#RRGGBB"
                  className={ADMIN_INPUT_CLASS}
                />
              </div>
            </div>
          ) : null}

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
