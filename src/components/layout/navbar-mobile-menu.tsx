"use client";

import Link from "next/link";
import {
  CUSTOM_NAV_ITEMS,
  NAV_ACTION_BTN,
  STORE_NAV_ITEMS,
} from "@/components/layout/navbar-links";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarMobileMenuProps {
  isAuthenticated: boolean;
  userName: string | null;
}

export function NavbarMobileMenu({
  isAuthenticated,
  userName,
}: NavbarMobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(NAV_ACTION_BTN, "lg:hidden")}
          aria-label="Abrir menú"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full border-border bg-neon-surface sm:max-w-sm"
      >
        <SheetHeader>
          <SheetTitle className="font-heading text-neon-pink dark:text-cyber-yellow">
            Menú
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col gap-6 px-4">
          <MobileSection title="Tienda" items={STORE_NAV_ITEMS} />
          <MobileSection
            title="Carteles Personalizados"
            items={CUSTOM_NAV_ITEMS}
          />

          <div className="flex flex-col gap-1">
            <Link href="/quienes-somos" className="nav-link">
              Quiénes somos
            </Link>
            <Link href="/showroom" className="nav-link">
              Showroom
            </Link>
          </div>

          <div className="border-t border-border/50 pt-4">
            {isAuthenticated ? (
              <p className="text-sm text-muted-foreground">
                Hola,{" "}
                <span className="text-neon-pink dark:text-cyber-yellow">
                  {userName}
                </span>
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className={cn(NAV_ACTION_BTN, "justify-start")}
                  asChild
                >
                  <Link href="/auth/login">Iniciar sesión</Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start rounded-full border-neon-pink/30 hover:border-neon-pink hover:text-neon-pink dark:hover:border-cyber-yellow dark:hover:text-cyber-yellow"
                  asChild
                >
                  <Link href="/auth/registro">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

interface MobileSectionProps {
  title: string;
  items: { label: string; href: string }[];
}

function MobileSection({ title, items }: MobileSectionProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="nav-dropdown-item">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
