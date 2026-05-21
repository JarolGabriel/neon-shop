import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/categories/featured
 *
 * Retorna las categorías destacadas para la página de inicio.
 * Criterio: Primeras 6 categorías activas ordenadas por display_order.
 * Optimización: Resuelve el conteo de productos en una sola consulta
 */
export async function GET() {
  try {
    // 1. Traemos las categorías y contamos sus productos activos EN LA MISMA CONSULTA
    const { data: categories, error } = await supabaseAdmin
      .from("categories")
      .select(
        `
        id,
        name,
        slug,
        description,
        image_url,
        display_order,
        products(count)
      `,
      )
      .eq("is_active", true)
      .eq("products.is_active", true)
      .order("display_order", { ascending: true })
      .limit(6);

    if (error) {
      console.error("Error al obtener categorías destacadas:", error);
      return NextResponse.json(
        { error: "Error al cargar las categorías destacadas" },
        { status: 500 },
      );
    }

    // Si no hay categorías activas
    if (!categories || categories.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    // 2. Mapeamos la respuesta para limpiar el formato que devuelve Supabase

    const categoriesWithCount = categories.map((category: any) => {
      const countData = category.products?.[0] as { count: number } | undefined;

      // Creamos el nuevo objeto sin el array 'products' original
      const { products, ...categoryData } = category;

      return {
        ...categoryData,
        product_count: countData ? countData.count : 0,
      };
    });

    return NextResponse.json({ data: categoriesWithCount }, { status: 200 });
  } catch (error) {
    console.error("Error crítico en /api/categories/featured:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al cargar categorías destacadas" },
      { status: 500 },
    );
  }
}
