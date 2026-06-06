"use client";

import Link from "next/link";
import {
  NAV_MENU_LINK_CLASS,
  NAV_TRIGGER_CLASS,
} from "@/components/layout/navbar-links";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

export function StoreNavigationMenu() {
  const { categories, isLoading, error } = useCategories();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(NAV_TRIGGER_CLASS, "group text-foreground")}
      >
        Tienda
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-neon-surface left-0 z-50 mt-1.5 w-[260px] rounded-lg p-4 shadow-md ring-1 ring-foreground/10">
        <ul className="flex flex-col">
          <li>
            <NavigationMenuLink asChild>
              <Link href="/productos" className={NAV_MENU_LINK_CLASS}>
                Ver todos
              </Link>
            </NavigationMenuLink>
          </li>

          {isLoading && (
            <li className="px-2 py-1.5 text-xs text-muted-foreground">
              Cargando…
            </li>
          )}

          {error && (
            <li className="px-2 py-1.5 text-xs text-muted-foreground">
              {error}
            </li>
          )}

          {!isLoading &&
            !error &&
            categories.map((category) => (
              <li key={category.id}>
                <NavigationMenuLink asChild>
                  <Link
                    href={`/productos?category=${encodeURIComponent(category.slug)}`}
                    className={NAV_MENU_LINK_CLASS}
                  >
                    {category.name}
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
