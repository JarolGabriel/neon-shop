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
import { Switch } from "@/components/ui/switch";
import { ADMIN_INPUT_CLASS } from "@/lib/admin-ui";
import type { AdminProductUpdateInput } from "@/lib/schemas/admin-product";

interface ProductDetailFieldsProps {
  form: UseFormReturn<AdminProductUpdateInput>;
  isSaving: boolean;
  showBestSeller?: boolean;
}

export function ProductDetailFields({
  form,
  isSaving,
  showBestSeller = false,
}: ProductDetailFieldsProps) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="voltage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Voltaje</FormLabel>
              <FormControl>
                <Input {...field} className={ADMIN_INPUT_CLASS} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="material"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Material</FormLabel>
              <FormControl>
                <Input {...field} className={ADMIN_INPUT_CLASS} disabled={isSaving} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
            <div>
              <FormLabel className="text-slate-700">Producto activo</FormLabel>
              <FormDescription className="text-slate-500">
                Los inactivos no aparecen en el catálogo público.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSaving}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_featured"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
            <div>
              <FormLabel className="text-slate-700">Destacado</FormLabel>
              <FormDescription className="text-slate-500">
                Puede usarse para promocionar el producto en la tienda.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSaving}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {showBestSeller ? (
        <FormField
          control={form.control}
          name="is_best_seller"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
              <div>
                <FormLabel className="text-slate-700">Más vendido</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSaving}
                />
              </FormControl>
            </FormItem>
          )}
        />
      ) : null}
    </>
  );
}
