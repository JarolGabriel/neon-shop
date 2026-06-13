"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { ProductVariantRow } from "@/components/admin/products/ProductVariantRow";
import { Button } from "@/components/ui/button";
import type { AdminProductVariantDraft } from "@/lib/product-catalog-options";
import { cn } from "@/lib/utils";

interface ProductAdvancedVariantsSectionProps {
  variants: AdminProductVariantDraft[];
  onChange: (variants: AdminProductVariantDraft[]) => void;
  basePrice: number;
  baseStock: number;
  hasConfiguredOptions: boolean;
  disabled?: boolean;
  defaultOpen?: boolean;
}

const emptyVariant = (
  basePrice: number,
  baseStock: number,
): AdminProductVariantDraft => ({
  name: "",
  sku: "",
  size: "",
  color: "",
  color_hex: "",
  price: basePrice > 0 ? basePrice : undefined,
  stock: baseStock,
  is_active: true,
});

export function ProductAdvancedVariantsSection({
  variants,
  onChange,
  basePrice,
  baseStock,
  hasConfiguredOptions,
  disabled = false,
  defaultOpen = false,
}: ProductAdvancedVariantsSectionProps) {
  const [open, setOpen] = useState(defaultOpen || variants.length > 0);

  const updateVariant = (
    index: number,
    patch: Partial<AdminProductVariantDraft>,
  ) => {
    onChange(
      variants.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  };

  const showConflictBanner = variants.length > 0 && hasConfiguredOptions;

  return (
    <div className="rounded-lg border border-slate-200">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((current) => !current)}
      >
        <div>
          <p className="text-sm font-medium text-slate-900">
            Precio o stock por combinación (opcional)
          </p>
          <p className="text-xs text-slate-500">
            Solo si cada talla/color tiene precio o stock distinto.
          </p>
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-slate-500 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="space-y-4 border-t border-slate-200 p-4">
          <p className="text-xs leading-relaxed text-slate-600">
            La mayoría de productos no necesitan esto. Usa las opciones de arriba.
            Abre esta sección solo cuando Grande cuesta más, o Rosa tiene stock
            distinto, etc.
          </p>

          {showConflictBanner ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              Este producto tiene combinaciones avanzadas. En la tienda se usarán
              precio y stock por combinación; las opciones simples de arriba no
              controlan la ficha.
            </div>
          ) : null}

          {variants.length > 0 ? (
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <ProductVariantRow
                  key={variant.id ?? `new-${index}`}
                  variant={variant}
                  disabled={disabled}
                  onChange={(patch) => updateVariant(index, patch)}
                  onRemove={() =>
                    onChange(variants.filter((_, i) => i !== index))
                  }
                />
              ))}
            </div>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() =>
              onChange([...variants, emptyVariant(basePrice, baseStock)])
            }
            className="border-slate-200 bg-white"
          >
            <Plus className="size-4" />
            Agregar combinación
          </Button>
        </div>
      ) : null}
    </div>
  );
}
