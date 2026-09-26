"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin, faStackOverflow } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";
import { profile } from "@/app/data/profile";

const ICONS: Record<string, Parameters<typeof FontAwesomeIcon>[0]["icon"]> = {
  GitHub: faGithub,
  LinkedIn: faLinkedin,
  "Stack Overflow": faStackOverflow,
};

/**
 * Where the social links went when they were taken out of the hero. Kept to the
 * three that show code and professional work, since those are the ones that
 * matter to a prospective client.
 */
export default function SocialRow() {
  const { t } = useTranslation();
  const { lang = "en" } = useParams<{ lang: string }>();

  const links = profile.socialLinks.filter((link) => ICONS[link.label]);

  return (
    <section className="social-row">
      <div className="social-row-inner">
        <h2 className="social-row-title">{t("social.title")}</h2>
        <ul className="social-row-list">
          {links.map((link) => (
            <li key={link.url}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="social-row-link">
                <FontAwesomeIcon
                  icon={ICONS[link.label]}
                  style={{ width: "1.05rem", height: "1.05rem" }}
                />
                <span>{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <Link href={`/${lang}/contact`} className="social-row-more">
          {t("social.more")}
        </Link>
      </div>
    </section>
  );
}
