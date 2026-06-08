import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const customer_name = formData.get("customer_name") as string;
    const customer_email = formData.get("customer_email") as string;
    const customer_phone = (formData.get("customer_phone") as string) || null;
    const text_content = formData.get("text_content") as string;

    if (!customer_name || !customer_email) {
      return NextResponse.json(
        { error: "El nombre y el correo electrónico son campos obligatorios." },
        { status: 400 },
      );
    }

    if (!text_content || text_content.trim() === "") {
      return NextResponse.json(
        { error: "El texto del diseño es un campo obligatorio." },
        { status: 400 },
      );
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "Es obligatorio enviar la captura del diseño de texto." },
        { status: 400 },
      );
    }

    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.png`;
    const filePath = `custom-text-designs/${fileName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: storageError } = await supabaseAdmin.storage
      .from("product_images")
      .upload(filePath, buffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (storageError) {
      console.error("Error en Supabase Storage:", storageError);
      return NextResponse.json(
        { error: "Error al subir la imagen al servidor de almacenamiento." },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("product_images").getPublicUrl(filePath);

    const preferred_color =
      (formData.get("preferred_color") as string) || null;
    const preferred_size = (formData.get("preferred_size") as string) || null;
    const usage_type = (formData.get("usage_type") as string) || "interior";
    const customer_notes = (formData.get("customer_notes") as string) || null;

    const { data: designData, error: dbError } = await supabaseAdmin
      .from("custom_designs")
      .insert([
        {
          customer_name,
          customer_email,
          customer_phone,
          design_type: "text_design",
          uploaded_file_url: publicUrl,
          text_content: text_content.trim(),
          preferred_color,
          preferred_font: null,
          preferred_size,
          usage_type,
          customer_notes,
          status: "pendiente",
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Error en Base de Datos SQL:", dbError);
      return NextResponse.json(
        {
          error:
            "Error al registrar la solicitud de diseño de texto en la base de datos.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Diseño de texto registrado exitosamente.",
        data: designData,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error crítico en el Servidor:", error);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado en el servidor." },
      { status: 500 },
    );
  }
}
