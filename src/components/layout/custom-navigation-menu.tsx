"use client";

import Link from "next/link";
import {
  CUSTOM_NAV_ITEMS,
  NAV_MENU_LINK_CLASS,
  NAV_TRIGGER_CLASS,
} from "@/components/layout/navbar-links";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function CustomNavigationMenu() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(NAV_TRIGGER_CLASS, "group text-foreground")}
      >
        Carteles Personalizados
      </NavigationMenuTrigger>
      <NavigationMenuContent className="bg-neon-surface left-0 z-50 mt-1.5 w-[300px] rounded-lg p-4 shadow-md ring-1 ring-foreground/10">
        <ul className="flex flex-col">
          {CUSTOM_NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavigationMenuLink asChild>
                <Link href={item.href} className={NAV_MENU_LINK_CLASS}>
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
