"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "@/app/components/section-heading";
import Icon from "@/app/components/fa-icon";
import { useLocalizedServices } from "@/app/hooks/use-localized-services";
import { localePath } from "@/app/lib/site";

/**
 * A compact services band on the home page. Without it the root domain is a
 * name and a job title, with no commercial keywords and nothing for a crawler to
 * follow off the home page. Full detail lives on /services; this exists to make
 * the root page useful and to link every sector page from the root domain.
 *
 * Icon only, no illustrations: repeating the /services artwork here would make
 * the homepage a smaller copy of that page. The icon styles already exist in
 * globals.css (.home-band-offer-icon, .home-band-sector svg).
 */
export default function HomeServicesBand() {
  const { t } = useTranslation();
  const { lang = "en" } = useParams<{ lang: string }>();
  const { offers, sectors } = useLocalizedServices();

  return (
    <section className="home-band">
      <div className="home-band-inner">
        <SectionHeading icon={faLayerGroup} title={t("services.title")} id="home-services" />

        <p className="home-band-intro">{t("services.intro")}</p>

        <ul className="home-band-offers">
          {offers.map((offer) => (
            <li key={offer.id}>
              <Link href={localePath(lang, "/services")} className="home-band-offer">
                <span className="home-band-offer-icon" aria-hidden="true">
                  <Icon name={offer.icon} />
                </span>
                <span className="home-band-offer-title">{offer.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        <ul className="home-band-sectors">
          {sectors.map((sector) => (
            <li key={sector.id}>
              <Link href={localePath(lang, sector.path)} className="home-band-sector">
                <Icon name={sector.icon} />
                {sector.name}
              </Link>
            </li>
          ))}
        </ul>

        <Link href={localePath(lang, "/services")} className="inline-link">
          {t("services.sectorsTitle")}
          <Icon name="arrowRight" />
        </Link>
      </div>
    </section>
  );
}
