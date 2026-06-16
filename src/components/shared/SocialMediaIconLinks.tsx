import { cn } from "@/lib/utils";
import { SOCIAL_ICON_CLASS } from "@/components/shared/footer-data";
import { buildFooterSocialLinks } from "@/lib/site-settings-utils";

interface SocialMediaIconLinksProps {
  settings: Record<string, string>;
  iconClassName?: string;
  onlyConfigured?: boolean;
  className?: string;
  listClassName?: string;
}

const LINK_CLASS =
  "inline-flex rounded-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyber-yellow";

export function SocialMediaIconLinks({
  settings,
  iconClassName = SOCIAL_ICON_CLASS,
  onlyConfigured = false,
  className,
  listClassName = "flex items-center gap-4",
}: SocialMediaIconLinksProps) {
  const socialLinks = buildFooterSocialLinks(settings);
  const links = onlyConfigured
    ? socialLinks.filter((link) => link.href)
    : socialLinks;

  if (links.length === 0) return null;

  return (
    <ul
      className={cn(listClassName, className)}
      aria-label="Redes sociales"
    >
      {links.map(({ label, href, Icon }) => (
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
              <Icon className={iconClassName} />
            </a>
          ) : (
            <span
              aria-label={`${label} (enlace no configurado)`}
              title={`${label} — agrega el enlace en Configuración`}
              className={cn(LINK_CLASS, "cursor-default opacity-40")}
            >
              <Icon className={iconClassName} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
