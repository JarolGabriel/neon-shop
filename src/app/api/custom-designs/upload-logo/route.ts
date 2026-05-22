import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase"; // Tu cliente centralizado con Service Role

export async function POST(request: NextRequest) {
  try {
    // 1. Extraer el FormData de la petición usando NextRequest
    const formData = await request.formData();

    // 2. Extraer y validar los campos requeridos del cliente
    const customer_name = formData.get("customer_name") as string;
    const customer_email = formData.get("customer_email") as string;
    const customer_phone = formData.get("customer_phone") as string;

    if (!customer_name || !customer_email) {
      return NextResponse.json(
        { error: "El nombre y el correo electrónico son campos obligatorios." },
        { status: 400 },
      );
    }

    // 3. Extraer el archivo físico (Logo)
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { error: "Es obligatorio subir un logotipo o boceto de diseño." },
        { status: 400 },
      );
    }

    // 4. Generar un nombre único para el archivo en el Storage
    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
    const filePath = `custom-logos/${fileName}`;

    // Convertir el archivo a Buffer para Supabase Storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. Subir el archivo usando tu instancia de supabaseAdmin
    const { data: storageData, error: storageError } =
      await supabaseAdmin.storage
        .from("product_images") // Tu bucket público existente
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

    if (storageError) {
      console.error("Error en Supabase Storage:", storageError);
      return NextResponse.json(
        { error: "Error al subir la imagen al servidor de almacenamiento." },
        { status: 500 },
      );
    }

    // 6. Obtener la URL pública utilizando tu supabaseAdmin
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("product_images").getPublicUrl(filePath);

    // 7. Recolectar las especificaciones técnicas en español provenientes del formulario
    const preferred_size = (formData.get("preferred_size") as string) || null;
    const budget_range = (formData.get("budget_range") as string) || null;
    const purpose = (formData.get("purpose") as string) || null;
    const delivery_address =
      (formData.get("delivery_address") as string) || null;
    const material =
      (formData.get("material") as string) || "acrilico_transparente";
    const usage_type = (formData.get("usage_type") as string) || "interior";
    const delivery_time =
      (formData.get("delivery_time") as string) || "standard";
    const customer_notes = (formData.get("customer_notes") as string) || null;

    // 8. Insertar el registro definitivo en la tabla utilizando supabaseAdmin
    const { data: designData, error: dbError } = await supabaseAdmin
      .from("custom_designs")
      .insert([
        {
          customer_name,
          customer_email,
          customer_phone,
          design_type: "logo_upload",
          uploaded_file_url: publicUrl,
          preferred_size,
          budget_range,
          purpose,
          delivery_address,
          material,
          usage_type,
          delivery_time,
          customer_notes,
          status: "pendiente", // Coincide con nuestro CHECK de la base de datos
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Error en Base de Datos SQL:", dbError);
      return NextResponse.json(
        {
          error:
            "Error al registrar la solicitud de cotización en la base de datos.",
        },
        { status: 500 },
      );
    }

    // 9. Respuesta exitosa para el cliente en el Frontend
    return NextResponse.json(
      {
        success: true,
        message: "Diseño personalizado registrado exitosamente.",
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
