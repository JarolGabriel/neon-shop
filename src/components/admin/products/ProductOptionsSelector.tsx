"use client";

import { useState } from "react";
import { Layers, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_INPUT_CLASS } from "@/lib/admin-ui";
import {
  NEON_COLORS,
  normalizeCustomSize,
  PRODUCT_SIZE_PRESETS,
  type ProductAvailableColor,
} from "@/lib/product-catalog-options";
import { cn } from "@/lib/utils";

interface ProductOptionsSelectorProps {
  availableSizes: string[];
  availableColors: ProductAvailableColor[];
  onSizesChange: (sizes: string[]) => void;
  onColorsChange: (colors: ProductAvailableColor[]) => void;
  disabled?: boolean;
}

export function ProductOptionsSelector({
  availableSizes,
  availableColors,
  onSizesChange,
  onColorsChange,
  disabled = false,
}: ProductOptionsSelectorProps) {
  const [customSizeText, setCustomSizeText] = useState("");

  const presetValues = PRODUCT_SIZE_PRESETS.map((preset) => preset.value);
  const allPresetSizesSelected = presetValues.every((value) =>
    availableSizes.includes(value),
  );
  const allColorsSelected = NEON_COLORS.every((preset) =>
    availableColors.some(
      (color) => color.hex.toLowerCase() === preset.color.toLowerCase(),
    ),
  );

  const toggleSize = (size: string) => {
    onSizesChange(
      availableSizes.includes(size)
        ? availableSizes.filter((item) => item !== size)
        : [...availableSizes, size],
    );
  };

  const toggleColor = (preset: (typeof NEON_COLORS)[number]) => {
    const exists = availableColors.some(
      (color) => color.hex.toLowerCase() === preset.color.toLowerCase(),
    );

    if (exists) {
      onColorsChange(
        availableColors.filter(
          (color) => color.hex.toLowerCase() !== preset.color.toLowerCase(),
        ),
      );
      return;
    }

    onColorsChange([
      ...availableColors,
      { label: preset.label, hex: preset.color },
    ]);
  };

  const addCustomSize = () => {
    const normalized = normalizeCustomSize(customSizeText);
    if (!normalized || availableSizes.includes(normalized)) return;
    onSizesChange([...availableSizes, normalized]);
    setCustomSizeText("");
  };

  const selectAllSizes = () => {
    const customSizes = availableSizes.filter((size) =>
      size.startsWith("custom:"),
    );
    onSizesChange([...presetValues, ...customSizes]);
  };

  const clearSizes = () => {
    onSizesChange([]);
  };

  const selectAllColors = () => {
    onColorsChange(
      NEON_COLORS.map((preset) => ({
        label: preset.label,
        hex: preset.color,
      })),
    );
  };

  const clearColors = () => {
    onColorsChange([]);
  };

  return (
    <div className="rounded-lg border border-slate-200">
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-slate-900">
          Tamaños y colores del producto
        </p>
        <p className="text-xs text-slate-500">
          Estas opciones aparecerán en la tienda. No se crean variantes.
        </p>
      </div>

      <div className="space-y-4 border-t border-slate-200 p-4">
        <div className="space-y-4 rounded-lg border border-vite-purple/20 bg-vite-purple/5 p-4">
          <div className="flex items-start gap-2">
            <Layers className="mt-0.5 size-4 shrink-0 text-vite-purple" />
            <p className="text-xs text-slate-600">
              Marca los tamaños y colores que ofreces. El cliente elegirá en la
              ficha; precio y stock vienen del producto base.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-slate-700">Tamaños disponibles</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || allPresetSizesSelected}
                  onClick={selectAllSizes}
                  className="h-7 border-slate-200 bg-white px-2 text-xs"
                >
                  Seleccionar todos
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || availableSizes.length === 0}
                  onClick={clearSizes}
                  className="h-7 border-slate-200 bg-white px-2 text-xs"
                >
                  Limpiar
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRODUCT_SIZE_PRESETS.map((preset) => {
                const active = availableSizes.includes(preset.value);
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

            {availableSizes.some((size) => size.startsWith("custom:")) ? (
              <div className="flex flex-wrap gap-1.5">
                {availableSizes
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label className="text-slate-700">Colores disponibles</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || allColorsSelected}
                  onClick={selectAllColors}
                  className="h-7 border-slate-200 bg-white px-2 text-xs"
                >
                  Seleccionar todos
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || availableColors.length === 0}
                  onClick={clearColors}
                  className="h-7 border-slate-200 bg-white px-2 text-xs"
                >
                  Limpiar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {NEON_COLORS.map((preset) => {
                const active = availableColors.some(
                  (color) =>
                    color.hex.toLowerCase() === preset.color.toLowerCase(),
                );
                return (
                  <button
                    key={preset.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleColor(preset)}
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
        </div>
      </div>
    </div>
  );
}
