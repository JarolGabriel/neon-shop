import { Button } from "@/components/ui/button";

interface SettingsSaveButtonProps {
  label: string;
  isSaving: boolean;
}

export function SettingsSaveButton({ label, isSaving }: SettingsSaveButtonProps) {
  return (
    <Button
      type="submit"
      className="bg-vite-purple text-white hover:bg-vite-purple/90"
      disabled={isSaving}
    >
      {isSaving ? "Guardando..." : label}
    </Button>
  );
}
