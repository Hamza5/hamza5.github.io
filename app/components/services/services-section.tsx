"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "@/app/components/section-heading";
import Icon from "@/app/components/fa-icon";
import OfferCard from "@/app/components/services/offer-card";
import SectorCard from "@/app/components/services/sector-card";
import ServiceCta from "@/app/components/services/service-cta";
import { useLocalizedServices } from "@/app/hooks/use-localized-services";
import { localePath } from "@/app/lib/site";

export default function ServicesSection() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const { offers, sectors } = useLocalizedServices();

  return (
    <>
      <section className="services-section">
        <div className="services-container">
          <SectionHeading level={1} icon={faLayerGroup} title={t("services.title")} id="services" />

          <p className="services-intro">{t("services.intro")}</p>

          <div className="offers-grid">
            {offers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          <p className="services-note">{t("services.note")}</p>
        </div>
      </section>

      <section className="services-section services-section--alt">
        <div className="services-container">
          <SectionHeading
            icon={faLayerGroup}
            title={t("services.sectorsTitle")}
            id="sectors"
          />

          <p className="services-intro">{t("services.sectorsIntro")}</p>

          <div className="sectors-grid">
            {sectors.map((sector) => (
              <SectorCard key={sector.id} sector={sector} />
            ))}
          </div>

          <p className="services-crosslink">
            <Link href={localePath(lang, "/case-studies")} className="inline-link">
              {t("services.proofLinkLabel")}
              <Icon name="arrowRight" />
            </Link>
          </p>
        </div>
      </section>

      <ServiceCta />
    </>
  );
}
