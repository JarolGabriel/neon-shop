"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { ProductVariantBulkGenerator } from "@/components/admin/products/ProductVariantBulkGenerator";
import { ProductVariantRow } from "@/components/admin/products/ProductVariantRow";
import { Button } from "@/components/ui/button";
import type { AdminProductVariantInput } from "@/lib/schemas/admin-product";
import { cn } from "@/lib/utils";

interface ProductVariantsEditorProps {
  value: AdminProductVariantInput[];
  onChange: (variants: AdminProductVariantInput[]) => void;
  disabled?: boolean;
  basePrice?: number;
  baseStock?: number;
}

const emptyVariant = (): AdminProductVariantInput => ({
  name: "",
  sku: "",
  size: "",
  color: "",
  color_hex: "",
  stock: 0,
  is_active: true,
});

export function ProductVariantsEditor({
  value,
  onChange,
  disabled = false,
  basePrice = 0,
  baseStock = 0,
}: ProductVariantsEditorProps) {
  const [open, setOpen] = useState(true);

  const updateVariant = (
    index: number,
    patch: Partial<AdminProductVariantInput>,
  ) => {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  return (
    <div className="rounded-lg border border-slate-200">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((current) => !current)}
      >
        <div>
          <p className="text-sm font-medium text-slate-900">
            Tamaños y colores del producto
          </p>
          <p className="text-xs text-slate-500">
            {value.length > 0
              ? `${value.length} combinación${value.length === 1 ? "" : "es"} configurada${value.length === 1 ? "" : "s"}`
              : "Genera todas las combinaciones o agrega una a una"}
          </p>
        </div>
        <ChevronDown
          className={cn("size-4 text-slate-500 transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div className="space-y-4 border-t border-slate-200 p-4">
          <ProductVariantBulkGenerator
            existingVariants={value}
            basePrice={basePrice}
            baseStock={baseStock}
            disabled={disabled}
            onGenerate={onChange}
          />

          {value.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Variantes generadas ({value.length})
              </p>
              {value.map((variant, index) => (
                <ProductVariantRow
                  key={variant.id ?? `new-${index}`}
                  variant={variant}
                  disabled={disabled}
                  onChange={(patch) => updateVariant(index, patch)}
                  onRemove={() => onChange(value.filter((_, i) => i !== index))}
                />
              ))}
            </div>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onChange([...value, emptyVariant()])}
            className="border-slate-200 bg-white"
          >
            <Plus className="size-4" />
            Agregar una variante manual
          </Button>
        </div>
      ) : null}
    </div>
  );
}
