"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "@/app/components/section-heading";
import Icon from "@/app/components/fa-icon";
import { profile } from "@/app/data/profile";
import { useLocalizedProfile } from "@/app/hooks/use-localized-profile";
import { whatsappUrl } from "@/app/lib/site";

/**
 * One card shape for every contact method, so the icon treatment is identical
 * everywhere: a real column beside the text when there is room, centred above a
 * centred title when there is not.
 */
function ContactCard({
  icon,
  label,
  value,
  hint,
  href,
  primary,
}: {
  icon: string;
  label: string;
  value: string;
  hint?: string;
  href?: string;
  primary?: boolean;
}) {
  const body = (
    <>
      <span className="icon-card-icon" aria-hidden="true">
        <Icon name={icon} />
      </span>
      <span className="icon-card-body">
        <span className="icon-card-label">{label}</span>
        <span className="icon-card-value">{value}</span>
        {hint && <span className="icon-card-hint">{hint}</span>}
      </span>
    </>
  );

  const className = `icon-card${primary ? " icon-card--primary" : ""}`;

  if (href) {
    const external = href.startsWith("http");
    return (
      <a
        href={href}
        className={className}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {body}
      </a>
    );
  }

  return <div className={className}>{body}</div>;
}

export default function ContactSection() {
  const { t } = useTranslation();
  const { location, languages } = useLocalizedProfile();

  const phone = profile.contact.phones[0];
  const email = profile.contact.emails[0];

  return (
    <>
      <section className="contact-section">
        <div className="contact-container">
          <SectionHeading level={1} icon={faComments} title={t("contact.title")} id="contact" />
          <p className="contact-intro">{t("contact.intro")}</p>

          <div className="contact-grid">
            <ContactCard
              icon="whatsapp"
              label={t("contact.whatsappLabel")}
              value={phone.label}
              hint={t("contact.whatsappHint")}
              href={whatsappUrl(t("common.ctaWhatsapp"))}
              primary
            />
            <ContactCard
              icon="phone"
              label={t("contact.phoneLabel")}
              value={phone.label}
              href={`tel:+${phone.number}`}
            />
            <ContactCard
              icon="envelope"
              label={t("contact.emailLabel")}
              value={email}
              href={`mailto:${email}`}
            />
            <ContactCard
              icon="locationDot"
              label={t("contact.locationLabel")}
              value={`${location.district}, ${location.city}, ${location.country}`}
            />
          </div>
        </div>
      </section>

      <section className="contact-section contact-section--alt">
        <div className="contact-container">
          <h2 className="contact-subtitle">{t("contact.ctaTitle")}</h2>
          <p className="contact-intro">{t("contact.ctaBody")}</p>

          <div className="contact-actions">
            <a
              href={whatsappUrl(t("common.ctaWhatsapp"))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-whatsapp"
            >
              <Icon name="whatsapp" style={{ width: "1.125rem", height: "1.125rem" }} />
              <span>{t("common.ctaWhatsapp")}</span>
            </a>
            <a href={`tel:+${phone.number}`} className="btn-secondary">
              <Icon name="phone" style={{ width: "0.9rem", height: "0.9rem" }} />
              <span>{t("common.ctaCall")}</span>
            </a>
            <a href={`mailto:${email}`} className="btn-secondary">
              <Icon name="envelope" style={{ width: "0.9rem", height: "0.9rem" }} />
              <span>{t("common.ctaEmail")}</span>
            </a>
          </div>

          <h2 className="contact-subtitle">{t("contact.languagesLabel")}</h2>
          <ul className="contact-languages">
            {languages.map((language) => (
              <li key={language.id} className="contact-language">
                <Image
                  src={language.flagSrc}
                  alt=""
                  width={24}
                  height={16}
                  className="contact-language-flag"
                />
                <span>{language.name}</span>
              </li>
            ))}
          </ul>

          <h2 className="contact-subtitle">{t("contact.socialLabel")}</h2>
          <ul className="contact-social">
            {profile.socialLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
