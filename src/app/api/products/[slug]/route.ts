import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// 1. Importamos la definición de la Base de Datos y el helper de Tablas
import { Database, Tables } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 2. Le pasamos <Database> a createClient. Ahora Supabase sabe qué tablas existen.
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// 3. Creamos sub-tipos limpios basados en tus filas de la base de datos
type ProductImageRow = Tables<"product_images">;
type ProductVariantRow = Tables<"product_variants">;

// 4. Creamos una interfaz combinada para lo que nuestra query unificada va a devolver
interface ProductWithRelations extends Tables<"products"> {
  images: {
    id: ProductImageRow["id"];
    image_url: ProductImageRow["image_url"];
    alt_text: ProductImageRow["alt_text"];
    is_primary: ProductImageRow["is_primary"];
    display_order: ProductImageRow["display_order"];
  }[];
  variants: {
    id: ProductVariantRow["id"];
    name: ProductVariantRow["name"];
    sku: ProductVariantRow["sku"];
    price: ProductVariantRow["price"];
    stock: ProductVariantRow["stock"];
    size: ProductVariantRow["size"];
    color: ProductVariantRow["color"];
    color_hex: ProductVariantRow["color_hex"];
    is_active: ProductVariantRow["is_active"];
  }[];
}

/**
 * GET /api/products/:slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Supabase hereda el tipo automáticamente gracias al paso 2
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        images: product_images (
          id,
          image_url,
          alt_text,
          is_primary,
          display_order
        ),
        variants: product_variants (
          id,
          name,
          sku,
          price,
          stock,
          size,
          color,
          color_hex,
          is_active
        )
      `,
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      if (error && error.code !== "PGRST116") {
        console.error("Error de base de datos en Supabase:", error);
      }

      return NextResponse.json(
        { error: "Producto no encontrado o no disponible" },
        { status: 404 },
      );
    }

    // Al asignarlo a nuestro tipo compuesto, TypeScript verifica que todo coincida perfectamente
    const product: ProductWithRelations = data;

    // Filtramos las variantes inactivas de forma segura
    // Usamos el operador opcional (?) por si el arreglo viene vacío o nulo
    const activeVariants =
      product.variants?.filter((variant) => variant.is_active === true) || [];

    // Estructuramos la respuesta final manteniendo el tipado estricto
    const responseData = {
      ...product,
      variants: activeVariants,
    };

    return NextResponse.json(
      {
        message: "Producto obtenido correctamente",
        data: responseData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error crítico en GET /api/products/[slug]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la solicitud" },
      { status: 500 },
    );
  }
}
