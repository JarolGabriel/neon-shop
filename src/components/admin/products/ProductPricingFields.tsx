"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ADMIN_INPUT_CLASS, ADMIN_TEXTAREA_CLASS } from "@/lib/admin-ui";
import type { AdminProductUpdateInput } from "@/lib/schemas/admin-product";

interface ProductPricingFieldsProps {
  form: UseFormReturn<AdminProductUpdateInput>;
  isSaving: boolean;
}

export function ProductPricingFields({
  form,
  isSaving,
}: ProductPricingFieldsProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Precio (USD)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  className={ADMIN_INPUT_CLASS}
                  disabled={isSaving}
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(Number(event.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="compare_at_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Precio tachado</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  className={ADMIN_INPUT_CLASS}
                  disabled={isSaving}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value ? Number(value) : null);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  className={ADMIN_INPUT_CLASS}
                  disabled={isSaving}
                  value={field.value}
                  onChange={(event) =>
                    field.onChange(Number(event.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">SKU</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Se genera automáticamente si lo dejas vacío"
                  className={ADMIN_INPUT_CLASS}
                  disabled={isSaving}
                />
              </FormControl>
              <FormDescription className="text-slate-500">
                Código interno de inventario. No lo ve el cliente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="short_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">Descripción corta</FormLabel>
            <FormControl>
              <Input {...field} className={ADMIN_INPUT_CLASS} disabled={isSaving} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-slate-700">Descripción</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                rows={3}
                className={ADMIN_TEXTAREA_CLASS}
                disabled={isSaving}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
