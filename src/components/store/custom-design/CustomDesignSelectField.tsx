"use client";

import { ChevronDownIcon } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NativeSelect } from "@/components/ui/native-select";
import type { SelectOption } from "@/components/store/custom-design/custom-design-options";

interface CustomDesignSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

export function CustomDesignSelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Selecciona una opción",
}: CustomDesignSelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="relative">
            <FormControl>
              <NativeSelect
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                aria-invalid={!!fieldState.error}
              >
                <option value="" disabled>
                  {placeholder}
                </option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
            <ChevronDownIcon
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
