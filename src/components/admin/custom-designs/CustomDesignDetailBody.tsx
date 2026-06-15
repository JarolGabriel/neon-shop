"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { CustomDesignStatusBadge } from "@/components/admin/custom-designs/CustomDesignStatusBadge";
import { CustomDesignTypeBadge } from "@/components/admin/custom-designs/CustomDesignTypeBadge";
import {
  getBudgetRangeLabel,
  getDeliveryTimeLabel,
  getMaterialLabel,
  getPreferredSizeLabel,
  getPurposeLabel,
  getUsageTypeLabel,
} from "@/lib/admin-custom-design-labels";
import { formatAdminDateTime } from "@/lib/admin-utils";
import { resolvePublicStorageUrl } from "@/lib/storage-url";
import { buildWhatsAppUrl } from "@/lib/whatsapp-utils";
import { useStoreName } from "@/context/SiteBrandingContext";
import { formatUsd } from "@/lib/utils";
import type { AdminCustomDesign } from "@/types/admin";

interface CustomDesignDetailBodyProps {
  design: AdminCustomDesign;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900 sm:text-right">{value}</span>
    </div>
  );
}

function ImageLink({ url, label }: { url: string; label: string }) {
  const src = resolvePublicStorageUrl(url) ?? url;
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-vite-purple underline"
    >
      {label}
      <ExternalLink className="size-3" />
    </a>
  );
}

export function CustomDesignDetailBody({ design }: CustomDesignDetailBodyProps) {
  const storeName = useStoreName();
  const whatsappUrl = design.customer_phone
    ? buildWhatsAppUrl(
        design.customer_phone,
        `Hola ${design.customer_name}, te contactamos desde ${storeName} sobre tu solicitud de diseño personalizado.`,
      )
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CustomDesignTypeBadge type={design.design_type} />
        <CustomDesignStatusBadge status={design.status} />
      </div>

      <div className="space-y-2 rounded-lg border border-slate-200 p-4 text-sm">
        <p className="font-medium text-slate-900">{design.customer_name}</p>
        <p className="text-slate-600">{design.customer_email}</p>
        <p className="text-slate-600">{design.customer_phone || "—"}</p>
        {whatsappUrl ? (
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm text-vite-purple underline"
          >
            Abrir WhatsApp
          </Link>
        ) : null}
      </div>

      {design.text_content ? (
        <div className="rounded-lg border border-slate-200 p-4 text-sm">
          <p className="mb-1 text-xs font-medium uppercase text-slate-500">
            Texto del diseño
          </p>
          <p className="text-slate-900">{design.text_content}</p>
        </div>
      ) : null}

      <div className="space-y-3 rounded-lg border border-slate-200 p-4 text-sm">
        <DetailRow label="Material" value={getMaterialLabel(design.material)} />
        <DetailRow label="Uso" value={getUsageTypeLabel(design.usage_type)} />
        <DetailRow label="Cantidad" value={design.quantity} />
        <DetailRow
          label="Tamaño preferido"
          value={getPreferredSizeLabel(design.preferred_size)}
        />
        <DetailRow label="Color preferido" value={design.preferred_color ?? "—"} />
        <DetailRow label="Fuente preferida" value={design.preferred_font ?? "—"} />
        <DetailRow label="Presupuesto" value={getBudgetRangeLabel(design.budget_range)} />
        <DetailRow label="Propósito" value={getPurposeLabel(design.purpose)} />
        <DetailRow
          label="Tiempo de entrega"
          value={getDeliveryTimeLabel(design.delivery_time)}
        />
        <DetailRow
          label="Dirección de entrega"
          value={design.delivery_address ?? "—"}
        />
      </div>

      <div className="space-y-2 text-sm">
        {design.uploaded_file_url ? (
          <ImageLink url={design.uploaded_file_url} label="Ver archivo subido" />
        ) : null}
        {design.reference_images?.map((url, index) => (
          <ImageLink
            key={`${url}-${index}`}
            url={url}
            label={`Referencia ${index + 1}`}
          />
        ))}
        {design.mockup_url ? (
          <ImageLink url={design.mockup_url} label="Ver mockup" />
        ) : null}
      </div>

      {design.customer_notes ? (
        <div className="rounded-lg border border-slate-200 p-4 text-sm">
          <p className="mb-1 text-xs font-medium uppercase text-slate-500">
            Notas del cliente
          </p>
          <p className="text-slate-700">{design.customer_notes}</p>
        </div>
      ) : null}

      <div className="space-y-2 border-t border-slate-200 pt-4 text-sm">
        <DetailRow
          label="Precio estimado"
          value={
            design.estimated_price != null
              ? formatUsd(design.estimated_price)
              : "—"
          }
        />
        <DetailRow
          label="Precio final"
          value={
            design.final_price != null ? formatUsd(design.final_price) : "—"
          }
        />
        <DetailRow
          label="Creada"
          value={formatAdminDateTime(design.created_at)}
        />
        <DetailRow
          label="Cotizada"
          value={
            design.quoted_at ? formatAdminDateTime(design.quoted_at) : "—"
          }
        />
      </div>
    </div>
  );
}
