"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import ContactQrModal from "./contact-qr-modal";
import Icon from "./fa-icon";
import { localePath, whatsappUrl } from "@/app/lib/site";

/**
 * Two calls to action, both commercial. GitHub, LinkedIn and Stack Overflow
 * used to sit here too, which made the hero a wall of buttons; they now live
 * with the rest of the social links at the bottom of the home page, and on the
 * contact page.
 */
export default function HeroActions() {
  const [qrOpen, setQrOpen] = useState(false);
  const { t } = useTranslation();
  const { lang = "en" } = useParams<{ lang: string }>();

  return (
    <>
      <div className="entrance-5 flex flex-wrap items-center justify-center gap-3">
        <Link href={localePath(lang, "/services")} className="btn-primary">
          <Icon name="briefcase" style={{ width: "1.05rem", height: "1.05rem" }} />
          <span>{t("nav.services")}</span>
        </Link>

        <a
          href={whatsappUrl(t("common.ctaWhatsapp"))}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary btn-whatsapp"
        >
          <Icon name="whatsapp" style={{ width: "1.125rem", height: "1.125rem" }} />
          <span>{t("common.ctaWhatsapp")}</span>
        </a>

        <button onClick={() => setQrOpen(true)} className="btn-secondary btn-qr">
          <FontAwesomeIcon icon={faQrcode} style={{ width: "1rem", height: "1rem" }} />
          <span>{t("hero.shareContact")}</span>
        </button>
      </div>

      <ContactQrModal isOpen={qrOpen} onClose={() => setQrOpen(false)} />
    </>
  );
}
