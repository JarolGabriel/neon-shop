import { NextRequest, NextResponse } from "next/server";
import { CustomDesignsAdminService } from "@/services/custom-designs.service";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const designs = await CustomDesignsAdminService.getAllDesigns();

    return NextResponse.json(
      {
        success: true,
        data: designs,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Error en servicio de diseños:", error);

    return NextResponse.json(
      { success: false, message: "Error interno al procesar la solicitud" },
      { status: 500 },
    );
  }
}
