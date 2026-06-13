export interface PolicyLink {
  label: string;
  href: string;
}

export interface PolicyParagraph {
  leadIn?: string;
  text: string;
  links?: PolicyLink[];
}

export type PolicyBlock = string | PolicyParagraph;

export interface PolicySection {
  id: string;
  heading: string;
  paragraphs: PolicyBlock[];
}

function paragraph(
  text: string,
  leadIn?: string,
  links?: PolicyLink[],
): PolicyParagraph {
  return { text, leadIn, links };
}

export function getRefundPolicySections(
  supportEmail = "info@neonshop.com",
): PolicySection[] {
  return [
    {
      id: "devoluciones",
      heading: "Devoluciones",
      paragraphs: [
        "Nuestra política dura 15 días. Si han pasado 15 días desde tu compra, lamentablemente no podemos ofrecerte un reembolso ni un cambio.",
        "Los carteles de neón personalizados son la venta final, no hay devoluciones.",
        "Para ser elegible para una devolución, tu artículo debe estar sin usar y en el mismo estado en que lo recibiste. También debe estar en el embalaje original.",
        "Para completar tu devolución, necesitamos un recibo o prueba de compra que te enviamos por correo o por WhatsApp a la hora de la compra.",
      ],
    },
    {
      id: "reembolsos",
      heading: "Reembolsos (si procede)",
      paragraphs: [
        "Una vez que recibas e inspecciones tu devolución, te enviaremos un correo electrónico para notificarte que hemos recibido tu artículo devuelto. También te notificaremos la aprobación o rechazo de tu reembolso.",
        "Si te aprueban, tu reembolso será procesado y se aplicará automáticamente un crédito a tu tarjeta de crédito o al método original de pago, en un plazo determinado de días.",
      ],
    },
    {
      id: "reembolsos-atrasados",
      heading: "Reembolsos atrasados o perdidos (si procede)",
      paragraphs: [
        "Si aún no has recibido el reembolso, primero revisa tu cuenta bancaria de nuevo.",
        "Luego contacta con la compañía de tu tarjeta de crédito, puede que tarde un tiempo en que tu reembolso se realice oficialmente.",
        "Después, contacta con tu banco. A menudo hay un tiempo de tramitación antes de que se realice el reembolso.",
        `Si has hecho todo esto y aún no has recibido tu reembolso, por favor contáctanos en ${supportEmail}.`,
      ],
    },
    {
      id: "articulos-oferta",
      heading: "Artículos en oferta (si procede)",
      paragraphs: [
        "Solo se pueden reembolsar los artículos a precio normal, pero lamentablemente los artículos en oferta no pueden ser reembolsados.",
      ],
    },
    {
      id: "cambios",
      heading: "Cambios (si procede)",
      paragraphs: [
        `Solo reemplazamos artículos si están defectuosos o dañados. Si necesitas cambiarlo por el mismo artículo, mándanos un correo electrónico a ${supportEmail}.`,
        "Serás responsable de pagar tus propios gastos de envío para devolver tu artículo. Los gastos de envío no son reembolsables. Si recibes un reembolso, el coste del envío de devolución se descontará de tu reembolso.",
        "Dependiendo de dónde vivas, el tiempo que puede tardar en llegar el producto de intercambio puede variar.",
        "Si vas a enviar un artículo por encima de 45 dólares, deberías considerar utilizar un servicio de envío rastreable o contratar un seguro de envío. No garantizamos que vayamos a recibir tu artículo devuelto.",
      ],
    },
  ];
}

export function getShippingPolicySections(): PolicySection[] {
  return [
    {
      id: "informacion-envio",
      heading: "INFORMACIÓN DE ENVÍO",
      paragraphs: [
        paragraph(
          "El tiempo de envío es de 2 a 5 días laborables.",
          "Tiempos de envío:",
        ),
        paragraph("2-5 días laborables.", "Tiempos de producción:"),
        paragraph(
          "Usamos envíos exprés de Zoom o el transportista que tú nos indiques que te sea más fácil.",
        ),
        paragraph(
          "Enviamos carteles LED en todo el país. Cualquier diseño LED que aparezca en nuestra tienda online se puede pedir y enviar a cualquier sitio.",
        ),
        paragraph(
          "Para pedidos internacionales de carteles LED personalizados, por favor rellena el formulario en la página personalizada de nuestra página web y nuestro equipo te ayudará con tu pedido. O utiliza nuestro personalizador para crear tu cartel personalizado ahora mismo.",
          undefined,
          [
            {
              label: "página personalizada",
              href: "/diseno-personalizado",
            },
            { label: "personalizador", href: "/personalizar" },
          ],
        ),
        paragraph(
          "No enviamos carteles de neón de cristal fuera de Caracas, Miranda o La Guaira debido a su naturaleza frágil. Así que algunos de nuestros productos están limitados solo a EE. UU. y Canadá.",
        ),
        paragraph(
          "Cada estado tiene sus propias normas y tasas para los productos enviados a dicho estado. Es importante que conozcas las leyes y tasas de envíos de tu propio estado antes de comprar. Neon Shop no te cobra ninguna de estas tasas ni impuestos, y no podemos pagarlos en tu nombre. Estas tarifas son de tu responsabilidad y no están cubiertas por los gastos de envío que te cobramos. Nuestras tarifas de envío solo cubren el transporte del producto. Si no tienes claro cuáles son las tasas de importación de tu gobierno, probablemente puedas encontrar esa información en línea en la web de tu gobierno o en muchas otras páginas que cubren envíos y logística nacionales.",
          "Tasas de aduana, tasas de importación, derechos e impuestos.",
        ),
      ],
    },
  ];
}

export function getStaticPolicySections(
  slug: string,
  supportEmail?: string,
): PolicySection[] | null {
  if (slug === "devoluciones") {
    return getRefundPolicySections(supportEmail);
  }
  if (slug === "envios") {
    return getShippingPolicySections();
  }
  return null;
}
