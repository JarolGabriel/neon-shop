"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { appendTagsToComment } from "@/lib/showroom-utils";
import {
  showroomFullPostSchema,
  type ShowroomFullPostValues,
} from "@/lib/schemas/showroom-post";
import { StarRating } from "@/components/store/reviews/StarRating";
import { ShowroomImageDropzone } from "./ShowroomImageDropzone";

interface ShowroomFullPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: {
    title: string;
    comment: string;
    rating: number;
    file?: File | null;
  }) => Promise<string>;
}

export function ShowroomFullPostDialog({
  open,
  onOpenChange,
  onSubmit,
}: ShowroomFullPostDialogProps) {
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<ShowroomFullPostValues>({
    resolver: zodResolver(showroomFullPostSchema),
    defaultValues: {
      title: "",
      comment: "",
      rating: 5,
      tags: "",
    },
  });

  function resetForm() {
    form.reset();
    setFile(null);
  }

  async function handleSubmit(values: ShowroomFullPostValues) {
    const toastId = toast.loading("Enviando publicación...");

    try {
      const message = await onSubmit({
        title: values.title,
        comment: appendTagsToComment(values.comment, values.tags),
        rating: values.rating,
        file,
      });
      toast.success(message, { id: toastId });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo publicar.",
        { id: toastId },
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) resetForm();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear publicación</DialogTitle>
          <DialogDescription>
            Comparte tu letrero con título, descripción e imagen opcional. Tu
            post será revisado antes de aparecer en el feed.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => void handleSubmit(values))}
        >
          <div className="space-y-2">
            <Label htmlFor="showroom-title">Título</Label>
            <Input
              id="showroom-title"
              placeholder="Mi letrero en la habitación..."
              {...form.register("title")}
            />
            {form.formState.errors.title ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.title.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="showroom-comment">Descripción</Label>
            <Textarea
              id="showroom-comment"
              placeholder="Cuéntanos cómo quedó instalado..."
              className="min-h-32"
              {...form.register("comment")}
            />
            {form.formState.errors.comment ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.comment.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="showroom-tags">Etiquetas (opcional)</Label>
            <Input
              id="showroom-tags"
              placeholder="neón habitacion gamer"
              {...form.register("tags")}
            />
            <p className="text-xs text-muted-foreground">
              Se muestran como enlaces debajo del post; no hace falta repetirlos
              en el texto.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Calificación</Label>
            <StarRating
              value={form.watch("rating")}
              onChange={(value) =>
                form.setValue("rating", value, { shouldValidate: true })
              }
              interactive
              size="md"
            />
          </div>

          <div className="space-y-2">
            <Label>Imagen (opcional)</Label>
            <ShowroomImageDropzone
              value={file}
              onChange={setFile}
              disabled={form.formState.isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Enviar a revisión
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
