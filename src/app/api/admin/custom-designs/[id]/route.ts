import { NextRequest, NextResponse } from "next/server";
import { CustomDesignsAdminService } from "@/services/custom-designs.service";
import { UpdateCustomDesignPayload } from "@/types/custom-design";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH: Modificar estado, precio o mockup del diseño
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: UpdateCustomDesignPayload = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "El cuerpo de la petición no puede estar vacío.",
        },
        { status: 400 },
      );
    }

    const updatedDesign = await CustomDesignsAdminService.updateDesign(
      id,
      body,
    );

    if (!updatedDesign) {
      return NextResponse.json(
        {
          success: false,
          message: "Error al actualizar la cotización",
          error: `No se encontró ningún diseño personalizado con el ID proporcionado: ${id}`,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Diseño actualizado con éxito",
        data: updatedDesign,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    // Aquí hacemos la magia: convertimos el error desconocido a algo seguro
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido al actualizar";
    return NextResponse.json(
      {
        success: false,
        message: "Error al actualizar la cotización",
        error: message,
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE: Eliminar permanentemente la solicitud de diseño
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    await CustomDesignsAdminService.deleteDesign(id);

    return NextResponse.json(
      {
        success: true,
        message: `El diseño con ID ${id} ha sido eliminado correctamente.`,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error desconocido al eliminar";
    return NextResponse.json(
      {
        success: false,
        message: "No se pudo eliminar el diseño",
        error: message,
      },
      { status: 500 },
    );
  }
}
