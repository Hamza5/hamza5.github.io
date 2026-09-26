"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { faCircleInfo, faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "@/app/components/section-heading";
import Icon from "@/app/components/fa-icon";
import Illustration from "@/app/components/illustration";
import SectorCard from "@/app/components/services/sector-card";
import ServiceCta from "@/app/components/services/service-cta";
import { useLocalizedServices } from "@/app/hooks/use-localized-services";
import { localePath } from "@/app/lib/site";

/**
 * One component drives all five sector pages: the copy, the illustration and
 * the related case studies all come from the data layer, so adding a sector
 * means adding a data entry and a page file, not new markup.
 */
export default function SectorSection({ sectorId }: { sectorId: string }) {
  const { t } = useTranslation();
  const { lang = "en" } = useParams<{ lang: string }>();
  const { sectors, caseStudies } = useLocalizedServices();

  const sector = sectors.find((entry) => entry.id === sectorId);
  if (!sector) return null;

  const related = caseStudies.filter((study) => sector.caseStudyIds.includes(study.id));
  const others = sectors.filter((other) => other.id !== sectorId);

  return (
    <>
      <section className="sector-hero">
        <div className="sector-hero-inner">
          <div className="sector-hero-copy">
            <span className="sector-hero-eyebrow">
              <Icon name={sector.icon} />
              <span>{sector.name}</span>
            </span>
            <h1 className="sector-hero-title">
              {sector.headline}
              <span className="sector-hero-audience"> {sector.audience}</span>
            </h1>
            <p className="sector-hero-intro">{sector.intro}</p>
          </div>
          <div className="sector-hero-media">
            <Illustration
              src={sector.image.src}
              width={sector.image.width}
              height={sector.image.height}
              alt={sector.name}
              aspect="1 / 1"
              priority
            />
          </div>
        </div>
      </section>

      <section className="sector-offers">
        <div className="sector-offers-inner">
          <div className="sector-offer-list">
            {sector.offers.map((offer) => (
              <article key={offer.id} className="sector-offer">
                <h2 className="sector-offer-title">{offer.title}</h2>
                <p className="sector-offer-desc">{offer.description}</p>
              </article>
            ))}
          </div>

          <aside className="sector-proof">
            <span className="sector-proof-icon" aria-hidden="true">
              <Icon name="circleInfo" />
            </span>
            <h2 className="sector-proof-label">{t("services.proofLabel")}</h2>
            <p className="sector-proof-text">{sector.proof}</p>
            {related.length > 0 && (
              <Link
                href={localePath(lang, "/case-studies")}
                className="sector-proof-link"
              >
                <Icon name="diagramProject" />
                <span>{t("services.proofLinkLabel")}</span>
              </Link>
            )}
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="sector-related">
          <div className="sector-related-inner">
            <SectionHeading
              icon={faDiagramProject}
              title={t("caseStudies.title")}
              id="sector-case-studies"
            />
            <ul className="sector-related-list">
              {related.map((study) => (
                <li key={study.id} className="sector-related-item">
                  <Link
                    href={`${localePath(lang, "/case-studies")}#${study.id}`}
                    className="sector-related-link"
                  >
                    {study.screenshot ? (
                      <span className="sector-related-shot">
                        <Image
                          src={study.screenshot.src}
                          alt=""
                          width={study.screenshot.width}
                          height={study.screenshot.height}
                          loading="lazy"
                        />
                      </span>
                    ) : (
                      <span className="sector-related-icon" aria-hidden="true">
                        <Icon name={study.icon} />
                      </span>
                    )}
                    <span className="sector-related-body">
                      <span className="sector-related-title">{study.title}</span>
                      <span className="sector-related-desc">{study.description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="services-section services-section--alt">
        <div className="services-container">
          <SectionHeading
            icon={faCircleInfo}
            title={t("services.sectorsTitle")}
            id="other-sectors"
          />
          <div className="sectors-grid">
            {others.map((other) => (
              <SectorCard key={other.id} sector={other} />
            ))}
          </div>
        </div>
      </section>

      <ServiceCta />
    </>
  );
}
