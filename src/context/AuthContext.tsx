"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getStoredAccessToken,
  getStoredAuthUser,
  persistAuth,
  signIn as apiSignIn,
  signOut as apiSignOut,
} from "@/lib/api";
import type { AuthUser, UserRole } from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  role: UserRole | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredAccessToken();
    const storedUser = getStoredAuthUser();

    if (storedToken && storedUser) {
      setAccessToken(storedToken);
      setUser(storedUser);
    }

    setIsLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { session, user: authenticatedUser } = await apiSignIn(
      email.trim().toLowerCase(),
      password,
    );

    const user: AuthUser = {
      ...authenticatedUser,
      phone: authenticatedUser.phone ?? null,
      avatar_url: authenticatedUser.avatar_url ?? null,
    };

    persistAuth(session, user);
    setAccessToken(session.access_token);
    setUser(user);
  }, []);

  const signOut = useCallback(() => {
    apiSignOut();
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      role: user?.role ?? null,
      isAdmin: user?.role === "admin",
      isAuthenticated: Boolean(user && accessToken),
      isLoading,
      signIn,
      signOut,
    }),
    [user, accessToken, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
}
