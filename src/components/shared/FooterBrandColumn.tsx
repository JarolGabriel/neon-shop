import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { FOOTER_LINK_CLASS } from "@/components/shared/footer-data";
import { FooterSocialIcons } from "@/components/shared/FooterSocialIcons";

interface FooterBrandColumnProps {
  supportEmail: string;
  phone: { display: string; href: string } | null;
  address: string | null;
  businessHours: string | null;
  settings: Record<string, string>;
}

export function FooterBrandColumn({
  supportEmail,
  phone,
  address,
  businessHours,
  settings,
}: FooterBrandColumnProps) {
  return (
    <div>
      <h2 className="font-heading text-sm font-bold text-neon-pink">
        Neon Shop
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-neutral-400">
        Iluminando tu mundo con carteles de neón personalizados y ya hechos,
        elaborados con cuidado desde 2024.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-neutral-400">
        Contacta con nosotros por chat en directo, teléfono, correo electrónico
        o redes sociales para cualquier pregunta que tengas.
      </p>
      <ul className="mt-4 space-y-2">
        <li>
          <a
            href={`mailto:${supportEmail}`}
            className={cn(
              "inline-flex items-center gap-2 text-sm underline-offset-2 hover:underline",
              FOOTER_LINK_CLASS,
            )}
          >
            <Mail className="size-4 shrink-0" aria-hidden />
            {supportEmail}
          </a>
        </li>
        {phone ? (
          <li>
            <a
              href={phone.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 text-sm underline-offset-2 hover:underline",
                FOOTER_LINK_CLASS,
              )}
            >
              <Phone className="size-4 shrink-0" aria-hidden />
              WhatsApp: {phone.display}
            </a>
          </li>
        ) : null}
        {address ? (
          <li className="inline-flex items-start gap-2 text-sm text-neutral-400">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{address}</span>
          </li>
        ) : null}
        {businessHours ? (
          <li className="inline-flex items-start gap-2 text-sm text-neutral-400">
            <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span className="whitespace-pre-line">{businessHours}</span>
          </li>
        ) : null}
      </ul>
      <FooterSocialIcons settings={settings} />
    </div>
  );
}
