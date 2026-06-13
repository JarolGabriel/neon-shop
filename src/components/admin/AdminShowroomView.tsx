"use client";

import { useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ModerationTabs } from "@/components/admin/moderation/ModerationTabs";
import { Button } from "@/components/ui/button";
import { useAdminModeration } from "@/hooks/useAdminModeration";
import { useWindowFocusRefresh } from "@/hooks/useWindowFocusRefresh";

export function AdminShowroomView() {
  const { pending, published, isLoading, error, refresh, moderate } =
    useAdminModeration();

  const handleRefresh = useCallback(() => {
    void refresh();
  }, [refresh]);

  useWindowFocusRefresh(handleRefresh);

  const handleModerate = async (
    targetType: "review" | "comment",
    targetId: string,
    action: "approve" | "reject",
  ) => {
    await moderate({ target_type: targetType, target_id: targetId, action });
  };

  const handleDeletePublished = async (
    targetType: "review" | "comment",
    targetId: string,
  ) => {
    await moderate({
      target_type: targetType,
      target_id: targetId,
      action: "delete",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader
          title="Comunidad Neon"
          description="Modera publicaciones e instalaciones compartidas por los clientes."
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="shrink-0 border-slate-200 bg-white"
        >
          <RefreshCw
            className={`size-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>

      {error ? (
        <div className="flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refresh()}
            className="border-red-200 bg-white"
          >
            Reintentar
          </Button>
        </div>
      ) : null}

      <ModerationTabs
        pending={pending}
        published={published}
        isLoading={isLoading}
        onModerate={handleModerate}
        onDeletePublished={handleDeletePublished}
      />
    </div>
  );
}
