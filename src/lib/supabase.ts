import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import {
  supabaseAdmin,
  supabaseAnonServer,
} from "@/lib/supabase-server-client";

export { supabaseAdmin, supabaseAnonServer };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Cliente anon para el browser (tienda pública). */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getAuthUserFromToken(
  token: string | null | undefined,
): Promise<User | null> {
  if (!token) return null;

  const {
    data: { user },
    error,
  } = await supabaseAnonServer.auth.getUser(token);

  if (error || !user) return null;
  return user;
}
