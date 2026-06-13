"use client";

import { Trash2 } from "lucide-react";
import { ProductColorPickerDialog } from "@/components/admin/products/ProductColorPickerDialog";
import { ProductSizePickerDialog } from "@/components/admin/products/ProductSizePickerDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ADMIN_INPUT_CLASS } from "@/lib/admin-ui";
import { getProductSizeLabel, suggestVariantName } from "@/lib/product-catalog-options";
import type { AdminProductVariantInput } from "@/lib/schemas/admin-product";

interface ProductVariantRowProps {
  variant: AdminProductVariantInput;
  disabled?: boolean;
  onChange: (patch: Partial<AdminProductVariantInput>) => void;
  onRemove: () => void;
}

export function ProductVariantRow({
  variant,
  disabled = false,
  onChange,
  onRemove,
}: ProductVariantRowProps) {
  const summary = suggestVariantName(variant.size, variant.color) || "Sin definir";

  return (
    <div className="space-y-3 rounded-md border border-slate-100 bg-slate-50 p-3">
      <p className="text-sm font-medium text-slate-800">{summary}</p>

      <div className="grid gap-2 sm:grid-cols-2">
        <ProductSizePickerDialog
          value={variant.size ?? ""}
          onChange={(size) => {
            onChange({
              size,
              name: suggestVariantName(size, variant.color),
            });
          }}
          disabled={disabled}
          label="Tamaño de la variante"
        />
        <ProductColorPickerDialog
          value={{
            color: variant.color ?? "",
            color_hex: variant.color_hex ?? "",
          }}
          onChange={(colorValue) => {
            onChange({
              color: colorValue.color,
              color_hex: colorValue.color_hex,
              name: suggestVariantName(variant.size, colorValue.color),
            });
          }}
          disabled={disabled}
          label="Color de la variante"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          type="number"
          min={0}
          step="0.01"
          placeholder="Precio (opcional)"
          value={variant.price ?? ""}
          disabled={disabled}
          className={ADMIN_INPUT_CLASS}
          onChange={(event) =>
            onChange({
              price: event.target.value ? Number(event.target.value) : undefined,
            })
          }
        />
        <Input
          type="number"
          min={0}
          placeholder="Stock"
          value={variant.stock ?? 0}
          disabled={disabled}
          className={ADMIN_INPUT_CLASS}
          onChange={(event) =>
            onChange({ stock: Number(event.target.value) })
          }
        />
      </div>

      <Input
        placeholder="SKU (opcional, se genera solo)"
        value={variant.sku ?? ""}
        disabled={disabled}
        className={ADMIN_INPUT_CLASS}
        onChange={(event) => onChange({ sku: event.target.value })}
      />

      {variant.size ? (
        <p className="text-xs text-slate-500">
          Tamaño: {getProductSizeLabel(variant.size)}
        </p>
      ) : null}

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onRemove}
        className="w-full border-slate-200 bg-white"
      >
        <Trash2 className="size-4" />
        Quitar variante
      </Button>
    </div>
  );
}
