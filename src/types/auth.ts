import type { Database } from "@/types/supabase";

export type UserRole = Database["public"]["Enums"]["user_role"];

/** Usuario autenticado tal como lo devuelve POST /api/auth/sign-in */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  shipping_address: ShippingAddress | null;
  role: UserRole;
}

/** Tokens de sesión devueltos por el backend */
export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number | null;
}

export interface SignInResponse {
  message: string;
  session: AuthSession;
  user: AuthUser;
}

export interface SignUpResponse {
  message: string;
  user: Pick<AuthUser, "id" | "email" | "role">;
}
