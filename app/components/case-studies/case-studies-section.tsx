"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "@/app/components/section-heading";
import Icon from "@/app/components/fa-icon";
import ServiceCta from "@/app/components/services/service-cta";
import { useLocalizedServices } from "@/app/hooks/use-localized-services";
import { findSector } from "@/app/data/services";
import { useHashScroll } from "@/app/hooks/use-hash-scroll";
import { localePath } from "@/app/lib/site";

export default function CaseStudiesSection() {
  const { t } = useTranslation();
  const { lang = "en" } = useParams<{ lang: string }>();
  const { caseStudies } = useLocalizedServices();
  // Each card has an id that the sector pages link to.
  useHashScroll();

  return (
    <>
      <section className="cases-section">
        <div className="cases-container">
          <SectionHeading
            level={1}
            icon={faDiagramProject}
            title={t("caseStudies.title")}
            id="case-studies"
          />

          <p className="cases-intro">{t("caseStudies.intro")}</p>

          <div className="cases-grid">
            {caseStudies.map((study) => {
              const sector = findSector(study.sector);
              const projectHref = study.projectIds.length
                ? `${localePath(lang, "/projects")}#${study.projectIds[0]}`
                : null;
              // The in-progress entry uses its name as the badge instead of a heading.
              const heading =
                study.status === "inProgress" ? (
                  <span className="case-card-badge">{study.title}</span>
                ) : (
                  <h2 className="case-card-title">{study.title}</h2>
                );

              return (
                <article
                  key={study.id}
                  id={study.id}
                  className={`case-card ${study.screenshot ? "case-card--shot" : "case-card--icon"}`}
                  data-status={study.status ?? "delivered"}
                >
                  {/* A screenshot stands in for the icon. Cards never show both. */}
                  {study.screenshot ? (
                    <>
                      <div className="case-card-shot">
                        <Image
                          src={study.screenshot.src}
                          alt={study.screenshot.alt}
                          width={study.screenshot.width}
                          height={study.screenshot.height}
                          loading="lazy"
                          className="case-card-shot-img"
                        />
                      </div>
                      {heading}
                    </>
                  ) : (
                    <div className="case-card-head">
                      <span className="case-card-icon" aria-hidden="true">
                        <Icon name={study.icon} />
                      </span>
                      {heading}
                    </div>
                  )}

                  <p className="case-card-desc">{study.description}</p>

                  <div className="case-card-links">
                    {sector && (
                      <Link href={localePath(lang, sector.path)} className="case-card-link">
                        <span className="case-card-sector-label">
                          {t("caseStudies.supportsLabel")}
                        </span>
                        <span className="case-card-sector-name">{study.sectorName}</span>
                        <Icon name="arrowRight" />
                      </Link>
                    )}
                    {projectHref && (
                      <Link href={projectHref} className="case-card-link">
                        <span className="case-card-sector-label">
                          {t("caseStudies.viewProject")}
                        </span>
                        <Icon name="arrowRight" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <ServiceCta />
    </>
  );
}
