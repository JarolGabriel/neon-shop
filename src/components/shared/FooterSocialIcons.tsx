import { SocialMediaIconLinks } from "@/components/shared/SocialMediaIconLinks";
import { SOCIAL_ICON_CLASS } from "@/components/shared/footer-data";

interface FooterSocialIconsProps {
  settings: Record<string, string>;
}

export function FooterSocialIcons({ settings }: FooterSocialIconsProps) {
  return (
    <SocialMediaIconLinks
      settings={settings}
      iconClassName={SOCIAL_ICON_CLASS}
      listClassName="mt-6 flex items-center gap-4"
    />
  );
}
