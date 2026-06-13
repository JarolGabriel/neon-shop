"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PasswordFieldProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  id: string;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    {
      id,
      autoComplete = "current-password",
      placeholder = "••••••••",
      disabled,
      className,
      ...props
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          id={id}
          ref={ref}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          className={cn("pr-10", className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {visible ? (
            <EyeOff className="size-4" aria-hidden />
          ) : (
            <Eye className="size-4" aria-hidden />
          )}
        </Button>
      </div>
    );
  },
);
