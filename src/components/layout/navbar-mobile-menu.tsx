"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/layout/UserAvatar";
import { CUSTOM_NAV_ITEMS, NAV_ACTION_BTN } from "@/components/layout/navbar-links";
import { SocialMediaIconLinks } from "@/components/shared/SocialMediaIconLinks";
import { COMMUNITY_PATH } from "@/lib/community-routes";
import { getSiteSettings } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCategories } from "@/hooks/useCategories";
import { getUserFullName } from "@/lib/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/types/auth";

interface NavbarMobileMenuProps {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

export function NavbarMobileMenu({
  isAuthenticated,
  user,
}: NavbarMobileMenuProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;

    void getSiteSettings()
      .then(setSettings)
      .catch(() => setSettings({}));
  }, [open]);

  const closeMenu = () => setOpen(false);

  const handleSignOut = () => {
    closeMenu();
    signOut();
    toast.success("Sesión cerrada");
    router.push("/");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
        className="flex h-full w-full flex-col gap-0 overflow-hidden border-border bg-neon-surface p-0 sm:max-w-sm"
      >
        <SheetHeader className="shrink-0 border-b border-border/50 px-4 py-4 pr-14">
          <div className="flex items-center gap-3">
            <SheetTitle className="shrink-0 font-heading text-neon-pink dark:text-cyber-yellow">
              Menú
            </SheetTitle>
            <SocialMediaIconLinks
              settings={settings}
              iconClassName="size-4 text-muted-foreground transition-colors duration-200 hover:text-neon-pink! dark:hover:text-cyber-yellow!"
              onlyConfigured
              listClassName="flex items-center gap-2.5"
            />
          </div>
        </SheetHeader>

        <nav
          className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-4 py-4"
          aria-label="Navegación móvil"
        >
          <MobileStoreSection onNavigate={closeMenu} />
          <MobileSection
            title="Carteles Personalizados"
            items={CUSTOM_NAV_ITEMS}
            onNavigate={closeMenu}
          />

          <div className="flex flex-col gap-1">
            <MobileNavLink href="/quienes-somos" onNavigate={closeMenu}>
              Quiénes somos
            </MobileNavLink>
            <MobileNavLink href={COMMUNITY_PATH} onNavigate={closeMenu}>
              Comunidad
            </MobileNavLink>
          </div>

          <div className="mt-auto border-t border-border/50 pt-4">
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-2">
                <div className="mb-2 flex items-center gap-3">
                  <UserAvatar user={user} useNextImageForUpload={false} />
                  <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-semibold text-foreground">
                      {getUserFullName(user)}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <MobileMenuButtonLink href="/perfil" onNavigate={closeMenu}>
                  <User className="size-4" />
                  Mi perfil
                </MobileMenuButtonLink>

                <MobileMenuButtonLink href="/favoritos" onNavigate={closeMenu}>
                  <Heart className="size-4" />
                  Favoritos
                </MobileMenuButtonLink>

                {user.role === "admin" ? (
                  <MobileMenuButtonLink href="/admin" onNavigate={closeMenu}>
                    <LayoutDashboard className="size-4" />
                    Panel admin
                  </MobileMenuButtonLink>
                ) : null}

                <Button
                  variant="ghost"
                  className={cn(
                    NAV_ACTION_BTN,
                    "justify-start text-neon-pink dark:text-cyber-yellow",
                  )}
                  onClick={handleSignOut}
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <MobileMenuButtonLink href="/auth/login" onNavigate={closeMenu}>
                  Iniciar sesión
                </MobileMenuButtonLink>
                <Button
                  variant="outline"
                  className="justify-start rounded-full border-neon-pink/30 hover:border-neon-pink hover:text-neon-pink dark:hover:border-cyber-yellow dark:hover:text-cyber-yellow"
                  asChild
                >
                  <Link href="/auth/registro" onClick={closeMenu}>
                    Registrarse
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

interface NavigateProps {
  onNavigate: () => void;
}

function MobileNavLink({
  href,
  children,
  onNavigate,
}: NavigateProps & {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="nav-link" onClick={onNavigate}>
      {children}
    </Link>
  );
}

function MobileMenuButtonLink({
  href,
  children,
  onNavigate,
}: NavigateProps & {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      className={cn(NAV_ACTION_BTN, "justify-start")}
      asChild
    >
      <Link href={href} onClick={onNavigate}>
        {children}
      </Link>
    </Button>
  );
}

function MobileStoreSection({ onNavigate }: NavigateProps) {
  const { categories, isLoading, error } = useCategories();

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Tienda
      </p>
      <ul className="flex flex-col gap-0.5">
        <li>
          <Link
            href="/productos"
            className="nav-dropdown-item text-xs"
            onClick={onNavigate}
          >
            Ver todos
          </Link>
        </li>
        {isLoading && (
          <li className="px-3 py-2 text-xs text-muted-foreground">
            Cargando…
          </li>
        )}
        {error && (
          <li className="px-3 py-2 text-xs text-muted-foreground">{error}</li>
        )}
        {!isLoading &&
          !error &&
          categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/productos?category=${encodeURIComponent(category.slug)}`}
                className="nav-dropdown-item text-xs"
                onClick={onNavigate}
              >
                {category.name}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

interface MobileSectionProps extends NavigateProps {
  title: string;
  items: { label: string; href: string }[];
}

function MobileSection({ title, items, onNavigate }: MobileSectionProps) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="nav-dropdown-item text-xs"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
