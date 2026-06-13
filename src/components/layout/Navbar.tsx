"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { CartNavButton } from "@/components/layout/CartNavButton";
import { FavoritesNavButton } from "@/components/layout/FavoritesNavButton";
import { SearchDialog } from "@/components/layout/SearchDialog";
import { NAV_ACTION_BTN, NAVBAR_PILL_CLASS } from "@/components/layout/navbar-links";
import { CustomNavigationMenu } from "@/components/layout/custom-navigation-menu";
import { NavGuestMenu } from "@/components/layout/NavGuestMenu";
import { NavUserMenu } from "@/components/layout/NavUserMenu";
import { NavUserSkeleton } from "@/components/layout/NavUserSkeleton";
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
import { COMMUNITY_PATH } from "@/lib/community-routes";
import { useAuth } from "@/context/AuthContext";
import { useNavbarHidden } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isHidden = useNavbarHidden();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

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
                  <Link href={COMMUNITY_PATH} className="nav-link text-foreground">
                    Comunidad
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
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="size-4" />
            </Button>

            {isLoading ? (
              <NavUserSkeleton />
            ) : isAuthenticated ? (
              <NavUserMenu />
            ) : (
              <NavGuestMenu />
            )}

            <FavoritesNavButton />
            <CartNavButton />

            <ThemeToggle />

            <NavbarMobileMenu
              isAuthenticated={isAuthenticated}
              user={user}
            />
          </div>
        </nav>
      </div>
    </motion.header>
    </>
  );
}

