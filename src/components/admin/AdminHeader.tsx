"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminHeaderProps {
  title: string;
  onSignOut: () => void;
}

export function AdminHeader({ title, onSignOut }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Menú admin</SheetTitle>
          </SheetHeader>
          <AdminSidebar onSignOut={onSignOut} />
        </SheetContent>
      </Sheet>

      <h2 className="text-base font-semibold text-slate-900 lg:text-lg">
        {title}
      </h2>
    </header>
  );
}
