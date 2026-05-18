import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// --- GET: Listar productos con filtros y paginación ---
export async function GET(request: Request) {
  try {
    // 1. Capturar la URL y extraer los Query Params
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const category_id = searchParams.get("category_id") || "";
    const stock_status = searchParams.get("stock_status") || "";

    // Calcular rangos matemáticos para el .range() de Supabase
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 2. INICIAR LA QUERY BASE DE SUPABASE
    let query = supabaseAdmin.from("products").select(
      `
        *,
        categories (name, slug),
        product_images (id, image_url, is_primary, alt_text)
      `,
      { count: "exact" },
    );

    // 3.CONSTRUCCIÓN DINÁMICA DE FILTROS (Estilo LEGO)
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Filtro B: Por Categoría específica
    if (category_id) {
      query = query.eq("category_id", category_id);
    }

    // Filtro C: Por Estado del Inventario
    if (stock_status === "out_of_stock") {
      query = query.eq("stock", 0);
    } else if (stock_status === "low_stock") {
      query = query.lte("stock", 3).gt("stock", 0);
    } else if (stock_status === "in_stock") {
      query = query.gt("stock", 3);
    }

    // 4. ORDENAMIENTO Y PAGINACIÓN
    // Los ordenamos por fecha de creación (los más nuevos primero) y aplicamos el rango de página
    const {
      data: products,
      error,
      count,
    } = await query.order("created_at", { ascending: false }).range(from, to);

    if (error) {
      console.error("Error de Supabase al listar productos admin:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 5. CÁLCULO DE METADATOS PARA EL FRONTEND
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    // 6. RESPUESTA ULTRA-PROFESIONAL
    return NextResponse.json(
      {
        data: products,
        meta: {
          total_items: totalItems,
          page,
          limit,
          total_pages: totalPages,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error catastrófico en el GET de productos admin:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al obtener los productos" },
      { status: 500 },
    );
  }
}

// --- POST: Crear un nuevo producto con Imagen Física (form-data) ---
export async function POST(request: Request) {
  try {
    // 1. Leer los datos en formato Form Data (para archivos y textos)
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const stockStr = formData.get("stock") as string;
    const category_id = formData.get("category_id") as string;
    const short_description = formData.get("short_description") as string;
    const size = formData.get("size") as string;
    const is_active_str = formData.get("is_active") as string;

    // Datos exclusivos de la imagen
    const imageFile = formData.get("image") as File | null;
    const alt_text = (formData.get("alt_text") as string) || name;
    const is_primary = formData.get("is_primary") === "true";

    // 2. VALIDACIÓN: Verificar campos obligatorios del producto
    if (!name || !slug || !priceStr || !category_id) {
      return NextResponse.json(
        {
          error: "Los campos name, slug, price y category_id son obligatorios.",
        },
        { status: 400 },
      );
    }

    if (!imageFile) {
      return NextResponse.json(
        { error: "Debes subir una imagen obligatoriamente para el producto." },
        { status: 400 },
      );
    }

    const price = parseFloat(priceStr);
    const stock = stockStr ? parseInt(stockStr, 10) : 0;
    const is_active = is_active_str !== "false"; // Por defecto true a menos que envíen "false"

    // 3. FLUJO DE STORAGE: Subir el archivo físico al Bucket de Supabase
    // Creamos un nombre de archivo único para evitar colisiones en el Storage
    const fileExtension = imageFile.name.split(".").pop();
    const fileName = `${slug}-${Date.now()}.${fileExtension}`;
    const filePath = `products/${fileName}`;

    // Convertir el archivo a Buffer para que Supabase lo pueda procesar
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Subir al bucket 'product_images'
    const { data: storageData, error: storageError } =
      await supabaseAdmin.storage
        .from("product_images")
        .upload(filePath, buffer, {
          contentType: imageFile.type,
          cacheControl: "3600",
          upsert: false,
        });

    if (storageError) {
      console.error("Error al subir imagen al Storage:", storageError);
      return NextResponse.json(
        { error: `Error al subir la imagen: ${storageError.message}` },
        { status: 500 },
      );
    }

    // Obtener la URL pública de la imagen recién subida
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("product_images").getPublicUrl(filePath);

    // 4. INSERCIÓN EN BASE DE DATOS: Tabla 'products'
    const { data: productData, error: productError } = await supabaseAdmin
      .from("products")
      .insert([
        {
          name,
          slug,
          description,
          price,
          stock,
          short_description,
          size,
          category_id,
          is_active,
          display_order: 0,
        },
      ])
      .select()
      .single();

    if (productError) {
      console.error("Error al crear producto en DB:", productError);

      return NextResponse.json(
        { error: productError.message },
        { status: 400 },
      );
    }

    // 5. RELACIÓN DE IMAGEN: Insertar la URL en la tabla 'product_images'
    const { error: imageTableError } = await supabaseAdmin
      .from("product_images")
      .insert([
        {
          product_id: productData.id,
          image_url: publicUrl,
          alt_text,
          is_primary,
          display_order: 0,
        },
      ]);

    if (imageTableError) {
      console.error("Error al registrar imagen en DB:", imageTableError);
      return NextResponse.json(
        {
          error: `Producto creado, pero falló el registro de la imagen: ${imageTableError.message}`,
        },
        { status: 400 },
      );
    }

    // 6. RESPUESTA EXITOSA: Retornamos el producto completo enriquecido con su nueva imagen
    return NextResponse.json(
      {
        message: "Producto e imagen creados con éxito",
        product: productData,
        image_url: publicUrl,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error catastrófico en el POST de administración:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la solicitud" },
      { status: 500 },
    );
  }
}
