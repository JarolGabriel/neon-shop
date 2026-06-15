"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  ADMIN_UNAUTHORIZED_MESSAGE,
  ADMIN_UNAUTHORIZED_TITLE,
  isAdminUnauthorizedError,
} from "@/lib/admin-auth-messages";

interface AdminErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function AdminErrorBanner({ message, onRetry }: AdminErrorBannerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const isUnauthorized = isAdminUnauthorizedError(message);
  const loginHref = `/auth/login?redirect=${encodeURIComponent(pathname)}`;

  const handleSignInAgain = () => {
    signOut();
    router.push(loginHref);
  };

  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {isUnauthorized ? (
        <>
          <p className="font-semibold text-red-800">{ADMIN_UNAUTHORIZED_TITLE}</p>
          <p>{ADMIN_UNAUTHORIZED_MESSAGE}</p>
        </>
      ) : (
        <p>{message}</p>
      )}

      <div className="flex flex-wrap gap-2">
        {isUnauthorized ? (
          <Button
            size="sm"
            onClick={handleSignInAgain}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Iniciar sesión
          </Button>
        ) : null}
        {onRetry ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-red-200 bg-white"
          >
            Reintentar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
