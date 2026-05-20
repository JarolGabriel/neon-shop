import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// --- GET: Listar TODAS las categorías para el panel de administración ---
export async function GET() {
  try {
    // Hacemos la consulta a Supabase apuntando a la tabla 'categories'
    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error de Supabase al listar categorías:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Respondemos con la lista completa y un estatus 200 OK
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error catastrófico en el GET de categorías admin:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al obtener las categorías" },
      { status: 500 },
    );
  }
}

// --- POST: Crear una nueva categoría con Imagen Física (form-data) ---
export async function POST(request: NextRequest) {
  try {
    // 1. Leer los datos en formato Form Data
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const display_order_str = formData.get("display_order") as string;
    const is_active_str = formData.get("is_active") as string;

    // Archivo físico de la imagen de la categoría
    const imageFile = formData.get("image") as File | null;

    // 2. VALIDACIÓN: Campos críticos obligatorios
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Los campos 'name' y 'slug' son obligatorios." },
        { status: 400 },
      );
    }

    if (!imageFile) {
      return NextResponse.json(
        { error: "Debes subir una imagen obligatoriamente para la categoría." },
        { status: 400 },
      );
    }

    const display_order = display_order_str
      ? parseInt(display_order_str, 10)
      : 0;
    const is_active = is_active_str !== "false"; // Por defecto true

    // 3. STORAGE: Subir la imagen de la categoría a Supabase Storage
    const fileExtension = imageFile.name.split(".").pop();
    const fileName = `${slug}-${Date.now()}.${fileExtension}`;
    const filePath = `categories/${fileName}`;

    // Convertir el archivo a Buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir al bucket (Asegúrate de tener un bucket público llamado 'category_images' o usa 'product_images' si compartes bucket)
    const { data: storageData, error: storageError } =
      await supabaseAdmin.storage
        .from("product_images") // 💡 TIP: Puedes usar el mismo bucket de productos para no complicarte con las políticas RLS ahora
        .upload(filePath, buffer, {
          contentType: imageFile.type,
          cacheControl: "3600",
          upsert: false,
        });

    if (storageError) {
      console.error(
        "Error al subir imagen de categoría al Storage:",
        storageError,
      );
      return NextResponse.json(
        {
          error: `Error al subir la imagen de la categoría: ${storageError.message}`,
        },
        { status: 500 },
      );
    }

    // Obtener la URL pública de la imagen
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("product_images").getPublicUrl(filePath);

    // 4. INSERCIÓN EN BASE DE DATOS: Tabla 'categories'
    // Según tu Notion, la tabla categories tiene directamente la columna 'image_url'
    const { data: categoryData, error: categoryError } = await supabaseAdmin
      .from("categories")
      .insert([
        {
          name,
          slug,
          description,
          image_url: publicUrl, // Aquí guardamos la URL física que acabamos de crear
          display_order,
          is_active,
        },
      ])
      .select()
      .single();

    if (categoryError) {
      console.error("Error al crear categoría en DB:", categoryError);
      return NextResponse.json(
        { error: categoryError.message },
        { status: 400 },
      );
    }

    // 5. RESPUESTA EXITOSA
    return NextResponse.json(
      {
        message: "Categoría creada con éxito con su imagen física",
        category: categoryData,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error catastrófico en el POST de categorías admin:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la solicitud" },
      { status: 500 },
    );
  }
}
