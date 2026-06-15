import {
  PRODUCT_SIZE_PRESETS,
  PRODUCT_SIZE_PRICE_TIERS,
} from "@/lib/product-size-pricing";

export interface SelectOption {
  value: string;
  label: string;
}

export const SIZE_OPTIONS: SelectOption[] = PRODUCT_SIZE_PRESETS;

/** Solo etiqueta de tamaño (sin precio) — formulario /diseno-personalizado */
export const SIZE_OPTIONS_LABEL_ONLY: SelectOption[] =
  PRODUCT_SIZE_PRICE_TIERS.map((tier) => ({
    value: tier.value,
    label: tier.label,
  }));

export const BUDGET_OPTIONS: SelectOption[] = [
  { value: "40-100", label: "$40 – $100 USD" },
  { value: "150-400", label: "$150 – $400 USD" },
  { value: "400-600", label: "$400 – $600 USD" },
  { value: "600-800", label: "$600 – $800 USD" },
  { value: "800-1000", label: "$800 – $1,000 USD" },
  { value: "1000+", label: "Más de $1,000 USD" },
];

export const PURPOSE_OPTIONS: SelectOption[] = [
  { value: "negocio", label: "Negocio / local comercial" },
  { value: "evento", label: "Evento (boda, fiesta, etc.)" },
  { value: "uso_personal", label: "Uso personal / decoración" },
];

export const MATERIAL_OPTIONS: SelectOption[] = [
  { value: "acrilico_transparente", label: "Acrílico transparente" },
  { value: "acrilico_negro", label: "Acrílico negro" },
  { value: "acrilico_blanco", label: "Acrílico blanco" },
  { value: "otro", label: "Otro material" },
];

export const USAGE_OPTIONS: SelectOption[] = [
  { value: "interior", label: "Interior" },
  { value: "exterior_ip67", label: "Exterior (IP67)" },
];

export const DELIVERY_TIME_OPTIONS: SelectOption[] = [
  { value: "standard", label: "Estándar (producción + envío)" },
  { value: "express", label: "Express (prioridad)" },
];
