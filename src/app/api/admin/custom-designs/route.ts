import { NextRequest, NextResponse } from "next/server";
import { CustomDesignsAdminService } from "@/services/custom-designs.service";

export async function GET(request: NextRequest) {
  try {
    // Nota del Tech Lead: Aquí en el futuro inyectarás la validación de sesión de adminAuth
    const designs = await CustomDesignsAdminService.getAllDesigns();

    return NextResponse.json(
      {
        success: true,
        data: designs,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    // Protegemos el error para que TypeScript no se queje del 'any'
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido al obtener cotizaciones";

    return NextResponse.json(
      {
        success: false,
        message: "Fallo al obtener las cotizaciones del administrador",
        error: message,
      },
      { status: 500 },
    );
  }
}
