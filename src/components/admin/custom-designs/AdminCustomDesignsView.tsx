"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AdminErrorBanner } from "@/components/admin/AdminErrorBanner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CustomDesignDetailSheet } from "@/components/admin/custom-designs/CustomDesignDetailSheet";
import { CustomDesignsFilters } from "@/components/admin/custom-designs/CustomDesignsFilters";
import { CustomDesignsTable } from "@/components/admin/custom-designs/CustomDesignsTable";
import { Button } from "@/components/ui/button";
import { useAdminCustomDesigns } from "@/hooks/useAdminCustomDesigns";
import { CUSTOM_DESIGN_STATUSES } from "@/lib/schemas/admin-custom-design";
import type { AdminCustomDesign } from "@/types/admin";
import type { CustomDesignStatus } from "@/types/custom-design";

function isValidStatus(value: string | null): value is CustomDesignStatus {
  return CUSTOM_DESIGN_STATUSES.includes(value as CustomDesignStatus);
}

export function AdminCustomDesignsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    designs,
    isLoading,
    isSaving,
    error,
    refresh,
    updateDesign,
    deleteDesign,
  } = useAdminCustomDesigns();

  const [search, setSearch] = useState("");
  const [selectedDesign, setSelectedDesign] = useState<AdminCustomDesign | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const statusFilter = useMemo(() => {
    const param = searchParams.get("status");
    return isValidStatus(param) ? param : "all";
  }, [searchParams]);

  const filteredDesigns = useMemo(() => {
    const query = search.trim().toLowerCase();

    return designs.filter((design) => {
      if (statusFilter !== "all" && design.status !== statusFilter) {
        return false;
      }

      if (!query) return true;

      return (
        design.customer_name.toLowerCase().includes(query) ||
        design.customer_email.toLowerCase().includes(query)
      );
    });
  }, [designs, search, statusFilter]);

  const replaceQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const openDesign = useCallback(
    (design: AdminCustomDesign) => {
      setSelectedDesign(design);
      setSheetOpen(true);
      replaceQuery({ id: design.id });
    },
    [replaceQuery],
  );

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSelectedDesign(null);
      replaceQuery({ id: null });
    }
  };

  useEffect(() => {
    const designId = searchParams.get("id");
    if (!designId || designs.length === 0) return;

    const design = designs.find((item) => item.id === designId);
    if (design) {
      setSelectedDesign(design);
      setSheetOpen(true);
    }
  }, [designs, searchParams]);

  useEffect(() => {
    if (selectedDesign) {
      const fresh = designs.find((item) => item.id === selectedDesign.id);
      if (fresh) setSelectedDesign(fresh);
    }
  }, [designs, selectedDesign?.id]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Diseños personalizados"
        description="Solicitudes de logo y texto enviadas desde la tienda."
      />

      {error ? (
        <AdminErrorBanner message={error} onRetry={() => void refresh()} />
      ) : null}

      <CustomDesignsFilters
        search={search}
        status={statusFilter}
        onSearchChange={setSearch}
        onStatusChange={(value) =>
          replaceQuery({ status: value === "all" ? null : value })
        }
        onClear={() => {
          setSearch("");
          replaceQuery({ status: null, id: null });
        }}
      />

      <CustomDesignsTable
        designs={filteredDesigns}
        isLoading={isLoading}
        onViewDesign={openDesign}
      />

      <CustomDesignDetailSheet
        design={selectedDesign}
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        isSaving={isSaving}
        onSave={updateDesign}
        onDelete={deleteDesign}
      />
    </div>
  );
}
