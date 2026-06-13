"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createAdminSetting,
  getAdminSettings,
  patchAdminSetting,
} from "@/lib/api";

interface SettingUpdate {
  key: string;
  value: string;
  description?: string;
}

interface UseAdminSettingsResult {
  settings: Record<string, string>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  saveSettings: (updates: SettingUpdate[]) => Promise<void>;
}

export function useAdminSettings(): UseAdminSettingsResult {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [existingKeys, setExistingKeys] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAdminSettings();
      setSettings(response.data);
      setExistingKeys(new Set(Object.keys(response.data)));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar la configuración",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const upsertSetting = useCallback(
    async (update: SettingUpdate) => {
      const value = update.value.trim();

      if (existingKeys.has(update.key)) {
        await patchAdminSetting(update.key, value);
        return;
      }

      await createAdminSetting({
        key: update.key,
        value,
        description: update.description,
      });
      setExistingKeys((current) => new Set(current).add(update.key));
    },
    [existingKeys],
  );

  const saveSettings = useCallback(
    async (updates: SettingUpdate[]) => {
      setIsSaving(true);

      try {
        for (const update of updates) {
          await upsertSetting(update);
        }

        setSettings((current) => {
          const next = { ...current };
          updates.forEach((update) => {
            next[update.key] = update.value.trim();
          });
          return next;
        });

        toast.success("Configuración guardada");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo guardar la configuración";
        toast.error(message);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [upsertSetting],
  );

  return {
    settings,
    isLoading,
    isSaving,
    error,
    refresh,
    saveSettings,
  };
}
