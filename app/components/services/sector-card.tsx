"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import Illustration from "@/app/components/illustration";
import Icon from "@/app/components/fa-icon";
import type { LocalizedSector } from "@/app/hooks/use-localized-services";
import { localePath } from "@/app/lib/site";

interface SectorCardProps {
  sector: LocalizedSector;
  /** Heading level, so the card works in a list or as a standalone section. */
  headingLevel?: "h2" | "h3";
}

/**
 * The illustration is the card's mark, as on the offer cards, and is decorative
 * because the heading below it already names the sector.
 */
export default function SectorCard({ sector, headingLevel = "h3" }: SectorCardProps) {
  const { lang } = useParams<{ lang: string }>();
  const { t } = useTranslation();
  const Heading = headingLevel;

  return (
    <Link
      href={localePath(lang, sector.path)}
      className="art-card art-card--sector"
      data-sector={sector.id}
    >
      <Illustration
        src={sector.image.src}
        width={sector.image.width}
        height={sector.image.height}
        alt=""
        aspect="4 / 3"
        className="art-card-art"
      />
      <div className="art-card-body">
        <Heading className="art-card-title">{sector.name}</Heading>
        <p className="art-card-text">{sector.tagline}</p>
        <span className="art-card-cta">
          <span>{t("common.readMore")}</span>
          <Icon name="arrowRight" />
        </span>
      </div>
    </Link>
  );
}
