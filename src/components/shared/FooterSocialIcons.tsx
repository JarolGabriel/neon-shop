import { cn } from "@/lib/utils";
import { SOCIAL_ICON_CLASS } from "@/components/shared/footer-data";
import { buildFooterSocialLinks } from "@/lib/site-settings-utils";

interface FooterSocialIconsProps {
  settings: Record<string, string>;
}

const LINK_CLASS =
  "inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyber-yellow";

export function FooterSocialIcons({ settings }: FooterSocialIconsProps) {
  const socialLinks = buildFooterSocialLinks(settings);

  return (
    <ul className="mt-6 flex items-center gap-4" aria-label="Redes sociales">
      {socialLinks.map(({ label, href, Icon }) => (
        <li key={label}>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className={LINK_CLASS}
            >
              <Icon className={SOCIAL_ICON_CLASS} />
            </a>
          ) : (
            <span
              aria-label={`${label} (enlace no configurado)`}
              title={`${label} — agrega el enlace en Configuración`}
              className={cn(LINK_CLASS, "cursor-default opacity-40")}
            >
              <Icon className={SOCIAL_ICON_CLASS} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
