import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CUSTOM_SIGNS_LINKS,
  FOOTER_LINK_CLASS,
  NEON_SIGNS_LINKS,
  SOCIAL_ICON_CLASS,
  SUPPORT_LINKS,
  type FooterLinkItem,
} from "@/components/shared/footer-data";
import { SOCIAL_LINKS } from "@/components/shared/footer-icons";

interface FooterColumnLinksProps {
  title: string;
  links: FooterLinkItem[];
}

function FooterColumnLinks({ title, links }: FooterColumnLinksProps) {
  const headingId = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <nav aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="font-heading text-sm font-bold text-neon-pink"
      >
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className={cn("text-sm", FOOTER_LINK_CLASS)}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function FooterBrandColumn() {
  return (
    <div>
      <h2 className="font-heading text-sm font-bold text-neon-pink">
        Neon Shop
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-neutral-400">
        Iluminando tu mundo con carteles de neón personalizados y ya hechos,
        elaborados con cuidado desde 2014.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-neutral-400">
        Contacta con nosotros por chat en directo, teléfono, correo electrónico
        o redes sociales para cualquier pregunta que tengas.
      </p>
      <ul className="mt-4 space-y-2">
        <li>
          <a
            href="mailto:info@neonmfg.com"
            className={cn(
              "inline-flex items-center gap-2 text-sm underline-offset-2 hover:underline",
              FOOTER_LINK_CLASS,
            )}
          >
            <Mail className="size-4 shrink-0" aria-hidden />
            info@neonmfg.com
          </a>
        </li>
        <li>
          <a
            href="tel:1-888-574-6941"
            className={cn(
              "inline-flex items-center gap-2 text-sm underline-offset-2 hover:underline",
              FOOTER_LINK_CLASS,
            )}
          >
            <Phone className="size-4 shrink-0" aria-hidden />
            Llama o envía un mensaje de texto: 1-888-574-6941
          </a>
        </li>
      </ul>
      <ul className="mt-6 flex items-center gap-4" aria-label="Redes sociales">
        {SOCIAL_LINKS.map(({ label, href, Icon }) => (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyber-yellow"
            >
              <Icon className={SOCIAL_ICON_CLASS} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#121214] text-neutral-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          <FooterBrandColumn />
          <FooterColumnLinks
            title="Carteles de neón personalizados"
            links={CUSTOM_SIGNS_LINKS}
          />
          <FooterColumnLinks title="Carteles de neón" links={NEON_SIGNS_LINKS} />
          <FooterColumnLinks title="Menú de apoyo" links={SUPPORT_LINKS} />
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-6">
          <p className="text-sm text-neutral-500">
            © Fábrica Neón 2026... Impulsado por Neon Shop
          </p>
        </div>
      </div>
    </footer>
  );
}
