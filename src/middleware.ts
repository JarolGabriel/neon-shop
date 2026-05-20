import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdmin } from "./lib/adminAuth";

export async function middleware(request: NextRequest) {
  // 1. Doble verificación de seguridad: Validar que la ruta comience con /api/admin
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    // 2. Ejecutamos tu función guardiana para verificar JWT y Rol en la DB
    const authResult = await verifyAdmin(request);

    // 3. Si el guardián encuentra un error (no hay token, expiró, o no es admin)... ¡REBOTE!
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }
  }

  // 4. Si el token es de un administrador real, se le da luz verde para pasar al endpoint original
  return NextResponse.next();
}

// El Matcher: Le dice a Next.js exactamente a qué URLs aplicarles este guardia
export const config = {
  matcher: "/api/admin/:path*",
};
