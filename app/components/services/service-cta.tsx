"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Icon from "@/app/components/fa-icon";
import { localePath, whatsappUrl } from "@/app/lib/site";

/**
 * Closing call to action shared by every business-facing page. WhatsApp is the
 * primary action because that is how local businesses actually start the
 * conversation; the phone number and e-mail are the fallbacks.
 */
export default function ServiceCta({
  title,
  body,
}: {
  title?: string;
  body?: string;
}) {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const phoneHref = `tel:+213542511063`;

  return (
    <section className="service-cta">
      <div className="service-cta-inner">
        <span className="service-cta-icon" aria-hidden="true">
          <Icon name="circleCheck" />
        </span>
        <h2 className="service-cta-title">{title ?? t("common.ctaTitle")}</h2>
        <p className="service-cta-body">{body ?? t("common.ctaBody")}</p>

        <div className="service-cta-actions">
          <a
            href={whatsappUrl(t("common.ctaWhatsapp"))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-whatsapp"
          >
            <Icon name="whatsapp" style={{ width: "1.125rem", height: "1.125rem" }} />
            <span>{t("common.ctaWhatsapp")}</span>
          </a>
          <a href={phoneHref} className="btn-secondary">
            <Icon name="phone" style={{ width: "0.9rem", height: "0.9rem" }} />
            <span>{t("common.ctaCall")}</span>
          </a>
          <a href="mailto:hamza.abbad@gmail.com" className="btn-secondary">
            <Icon name="envelope" style={{ width: "0.9rem", height: "0.9rem" }} />
            <span>{t("common.ctaEmail")}</span>
          </a>
          <Link href={localePath(lang, "/contact")} className="btn-secondary">
            {t("nav.contact")}
          </Link>
        </div>
      </div>
    </section>
  );
}
