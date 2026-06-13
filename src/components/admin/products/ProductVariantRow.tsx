"use client";

import { Trash2 } from "lucide-react";
import { ProductColorPickerDialog } from "@/components/admin/products/ProductColorPickerDialog";
import { ProductSizePickerDialog } from "@/components/admin/products/ProductSizePickerDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ADMIN_INPUT_CLASS } from "@/lib/admin-ui";
import type { AdminProductVariantDraft } from "@/lib/product-catalog-options";
import { suggestVariantName } from "@/lib/product-catalog-options";

interface ProductVariantRowProps {
  variant: AdminProductVariantDraft;
  disabled?: boolean;
  onChange: (patch: Partial<AdminProductVariantDraft>) => void;
  onRemove: () => void;
}

export function ProductVariantRow({
  variant,
  disabled = false,
  onChange,
  onRemove,
}: ProductVariantRowProps) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs text-slate-600">Tamaño</Label>
          <ProductSizePickerDialog
            value={variant.size ?? ""}
            onChange={(size) =>
              onChange({
                size,
                name: suggestVariantName(size, variant.color),
              })
            }
            disabled={disabled}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-600">Color</Label>
          <ProductColorPickerDialog
            value={{
              color: variant.color ?? "",
              color_hex: variant.color_hex ?? "",
            }}
            onChange={(colorValue) =>
              onChange({
                color: colorValue.color,
                color_hex: colorValue.color_hex,
                name: suggestVariantName(variant.size, colorValue.color),
              })
            }
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1">
          <Label className="text-xs text-slate-600">Precio (USD)</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={variant.price ?? ""}
            onChange={(event) =>
              onChange({
                price: event.target.value
                  ? Number(event.target.value)
                  : undefined,
              })
            }
            disabled={disabled}
            className={ADMIN_INPUT_CLASS}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-600">Stock</Label>
          <Input
            type="number"
            min={0}
            value={variant.stock ?? 0}
            onChange={(event) =>
              onChange({ stock: Number(event.target.value) })
            }
            disabled={disabled}
            className={ADMIN_INPUT_CLASS}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-slate-600">SKU</Label>
          <Input
            value={variant.sku ?? ""}
            onChange={(event) => onChange({ sku: event.target.value })}
            placeholder="Auto"
            disabled={disabled}
            className={ADMIN_INPUT_CLASS}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={variant.is_active !== false}
            onCheckedChange={(checked) => onChange({ is_active: checked })}
            disabled={disabled}
          />
          <span className="text-xs text-slate-600">Activa en tienda</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={onRemove}
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="size-4" />
          Quitar
        </Button>
      </div>
    </div>
  );
}
