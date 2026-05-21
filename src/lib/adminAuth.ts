import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "./supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function verifyAdmin(req: NextRequest) {
  // 1. Extraer la cabecera Authorization
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "No autorizado. Token faltante.", status: 401 };
  }

  const token = authHeader.split(" ")[1];

  // 2. Este cliente público SOLO lo usamos para verificar si el JWT es real y válido
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return { error: "Token inválido o expirado.", status: 401 };
  }

  // 3. EL CAMBIO CLAVE: Usamos supabaseAdmin (Service Role) para leer la tabla profiles.
  // Como este cliente corre en el servidor, se salta el RLS y puede ver el rol real de forma segura.
  const { data: profile, error: dbError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (dbError || !profile || profile.role !== "admin") {
    return {
      error: "Acceso denegado. Se requieren permisos de administrador.",
      status: 403,
    };
  }

  // Si todo está perfecto, devolvemos el usuario
  return { user, error: null };
}
