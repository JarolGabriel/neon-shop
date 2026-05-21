import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// --- GET: Listar productos con filtros y paginación ---
export async function GET(request: NextRequest) {
  try {
    // 1. Capturar la URL y extraer los Query Params
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const category_id = searchParams.get("category_id") || "";
    const stock_status = searchParams.get("stock_status") || "";
    const id = searchParams.get("id") || ""; // NUEVO: Capturar el parámetro id

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

    // 3. CONSTRUCCIÓN DINÁMICA DE FILTROS (Estilo LEGO)
    // NUEVO: Si viene un ID específico, filtramos directamente por él (máxima prioridad)
    if (id) {
      query = query.eq("id", id);
    }

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

// --- POST: Crear un nuevo producto con soporte Multi-Imagen (form-data) ---
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // 1. EXTRAER ABSOLUTAMENTE TODOS LOS CAMPOS DEL FORM DATA
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const short_description = formData.get("short_description") as string;
    const priceStr = formData.get("price") as string;
    const compareAtPriceStr = formData.get("compare_at_price") as string;

    // Especificaciones técnicas de Neón
    const size = formData.get("size") as string;
    const color = formData.get("color") as string;
    const voltage = formData.get("voltage") as string;
    const material = formData.get("material") as string;

    // Inventario y Estados
    const stockStr = formData.get("stock") as string;
    const sku = formData.get("sku") as string;
    const category_id = formData.get("category_id") as string;
    const is_active_str = formData.get("is_active") as string;
    const is_featured_str = formData.get("is_featured") as string;

    // Datos del arreglo de imágenes
    const imageFiles = formData.getAll("image") as File[];
    const alt_text = (formData.get("alt_text") as string) || name;

    // 2. VALIDACIONES OBLIGATORIAS
    if (!name || !slug || !priceStr || !category_id) {
      return NextResponse.json(
        {
          error: "Los campos name, slug, price y category_id son obligatorios.",
        },
        { status: 400 },
      );
    }

    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json(
        { error: "Debes subir al menos una imagen para el producto." },
        { status: 400 },
      );
    }

    // Parseos estricto de tipos de datos
    const price = parseFloat(priceStr);
    const compare_at_price = compareAtPriceStr
      ? parseFloat(compareAtPriceStr)
      : null;
    const stock = stockStr ? parseInt(stockStr, 10) : 0;
    const is_active = is_active_str !== "false";
    const is_featured = is_featured_str === "true";

    // 3. PRIMER PASO DE BASE DE DATOS: Insertar el producto en la tabla 'products'
    const { data: productData, error: productError } = await supabaseAdmin
      .from("products")
      .insert([
        {
          name,
          slug,
          description,
          short_description,
          price,
          compare_at_price,
          size,
          color,
          voltage,
          material,
          stock,
          sku,
          is_active,
          is_featured,
          display_order: 0,
          category_id,
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

    // 4. FLUJO MULTI-IMAGEN: Ahora que 'productData.id' existe, iteramos el arreglo
    const uploadedImages = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];

      // Nombre de archivo único usando el índice para evitar colisiones en Storage
      const fileExtension = file.name.split(".").pop();
      const fileName = `${slug}-${Date.now()}-${i}.${fileExtension}`;
      const filePath = `products/${fileName}`;

      // Convertir archivo a Buffer para Supabase Storage
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // A. Subir el archivo al Storage
      const { error: storageError } = await supabaseAdmin.storage
        .from("product_images")
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (storageError) {
        console.error(
          `Error al subir la imagen [${i}] al Storage:`,
          storageError,
        );
        continue;
      }

      // B. Obtener su URL pública permanente
      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from("product_images").getPublicUrl(filePath);

      // C. Regla de negocio: la primera imagen del arreglo (índice 0) se marca como de portada
      const isPrimaryImage = i === 0;

      // D. Guardar la relación en la tabla 'product_images' enlazada al ID del producto creado
      const { data: imageData, error: imageTableError } = await supabaseAdmin
        .from("product_images")
        .insert([
          {
            product_id: productData.id,
            image_url: publicUrl,
            alt_text: `${alt_text} - Foto ${i + 1}`,
            is_primary: isPrimaryImage,
            display_order: i,
          },
        ])
        .select()
        .single();

      if (!imageTableError && imageData) {
        uploadedImages.push(imageData);
      }
    }

    // 5. RESPUESTA ULTRA-PROFESIONAL CON TODA LA DATA REGISTRADA
    return NextResponse.json(
      {
        message: `Producto creado con éxito. Se procesaron ${uploadedImages.length} imágenes.`,
        product: productData,
        images: uploadedImages,
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
