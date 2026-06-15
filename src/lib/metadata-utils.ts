import type { Metadata } from "next";
import { formatPageTitle } from "@/lib/store-branding";
import { getStoreNameFromDb } from "@/lib/site-settings-server";

interface PageMetadataOptions {
  description?: string;
  openGraph?: Metadata["openGraph"];
  robots?: Metadata["robots"];
}

export function buildPageMetadata(
  pageTitle: string,
  storeName: string,
  options?: PageMetadataOptions,
): Metadata {
  const title = formatPageTitle(pageTitle, storeName);

  return {
    title,
    description: options?.description,
    openGraph: options?.openGraph
      ? { ...options.openGraph, title }
      : undefined,
    robots: options?.robots,
  };
}

export async function getDefaultPageMetadata(
  pageTitle: string,
  options?: PageMetadataOptions,
): Promise<Metadata> {
  const storeName = await getStoreNameFromDb();
  return buildPageMetadata(pageTitle, storeName, options);
}
