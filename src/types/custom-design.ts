export type DesignType = "logo_upload" | "text_design";
export type PreferredSize = string | null;
export type CustomDesignStatus =
  | "pendiente"
  | "cotizacion_enviada"
  | "en_produccion"
  | "entregado"
  | "cancelado";

export interface CustomDesign {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  design_type: DesignType;
  uploaded_file_url: string | null;
  text_content: string | null;
  reference_images: string[] | null;
  preferred_size: PreferredSize;
  preferred_color: string | null;
  preferred_font: string | null;
  material: string;
  usage_type: string;
  quantity: number;
  budget_range: string | null;
  purpose: string | null;
  delivery_address: string | null;
  delivery_time: string;
  estimated_price: number | null;
  final_price: number | null;
  mockup_url: string | null;
  status: CustomDesignStatus;
  customer_notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  quoted_at: string | null;
  approved_at: string | null;
}

export interface UploadCustomDesignLogoResponse {
  success: boolean;
  message: string;
  data: CustomDesign;
}

export interface CreateTextDesignPayload {
  file: File;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  text_content: string;
  preferred_color?: string;
  preferred_size?: string;
  usage_type?: string;
  customer_notes?: string;
}

export interface CreateTextDesignResponse {
  success: boolean;
  message: string;
  data: CustomDesign;
}

// Lo que el administrador tiene permitido modificar desde su panel
export interface UpdateCustomDesignPayload {
  status?: CustomDesignStatus;
  final_price?: number;
  mockup_url?: string;
  admin_notes?: string;
}
