import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdmin } from "./lib/adminAuth";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    const authResult = await verifyAdmin(request);

    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/admin/:path*",
};
