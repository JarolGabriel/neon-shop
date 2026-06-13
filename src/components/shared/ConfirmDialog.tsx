"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  tone?: "store" | "admin";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  tone = "store",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const busy = isLoading || isConfirming;

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className={cn(
          tone === "admin" &&
            "border-slate-200 bg-white text-slate-900 shadow-lg",
        )}
      >
        <AlertDialogHeader>
          <AlertDialogTitle
            className={tone === "admin" ? "text-slate-900" : undefined}
          >
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription
            className={tone === "admin" ? "text-slate-600" : undefined}
          >
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={busy}
            className={
              tone === "admin"
                ? "border-slate-200 bg-white text-slate-700"
                : undefined
            }
          >
            {cancelLabel}
          </AlertDialogCancel>
          <Button
            type="button"
            disabled={busy}
            variant="default"
            className={cn(
              variant === "destructive" &&
                "!border-transparent !bg-red-600 !text-white hover:!bg-red-700 focus-visible:!ring-red-600/40",
              variant === "default" &&
                tone === "admin" &&
                "bg-vite-purple text-white hover:bg-vite-purple/90",
            )}
            onClick={() => void handleConfirm()}
          >
            {busy ? "Procesando..." : confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
