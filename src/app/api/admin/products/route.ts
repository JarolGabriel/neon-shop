// /home/jarol/projects/neon-shop/src/app/api/admin/products/route.ts

import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Definición de interfaz estricta para la creación de variantes vís POST
interface VariantInput {
  name: string;
  sku: string;
  price?: number;
  stock?: number;
  is_active?: boolean;
}

// --- GET: Listar productos con filtros, paginación y variantes ---
export async function GET(request: NextRequest) {
  try {
    // 1. Capturar la URL y extraer los Query Params
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const category_id = searchParams.get("category_id") || "";
    const stock_status = searchParams.get("stock_status") || "";
    const id = searchParams.get("id") || "";

    // Calcular rangos matemáticos para el .range() de Supabase
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 2. INICIAR LA QUERY BASE DE SUPABASE (Incluyendo product_variants sin filtros de estado)
    let query = supabaseAdmin.from("products").select(
      `
        *,
        categories (name, slug),
        product_images (id, image_url, is_primary, alt_text),
        product_variants (*)
      `,
      { count: "exact" },
    );

    // 3. CONSTRUCCIÓN DINÁMICA DE FILTROS
    if (id) {
      query = query.eq("id", id);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (category_id) {
      query = query.eq("category_id", category_id);
    }

    if (stock_status === "out_of_stock") {
      query = query.eq("stock", 0);
    } else if (stock_status === "low_stock") {
      query = query.lte("stock", 3).gt("stock", 0);
    } else if (stock_status === "in_stock") {
      query = query.gt("stock", 3);
    }

    // 4. ORDENAMIENTO Y PAGINACIÓN
    const {
      data: products,
      error,
      count,
    } = await query.order("created_at", { ascending: false }).range(from, to);

    if (error) {
      console.error("Error de Supabase al listar productos admin:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);

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

// --- POST: Crear un nuevo producto con soporte Multi-Imagen y Variantes ---
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // 1. EXTRAER CAMPOS DEL FORM DATA
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

    // Datos de imágenes
    const imageFiles = formData.getAll("image") as File[];
    const alt_text = (formData.get("alt_text") as string) || name;

    // NUEVO: Extraer la cadena de texto de variantes
    const variantsStr = formData.get("variants") as string;

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

    // Parseos estrictos
    const price = parseFloat(priceStr);
    const compare_at_price = compareAtPriceStr
      ? parseFloat(compareAtPriceStr)
      : null;
    const stock = stockStr ? parseInt(stockStr, 10) : 0;
    const is_active = is_active_str !== "false";
    const is_featured = is_featured_str === "true";

    // Procesar variantes si se enviaron en la petición
    let parsedVariants: VariantInput[] = [];
    if (variantsStr) {
      try {
        parsedVariants = JSON.parse(variantsStr);
        if (!Array.isArray(parsedVariants)) {
          return NextResponse.json(
            { error: "El campo 'variants' debe ser un arreglo JSON válido." },
            { status: 400 },
          );
        }
      } catch (e) {
        return NextResponse.json(
          { error: "El formato de 'variants' no es un JSON válido." },
          { status: 400 },
        );
      }
    }

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

    // 4. FLUJO MULTI-IMAGEN: Guardar imágenes en Storage y en la tabla 'product_images'
    const uploadedImages = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileExtension = file.name.split(".").pop();
      const fileName = `${slug}-${Date.now()}-${i}.${fileExtension}`;
      const filePath = `products/${fileName}`;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

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

      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from("product_images").getPublicUrl(filePath);

      const isPrimaryImage = i === 0;

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

    // NUEVO: 5. INSERCIÓN DE VARIANTES (Si existen en la petición)
    const createdVariants = [];
    if (parsedVariants.length > 0) {
      // Mapeamos el arreglo agregando de forma obligatoria el id del producto recién creado
      const variantsToInsert = parsedVariants.map((v) => ({
        product_id: productData.id,
        name: v.name,
        sku: v.sku,
        price: v.price ?? price, // Si la variante no tiene precio propio, hereda el del producto
        stock: v.stock ?? 0,
        is_active: v.is_active ?? true,
      }));

      const { data: variantsData, error: variantsError } = await supabaseAdmin
        .from("product_variants")
        .insert(variantsToInsert)
        .select();

      if (variantsError) {
        console.error(
          "Error al insertar variantes, iniciando rollback de limpieza...",
          variantsError,
        );

        // Mecanismo de seguridad: Si fallan las variantes, eliminamos el producto para no dejar datos corruptos
        await supabaseAdmin.from("products").delete().eq("id", productData.id);

        return NextResponse.json(
          {
            error: `Error en la creación de variantes: ${variantsError.message}. Registro cancelado.`,
          },
          { status: 400 },
        );
      }

      if (variantsData) {
        createdVariants.push(...variantsData);
      }
    }

    // 6. RESPUESTA EXITOSA CON VARIANTES INCLUIDAS
    return NextResponse.json(
      {
        message: `Producto creado con éxito. Se procesaron ${uploadedImages.length} imágenes y ${createdVariants.length} variantes.`,
        product: productData,
        images: uploadedImages,
        variants: createdVariants,
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
