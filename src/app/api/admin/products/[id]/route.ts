// /home/jarol/projects/neon-shop/src/app/api/admin/products/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

interface VariantUpdateInput {
  id?: string;
  name: string;
  sku: string;
  price?: number;
  stock?: number;
  is_active?: boolean;
  size?: string;
  color?: string;
  color_hex?: string;
}

function sanitizeColorHex(hex: unknown): string | null {
  if (typeof hex !== "string" || !hex.trim()) return null;
  const normalized = hex.trim();
  return /^#[0-9A-Fa-f]{6}$/.test(normalized) ? normalized : null;
}

function parseAvailableSizes(input: unknown): string[] {
  if (Array.isArray(input)) {
    return [
      ...new Set(
        input
          .filter((value): value is string => typeof value === "string")
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ];
  }

  if (typeof input === "string" && input.trim()) {
    try {
      return parseAvailableSizes(JSON.parse(input));
    } catch {
      return [];
    }
  }

  return [];
}

function parseAvailableColors(
  input: unknown,
): Array<{ label: string; hex: string }> {
  let raw: unknown = input;

  if (typeof input === "string" && input.trim()) {
    try {
      raw = JSON.parse(input);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(raw)) return [];

  const map = new Map<string, { label: string; hex: string }>();

  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const record = item as { label?: unknown; hex?: unknown };
    const label = typeof record.label === "string" ? record.label.trim() : "";
    const hex = sanitizeColorHex(record.hex);
    if (!label || !hex) continue;
    map.set(hex.toLowerCase(), { label, hex });
  }

  return [...map.values()];
}

/**
 * PUT /api/admin/products/:id
 * Actualiza los datos de un producto específico y sincroniza sus variantes
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 1. VALIDACIÓN: Verificar si el producto existe en la base de datos
    const { data: existingProduct, error: findError } = await supabaseAdmin
      .from("products")
      .select("id, slug, price")
      .eq("id", id)
      .single();

    if (findError || !existingProduct) {
      return NextResponse.json(
        { error: "El producto que intenta actualizar no existe" },
        { status: 404 },
      );
    }

    // 2. VALIDACIÓN DE SLUG: Evitar duplicados si decide cambiarlo
    if (body.slug && body.slug !== existingProduct.slug) {
      const { data: duplicateSlugProduct } = await supabaseAdmin
        .from("products")
        .select("id")
        .eq("slug", body.slug)
        .neq("id", id)
        .maybeSingle();

      if (duplicateSlugProduct) {
        return NextResponse.json(
          {
            error: `El slug '${body.slug}' ya está siendo usado por otro producto`,
          },
          { status: 400 },
        );
      }
    }

    // 3. CONSTRUCCIÓN DEL OBJETO DE ACTUALIZACIÓN DEL PRODUCTO
    const updateData: Record<string, unknown> = {};
    const allowedFields = [
      "name",
      "slug",
      "description",
      "short_description",
      "price",
      "compare_at_price",
      "size",
      "color",
      "voltage",
      "material",
      "stock",
      "sku",
      "is_active",
      "is_featured",
      "is_best_seller",
      "category_id",
      "available_sizes",
      "available_colors",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "available_sizes") {
          updateData[field] = parseAvailableSizes(body[field]);
        } else if (field === "available_colors") {
          updateData[field] = parseAvailableColors(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    updateData["updated_at"] = new Date().toISOString();

    // 4. EJECUCIÓN: Actualizar el producto base
    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error de Supabase al actualizar producto:", updateError);
      return NextResponse.json(
        {
          error: "Error al actualizar el producto base",
          details: updateError.message,
        },
        { status: 400 },
      );
    }

    // 5. GESTIÓN Y SINCRONIZACIÓN DE VARIANTES (Opcional en el body)
    let finalVariants = null;

    if (body.variants && Array.isArray(body.variants)) {
      const incomingVariants: VariantUpdateInput[] = body.variants;

      // A. Identificar IDs que sobreviven para borrar los que el admin quitó
      const activeIncomingIds = incomingVariants
        .map((v) => v.id)
        .filter((variantId): variantId is string => !!variantId);

      // B. Eliminar de la DB las variantes del producto que NO estén en la petición
      if (activeIncomingIds.length > 0) {
        await supabaseAdmin
          .from("product_variants")
          .delete()
          .eq("product_id", id)
          .not("id", "in", `(${activeIncomingIds.join(",")})`);
      } else {
        // Si mandó el arreglo vacío, significa que el admin eliminó todas las variantes
        await supabaseAdmin
          .from("product_variants")
          .delete()
          .eq("product_id", id);
      }

      // C. Separar las variantes en dos grupos: Nuevas (insert) y Existentes (update)
      const basePrice = (updateData.price as number) || existingProduct.price;

      const inserts = incomingVariants
        .filter((v) => !v.id)
        .map((v) => ({
          product_id: id,
          name: v.name,
          sku: v.sku,
          price: v.price ?? basePrice,
          stock: v.stock ?? 0,
          is_active: v.is_active ?? true,
          size: v.size ?? null,
          color: v.color ?? null,
          color_hex: sanitizeColorHex(v.color_hex),
        }));

      const updates = incomingVariants.filter((v) => v.id);

      // D. Ejecutar inserción de las nuevas
      if (inserts.length > 0) {
        const { error: insertErr } = await supabaseAdmin
          .from("product_variants")
          .insert(inserts);

        if (insertErr) {
          console.error(
            "Error al insertar nuevas variantes en el PUT:",
            insertErr,
          );
          return NextResponse.json(
            { error: `Error al crear nuevas variantes: ${insertErr.message}` },
            { status: 400 },
          );
        }
      }

      // E. Ejecutar actualización de las existentes una por una
      for (const variant of updates) {
        const { error: variantUpdateErr } = await supabaseAdmin
          .from("product_variants")
          .update({
            name: variant.name,
            sku: variant.sku,
            price: variant.price ?? basePrice,
            stock: variant.stock ?? 0,
            is_active: variant.is_active ?? true,
            size: variant.size ?? null,
            color: variant.color ?? null,
            color_hex: sanitizeColorHex(variant.color_hex),
          })
          .eq("id", variant.id)
          .eq("product_id", id); // Validación de seguridad: que pertenezca al producto

        if (variantUpdateErr) {
          console.error(
            `Error al actualizar la variante ${variant.id}:`,
            variantUpdateErr,
          );
          return NextResponse.json(
            {
              error: `Error al actualizar variante: ${variantUpdateErr.message}`,
            },
            { status: 400 },
          );
        }
      }

      // F. Traer el estado final de las variantes guardadas para responderle al cliente
      const { data: currentVariants } = await supabaseAdmin
        .from("product_variants")
        .select("*")
        .eq("product_id", id);

      finalVariants = currentVariants;
    }

    // 6. RESPUESTA EXITOSA INTEGRAL
    return NextResponse.json(
      {
        message: "Producto y variantes actualizados correctamente",
        data: updatedProduct,
        variants: finalVariants,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error crítico en PUT /api/admin/products/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la actualización" },
      { status: 500 },
    );
  }
}

/**

 * DELETE /api/admin/products/:id

 * Elimina un producto, sus registros de imágenes y sus archivos físicos en el Storage

 */

export async function DELETE(
  request: Request,

  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 1. VALIDACIÓN: Verificar si el producto existe antes de hacer nada

    const { data: product, error: findError } = await supabaseAdmin

      .from("products")

      .select("id")

      .eq("id", id)

      .single();

    if (findError || !product) {
      return NextResponse.json(
        { error: "El producto que intenta eliminar no existe" },

        { status: 404 },
      );
    }

    // 2. OBTENER IMÁGENES ASOCIADAS: Buscamos los registros en 'product_images'

    const { data: images } = await supabaseAdmin

      .from("product_images")

      .select("image_url")

      .eq("product_id", id);

    // 3. LIMPIEZA DEL STORAGE: Si el producto tenía imágenes, las borramos físicamente

    if (images && images.length > 0) {
      const filesToRemove = images

        .map((img) => {
          const urlParts = img.image_url.split("/product_images/");

          return urlParts[1];
        })

        .filter(Boolean);

      if (filesToRemove.length > 0) {
        const { error: storageError } = await supabaseAdmin.storage

          .from("product_images")

          .remove(filesToRemove);

        if (storageError) {
          console.error(
            "Advertencia: No se pudieron borrar los archivos del Storage:",

            storageError,
          );

          // Nota de producción: A veces no querrás detener el flujo si el archivo ya no existía en Storage,

          // pero lo dejamos logueado para auditoría.
        }
      }
    }

    // 4. ELIMINACIÓN EN BASE DE DATOS: Borramos el producto

    // Nota: Si tu tabla 'product_images' no tiene CASCADE, borramos primero las imágenes a mano aquí:

    await supabaseAdmin.from("product_images").delete().eq("product_id", id);

    const { error: deleteError } = await supabaseAdmin

      .from("products")

      .delete()

      .eq("id", id);

    if (deleteError) {
      console.error(
        "Error al eliminar el producto en PostgreSQL:",

        deleteError,
      );

      return NextResponse.json(
        { error: "No se pudo eliminar el producto de la base de datos" },

        { status: 400 },
      );
    }

    // 5. RESPUESTA EXITOSA

    return NextResponse.json(
      { message: "Producto y sus recursos asociados eliminados correctamente" },

      { status: 200 },
    );
  } catch (error) {
    console.error("Error crítico en DELETE /api/admin/products/[id]:", error);

    return NextResponse.json(
      { error: "Error interno del servidor al procesar la eliminación" },

      { status: 500 },
    );
  }
}
