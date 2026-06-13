"use client";

import { useId, type ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface AdminFormSectionProps {
  label: string;
  description?: ReactNode;
  /** Asocia el label con un control (ej. input file oculto). */
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Bloque label + ayuda + contenido para secciones del panel admin que no son
 * campos de react-hook-form (subidas de archivo, acciones async, etc.).
 *
 * Para campos del formulario usar siempre FormField + FormLabel.
 */
export function AdminFormSection({
  label,
  description,
  htmlFor,
  children,
  className,
}: AdminFormSectionProps) {
  const generatedId = useId();
  const controlId = htmlFor ?? generatedId;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={controlId} className="text-slate-700">
        {label}
      </Label>
      {description ? (
        <p className="text-xs text-slate-500">{description}</p>
      ) : null}
      <div id={controlId} className="space-y-3">
        {children}
      </div>
    </div>
  );
}
