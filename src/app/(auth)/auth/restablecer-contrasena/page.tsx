"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

function ResetPasswordFallback() {
  return (
    <AuthShell title="Restablecer contraseña">
      <div className="flex justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
