import { Resend } from "resend";
import { getResendFromAddress } from "@/lib/auth-emails";
import { DEFAULT_STORE_NAME } from "@/lib/store-branding";
import { getStoreNameFromDb } from "@/lib/site-settings-server";

const ACCENT = "#fcee0a";
const PINK = "#ff007a";

export interface OrderEmailLineItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  variant_label: string;
  notes: string | null;
}

export interface OrderEmailPayload {
  orderNum: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  subtotal_usd: number;
  savings_usd: number;
  total_usd: number;
  items: OrderEmailLineItem[];
}

function emailShell(content: string, storeName: string): string {
  const brand = storeName.trim() || DEFAULT_STORE_NAME;
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1f1f24; color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #2e2e2e;">
      <div style="padding: 28px 24px 16px; text-align: center; border-bottom: 1px solid #2e2e2e;">
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: ${ACCENT};">⚡ ${brand}</p>
      </div>
      <div style="padding: 24px;">
        ${content}
      </div>
    </div>
  `;
}

function buildItemsTableHtml(items: OrderEmailLineItem[]): string {
  const rows = items
    .map((item) => {
      const lineTotal = item.unit_price * item.quantity;
      return `
        <tr>
          <td style="padding: 12px 8px; border-bottom: 1px solid #2e2e2e; color: #e5e7eb;">
            <strong>${item.product_name}</strong>
            ${item.variant_label ? `<br/><span style="color: #9ca3af; font-size: 12px;">${item.variant_label}</span>` : ""}
            ${item.notes ? `<br/><span style="color: #fbbf24; font-size: 12px;">Nota: ${item.notes}</span>` : ""}
          </td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #2e2e2e; text-align: center; color: #e5e7eb;">${item.quantity}</td>
          <td style="padding: 12px 8px; border-bottom: 1px solid #2e2e2e; text-align: right; color: #e5e7eb;">$${lineTotal.toFixed(2)}</td>
        </tr>`;
    })
    .join("");

  return `
    <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
      <thead>
        <tr>
          <th style="padding: 8px; text-align: left; color: #9ca3af; font-size: 12px; border-bottom: 1px solid #2e2e2e;">Producto</th>
          <th style="padding: 8px; text-align: center; color: #9ca3af; font-size: 12px; border-bottom: 1px solid #2e2e2e;">Cant.</th>
          <th style="padding: 8px; text-align: right; color: #9ca3af; font-size: 12px; border-bottom: 1px solid #2e2e2e;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function buildTotalsHtml(payload: OrderEmailPayload): string {
  const savingsRow =
    payload.savings_usd > 0
      ? `<p style="margin: 0 0 8px; color: #9ca3af;">Subtotal: $${payload.subtotal_usd.toFixed(2)} USD</p>
         <p style="margin: 0 0 8px; color: ${PINK};">Ahorro multi-letrero: -$${payload.savings_usd.toFixed(2)} USD</p>`
      : "";

  return `
    ${savingsRow}
    <p style="margin: 0; font-size: 18px; font-weight: 700; color: ${ACCENT};">
      Total: $${payload.total_usd.toFixed(2)} USD
    </p>`;
}

export function buildCustomerReceiptEmailHtml(
  payload: OrderEmailPayload,
  storeName: string = DEFAULT_STORE_NAME,
): string {
  return emailShell(`
    <p style="margin: 0 0 8px; font-size: 18px; font-weight: 600; color: #ffffff;">
      ¡Gracias por tu pedido, ${payload.customer_name}!
    </p>
    <p style="margin: 0 0 16px; line-height: 1.6; color: #9ca3af;">
      Tu orden <strong style="color: ${ACCENT};">#${payload.orderNum}</strong> fue registrada correctamente.
      Coordinaremos el pago contigo por WhatsApp.
    </p>
    <p style="margin: 0 0 8px; color: #9ca3af; font-size: 13px;">
      📍 ${payload.delivery_city} — ${payload.delivery_address}<br/>
      📱 ${payload.customer_phone}
    </p>
    ${buildItemsTableHtml(payload.items)}
    ${buildTotalsHtml(payload)}
    <p style="margin: 24px 0 0; line-height: 1.6; color: #6b7280; font-size: 13px;">
      Si tienes dudas, responde a este correo o escríbenos por WhatsApp.
    </p>
  `, storeName);
}

export function buildAdminOrderEmailHtml(
  payload: OrderEmailPayload,
  storeName: string = DEFAULT_STORE_NAME,
): string {
  return emailShell(`
    <p style="margin: 0 0 8px; font-size: 18px; font-weight: 700; color: ${PINK};">
      🚨 Nueva orden #${payload.orderNum}
    </p>
    <p style="margin: 0 0 16px; line-height: 1.6; color: #e5e7eb;">
      <strong>Cliente:</strong> ${payload.customer_name}<br/>
      <strong>Email:</strong> ${payload.customer_email}<br/>
      <strong>Teléfono:</strong> ${payload.customer_phone}<br/>
      <strong>Entrega:</strong> ${payload.delivery_city} — ${payload.delivery_address}
    </p>
    ${buildItemsTableHtml(payload.items)}
    ${buildTotalsHtml(payload)}
    <p style="margin: 16px 0 0; color: #9ca3af; font-size: 13px;">
      Estado: pendiente de pago. Contacta al cliente por WhatsApp para confirmar.
    </p>
  `, storeName);
}

export async function sendOrderEmails(
  resend: Resend,
  payload: OrderEmailPayload,
  supportEmail: string,
): Promise<{ customerOk: boolean; adminOk: boolean }> {
  let customerOk = false;
  let adminOk = false;
  const [fromAddress, storeName] = await Promise.all([
    getResendFromAddress(),
    getStoreNameFromDb(),
  ]);

  const { error: customerError } = await resend.emails.send({
    from: fromAddress,
    to: payload.customer_email,
    replyTo: supportEmail.includes("@") ? supportEmail : undefined,
    subject: `✨ Recibo de pedido #${payload.orderNum} — ${storeName}`,
    html: buildCustomerReceiptEmailHtml(payload, storeName),
  });

  if (customerError) {
    console.error("Error enviando recibo al cliente:", customerError);
  } else {
    customerOk = true;
  }

  if (supportEmail.includes("@")) {
    const { error: adminError } = await resend.emails.send({
      from: fromAddress,
      to: supportEmail,
      replyTo: payload.customer_email,
      subject: `🚨 Nueva orden #${payload.orderNum} — ${payload.customer_name}`,
      html: buildAdminOrderEmailHtml(payload, storeName),
    });

    if (adminError) {
      console.error("Error enviando alerta al admin:", adminError);
    } else {
      adminOk = true;
    }
  } else {
    console.error("support_email no configurado en site_settings");
  }

  return { customerOk, adminOk };
}
