import { supabaseAdmin } from "@/lib/supabase";
import { CustomDesign, UpdateCustomDesignPayload } from "@/types/custom-design";

export class CustomDesignsAdminService {
  /**
   * GET: Obtener todas las solicitudes de diseño personalizado
   * Ordenadas por la fecha de creación más reciente de forma predeterminada
   */
  static async getAllDesigns(): Promise<CustomDesign[]> {
    const { data, error } = await supabaseAdmin
      .from("custom_designs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error en base de datos: ${error.message}`);
    }

    return data as CustomDesign[];
  }

  /**
   * PATCH: Actualizar parcialmente una cotización (Precio, Estado, Mockup)
   */
  static async updateDesign(
    id: string,
    payload: UpdateCustomDesignPayload,
  ): Promise<CustomDesign | null> {
    // Agregamos de forma automática el timestamp de actualización
    const updateData = {
      ...payload,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("custom_designs")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(`Error al actualizar el diseño: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data[0] as CustomDesign;
  }

  /**
   * DELETE: Eliminar permanentemente un diseño por ID
   */
  static async deleteDesign(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from("custom_designs")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Error al eliminar el diseño: ${error.message}`);
    }

    return true;
  }
}
