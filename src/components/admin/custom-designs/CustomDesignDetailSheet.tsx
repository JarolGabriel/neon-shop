"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { CustomDesignDetailBody } from "@/components/admin/custom-designs/CustomDesignDetailBody";
import { CustomDesignManageForm } from "@/components/admin/custom-designs/CustomDesignManageForm";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatAdminDateTime } from "@/lib/admin-utils";
import type { AdminCustomDesignManageInput } from "@/lib/schemas/admin-custom-design";
import type { AdminCustomDesign } from "@/types/admin";

interface CustomDesignDetailSheetProps {
  design: AdminCustomDesign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaving: boolean;
  onSave: (
    id: string,
    values: AdminCustomDesignManageInput,
  ) => Promise<AdminCustomDesign>;
  onDelete: (id: string) => Promise<void>;
}

export function CustomDesignDetailSheet({
  design,
  open,
  onOpenChange,
  isSaving,
  onSave,
  onDelete,
}: CustomDesignDetailSheetProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!design) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(design.id);
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-slate-200 bg-white sm:max-w-lg"
        >
          <SheetHeader>
            <SheetTitle className="text-slate-900">
              {design.customer_name}
            </SheetTitle>
            <SheetDescription className="text-slate-500">
              Solicitud del {formatAdminDateTime(design.created_at)}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 px-4 pb-4">
            <CustomDesignDetailBody design={design} />
            <CustomDesignManageForm
              design={design}
              isSaving={isSaving}
              onSave={onSave}
            />
          </div>

          <SheetFooter className="border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving || isDeleting}
              onClick={() => setConfirmOpen(true)}
              className="w-full border-red-200 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="size-4" />
              Eliminar solicitud
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar solicitud"
        description="¿Eliminar esta solicitud permanentemente? No se puede deshacer."
        confirmLabel="Eliminar"
        variant="destructive"
        tone="admin"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
