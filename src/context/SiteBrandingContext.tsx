"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_STORE_NAME } from "@/lib/store-branding";
import {
  getFounderProfile,
  type FounderProfile,
} from "@/lib/site-settings-utils";

interface SiteBrandingContextValue {
  storeName: string;
  founderProfile: FounderProfile;
}

const defaultFounderProfile = getFounderProfile({}, DEFAULT_STORE_NAME);

const SiteBrandingContext = createContext<SiteBrandingContextValue>({
  storeName: DEFAULT_STORE_NAME,
  founderProfile: defaultFounderProfile,
});

interface SiteBrandingProviderProps {
  storeName: string;
  founderProfile: FounderProfile;
  children: ReactNode;
}

export function SiteBrandingProvider({
  storeName,
  founderProfile,
  children,
}: SiteBrandingProviderProps) {
  return (
    <SiteBrandingContext.Provider value={{ storeName, founderProfile }}>
      {children}
    </SiteBrandingContext.Provider>
  );
}

export function useStoreName(): string {
  return useContext(SiteBrandingContext).storeName;
}

export function useFounderProfile(): FounderProfile {
  return useContext(SiteBrandingContext).founderProfile;
}
