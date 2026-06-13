"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { LogIn, User, UserPlus } from "lucide-react";
import { NAV_ACTION_BTN } from "@/components/layout/navbar-links";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const CLOSE_DELAY_MS = 150;

export function NavGuestMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  const handleOpen = () => {
    clearCloseTimer();
    setOpen(true);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            NAV_ACTION_BTN,
            "hidden size-8 rounded-full text-foreground sm:inline-flex",
            "transition-shadow hover:bg-transparent",
            "hover:ring-2 hover:ring-neon-pink/50 dark:hover:ring-cyber-yellow/50",
          )}
          aria-label="Cuenta"
          onMouseEnter={handleOpen}
          onMouseLeave={scheduleClose}
        >
          <User className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 border border-border/50 bg-neon-surface text-foreground"
        onMouseEnter={handleOpen}
        onMouseLeave={scheduleClose}
      >
        <DropdownMenuItem asChild className="text-foreground">
          <Link href="/auth/login">
            <LogIn />
            Iniciar sesión
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="text-foreground">
          <Link href="/auth/registro">
            <UserPlus />
            Registrarse
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
