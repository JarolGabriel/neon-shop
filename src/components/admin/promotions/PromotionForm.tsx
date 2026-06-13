"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PromotionCatalogHelp } from "@/components/admin/promotions/PromotionCatalogHelp";
import { PromotionImagesManager } from "@/components/admin/promotions/PromotionImagesManager";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ADMIN_INPUT_CLASS, ADMIN_TEXTAREA_CLASS } from "@/lib/admin-ui";
import {
  adminPromotionFormSchema,
  PROMOTION_DISPLAY_LOCATIONS,
  type AdminPromotionFormInput,
} from "@/lib/schemas/admin-promotion";
import { HOME_HERO_LOCATION } from "@/types/promotion";
import type { AdminPromotion } from "@/types/admin";

interface PromotionFormProps {
  promotion?: AdminPromotion | null;
  isSaving: boolean;
  onSubmit: (values: AdminPromotionFormInput) => Promise<void>;
  onUploadImage?: (file: File) => Promise<void>;
}

function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  return value.slice(0, 10);
}

function defaultValuesFromPromotion(
  promotion?: AdminPromotion | null,
): AdminPromotionFormInput {
  if (!promotion) {
    return {
      title: "",
      description: "",
      link_url: "",
      link_text: "",
      display_location: HOME_HERO_LOCATION,
      is_active: true,
      display_order: 0,
      start_date: "",
      end_date: "",
    };
  }

  return {
    title: promotion.title,
    description: promotion.description ?? "",
    link_url: promotion.link_url ?? "",
    link_text: promotion.link_text ?? "",
    display_location:
      (promotion.display_location as AdminPromotionFormInput["display_location"]) ??
      HOME_HERO_LOCATION,
    is_active: promotion.is_active !== false,
    display_order: promotion.display_order ?? 0,
    start_date: toDateInputValue(promotion.start_date),
    end_date: toDateInputValue(promotion.end_date),
  };
}

export function PromotionForm({
  promotion,
  isSaving,
  onSubmit,
  onUploadImage,
}: PromotionFormProps) {
  const isEdit = Boolean(promotion);

  const form = useForm<AdminPromotionFormInput>({
    resolver: zodResolver(adminPromotionFormSchema),
    defaultValues: defaultValuesFromPromotion(promotion),
  });

  useEffect(() => {
    form.reset(defaultValuesFromPromotion(promotion));
  }, [promotion, form]);

  const previewPath =
    form.watch("display_location") === HOME_HERO_LOCATION ? "/" : "/comunidad";

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PromotionCatalogHelp />

        {!isEdit ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Guarda la promoción primero; luego podrás subir imágenes.
          </p>
        ) : null}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Título</FormLabel>
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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="link_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Enlace (URL)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://..."
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="link_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Texto del enlace</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ver más"
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="display_location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-700">Ubicación</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSaving}
              >
                <FormControl>
                  <SelectTrigger className={ADMIN_INPUT_CLASS}>
                    <SelectValue placeholder="Selecciona ubicación" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white text-foreground">
                  {PROMOTION_DISPLAY_LOCATIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-slate-500">
                Vista previa en tienda:{" "}
                <a
                  href={previewPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-vite-purple underline"
                >
                  {previewPath}
                </a>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="display_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Orden</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                <FormLabel className="text-slate-700">Activa</FormLabel>
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
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Inicio (opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700">Fin (opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className={ADMIN_INPUT_CLASS}
                    disabled={isSaving}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isEdit && promotion && onUploadImage ? (
          <PromotionImagesManager
            images={promotion.promotion_images}
            isSaving={isSaving}
            onUpload={onUploadImage}
          />
        ) : null}

        <Button
          type="submit"
          className="w-full bg-vite-purple text-white hover:bg-vite-purple/90"
          disabled={isSaving || form.formState.isSubmitting}
        >
          {isSaving
            ? "Guardando..."
            : isEdit
              ? "Guardar cambios"
              : "Crear promoción"}
        </Button>
      </form>
    </Form>
  );
}
