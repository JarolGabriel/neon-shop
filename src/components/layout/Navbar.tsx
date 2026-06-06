"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { NAV_ACTION_BTN, NAVBAR_PILL_CLASS } from "@/components/layout/navbar-links";
import { CustomNavigationMenu } from "@/components/layout/custom-navigation-menu";
import { NavbarMobileMenu } from "@/components/layout/navbar-mobile-menu";
import { StoreNavigationMenu } from "@/components/layout/store-navigation-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";
import { useNavbarHidden } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const userName = user?.first_name ?? user?.email?.split("@")[0] ?? null;
  const isHidden = useNavbarHidden();

  return (
    <motion.header
      className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6"
      animate={{ y: isHidden ? "-120%" : "0%" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        <nav className={NAVBAR_PILL_CLASS} aria-label="Principal">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image src="/icon.svg" alt="" width={28} height={28} priority />

            <span className="font-heading text-base font-bold text-neon-pink transition-colors duration-200 dark:text-cyber-yellow sm:text-lg">
              Neon Shop
            </span>
          </Link>

          <NavigationMenu
            viewport={false}
            className="hidden max-w-none flex-1 justify-center lg:flex"
          >
            <NavigationMenuList className="gap-0.5">
              <StoreNavigationMenu />
              <CustomNavigationMenu />

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
    </motion.header>
  );
}

