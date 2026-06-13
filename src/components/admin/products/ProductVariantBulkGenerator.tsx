"use client";

import { useMemo, useState } from "react";
import { Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_INPUT_CLASS } from "@/lib/admin-ui";
import {
  buildVariantCombinations,
  mergeVariantCombinations,
  NEON_COLORS,
  normalizeCustomSize,
  PRODUCT_SIZE_PRESETS,
} from "@/lib/product-catalog-options";
import type { AdminProductVariantInput } from "@/lib/schemas/admin-product";
import { cn } from "@/lib/utils";

interface ProductVariantBulkGeneratorProps {
  existingVariants: AdminProductVariantInput[];
  basePrice: number;
  baseStock: number;
  disabled?: boolean;
  onGenerate: (variants: AdminProductVariantInput[]) => void;
}

export function ProductVariantBulkGenerator({
  existingVariants,
  basePrice,
  baseStock,
  disabled = false,
  onGenerate,
}: ProductVariantBulkGeneratorProps) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColorIds, setSelectedColorIds] = useState<string[]>([]);
  const [customSizeText, setCustomSizeText] = useState("");

  const selectedColors = useMemo(
    () =>
      NEON_COLORS.filter((preset) => selectedColorIds.includes(preset.id)).map(
        (preset) => ({
          color: preset.label,
          color_hex: preset.color,
        }),
      ),
    [selectedColorIds],
  );

  const combinationCount = selectedSizes.length * selectedColors.length;

  const toggleSize = (size: string) => {
    setSelectedSizes((current) =>
      current.includes(size)
        ? current.filter((item) => item !== size)
        : [...current, size],
    );
  };

  const toggleColor = (colorId: string) => {
    setSelectedColorIds((current) =>
      current.includes(colorId)
        ? current.filter((item) => item !== colorId)
        : [...current, colorId],
    );
  };

  const addCustomSize = () => {
    const normalized = normalizeCustomSize(customSizeText);
    if (!normalized || selectedSizes.includes(normalized)) return;
    setSelectedSizes((current) => [...current, normalized]);
    setCustomSizeText("");
  };

  const handleGenerate = () => {
    if (combinationCount === 0) return;

    const generated = buildVariantCombinations(
      selectedSizes,
      selectedColors,
      basePrice,
      baseStock,
    );
    onGenerate(mergeVariantCombinations(existingVariants, generated));
  };

  return (
    <div className="space-y-4 rounded-lg border border-vite-purple/20 bg-vite-purple/5 p-4">
      <div className="flex items-start gap-2">
        <Layers className="mt-0.5 size-4 shrink-0 text-vite-purple" />
        <div>
          <p className="text-sm font-medium text-slate-900">
            Varias tallas y colores a la vez
          </p>
          <p className="text-xs text-slate-600">
            Marca los tamaños y colores que ofreces; se crea una variante por
            cada combinación (ej. 3 tamaños × 4 colores = 12 variantes).
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-700">Tamaños disponibles</Label>
        <div className="flex flex-wrap gap-2">
          {PRODUCT_SIZE_PRESETS.map((preset) => {
            const active = selectedSizes.includes(preset.value);
            return (
              <button
                key={preset.value}
                type="button"
                disabled={disabled}
                onClick={() => toggleSize(preset.value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition-colors",
                  active
                    ? "border-vite-purple bg-vite-purple text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <Input
            value={customSizeText}
            onChange={(event) => setCustomSizeText(event.target.value)}
            placeholder="Tamaño personalizado (ej. 30 cm)"
            disabled={disabled}
            className={ADMIN_INPUT_CLASS}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || !customSizeText.trim()}
            onClick={addCustomSize}
            className="shrink-0 border-slate-200 bg-white"
          >
            <Plus className="size-4" />
            Agregar
          </Button>
        </div>

        {selectedSizes.some((size) => size.startsWith("custom:")) ? (
          <div className="flex flex-wrap gap-1.5">
            {selectedSizes
              .filter((size) => size.startsWith("custom:"))
              .map((size) => (
                <button
                  key={size}
                  type="button"
                  disabled={disabled}
                  onClick={() => toggleSize(size)}
                  className="rounded-full border border-vite-purple bg-vite-purple/10 px-2.5 py-1 text-xs text-slate-700"
                >
                  {size.slice("custom:".length)} ×
                </button>
              ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label className="text-slate-700">Colores disponibles</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {NEON_COLORS.map((preset) => {
            const active = selectedColorIds.includes(preset.id);
            return (
              <button
                key={preset.id}
                type="button"
                disabled={disabled}
                onClick={() => toggleColor(preset.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2 py-2 text-left text-xs transition-colors",
                  active
                    ? "border-vite-purple bg-white ring-1 ring-vite-purple"
                    : "border-slate-200 bg-white hover:bg-slate-50",
                )}
              >
                <span
                  className="size-5 shrink-0 rounded-full border border-slate-300"
                  style={{ backgroundColor: preset.color }}
                />
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-600">
          {selectedSizes.length} tamaño{selectedSizes.length === 1 ? "" : "s"}{" "}
          × {selectedColors.length} color
          {selectedColors.length === 1 ? "" : "es"} ={" "}
          <strong>{combinationCount} variantes</strong>
        </p>
        <Button
          type="button"
          disabled={disabled || combinationCount === 0}
          onClick={handleGenerate}
          className="bg-vite-purple text-white hover:bg-vite-purple/90"
        >
          Generar combinaciones
        </Button>
      </div>
    </div>
  );
}
