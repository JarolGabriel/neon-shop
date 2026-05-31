"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import {
  CUSTOM_NAV_ITEMS,
  NAV_ACTION_BTN,
  NAV_TRIGGER_CLASS,
  NAVBAR_PILL_CLASS,
  STORE_NAV_ITEMS,
} from "@/components/layout/navbar-links";
import { NavbarMobileMenu } from "@/components/layout/navbar-mobile-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const userName = user?.first_name ?? user?.email?.split("@")[0] ?? null;

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        <nav className={NAVBAR_PILL_CLASS} aria-label="Principal">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image src="/icon.svg" alt="" width={28} height={28} priority />

            <span className="font-heading text-base font-bold text-neon-pink transition-colors duration-200 dark:text-cyber-yellow sm:text-lg">
              Neon Shop
            </span>
          </Link>

          <NavigationMenu className="hidden max-w-none flex-1 justify-center lg:flex">
            <NavigationMenuList className="gap-0.5">
              <NavDropdown label="Tienda" items={STORE_NAV_ITEMS} />
              <NavDropdown
                label="Carteles Personalizados"
                items={CUSTOM_NAV_ITEMS}
              />

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/quienes-somos"
                    className="nav-link text-foreground"
                  >
                    Quiénes somos
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/showroom" className="nav-link text-foreground">
                    Showroom
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Buscar"
              className={cn(NAV_ACTION_BTN, "text-foreground")}
            >
              <Search className="size-4" />
            </Button>

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden rounded-full text-neon-pink sm:inline-flex dark:text-cyber-yellow"
                  >
                    {userName}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        NAV_ACTION_BTN,
                        "hidden sm:inline-flex text-foreground",
                      )}
                      asChild
                    >
                      <Link href="/auth/login">Login</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        NAV_ACTION_BTN,
                        "hidden sm:inline-flex text-foreground",
                      )}
                      asChild
                    >
                      <Link href="/auth/registro">Registro</Link>
                    </Button>
                  </>
                )}
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              aria-label="Carrito"
              className={cn(NAV_ACTION_BTN, "text-foreground")}
              asChild
            >
              <Link href="/checkout">
                <ShoppingCart className="size-4" />
              </Link>
            </Button>

            <ThemeToggle />

            <NavbarMobileMenu
              isAuthenticated={isAuthenticated}
              userName={userName}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}

interface NavDropdownProps {
  label: string;
  items: { label: string; href: string }[];
}

function NavDropdown({ label, items }: NavDropdownProps) {
  return (
    <NavigationMenuItem>
      {/* Añadimos text-foreground para que la etiqueta cambie con el tema */}
      <NavigationMenuTrigger
        className={cn(NAV_TRIGGER_CLASS, "group text-foreground")}
      >
        {label}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        {/* CORRECCIÓN: Eliminamos rebordes toscos y forzamos text-foreground para los items del menú */}
        <ul className="grid w-[220px] gap-0.5 rounded-xl border border-border bg-popover p-1.5 shadow-xl text-foreground">
          {items.map((item) => (
            <li key={item.href}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className="nav-dropdown-item block px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted"
                >
                  {item.label}
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
