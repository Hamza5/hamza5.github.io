"use client";

import { useTranslation } from "react-i18next";
import { offers, sectors, caseStudies } from "@/app/data/services";
import type { OfferEntry, SectorEntry, CaseStudyEntry } from "@/app/data/services";

export interface LocalizedOffer extends OfferEntry {
  title: string;
  description: string;
}

export interface LocalizedSectorOffer {
  id: string;
  title: string;
  description: string;
}

export interface LocalizedSector extends SectorEntry {
  name: string;
  tagline: string;
  headline: string;
  audience: string;
  intro: string;
  proof: string;
  offers: LocalizedSectorOffer[];
}

export interface LocalizedCaseStudy extends CaseStudyEntry {
  title: string;
  description: string;
  sectorName: string;
}

export function useLocalizedServices() {
  const { t } = useTranslation();

  const localizedOffers: LocalizedOffer[] = offers.map((offer) => ({
    ...offer,
    title: t(`services.offers.${offer.id}.title`),
    description: t(`services.offers.${offer.id}.description`),
  }));

  const localizedSectors: LocalizedSector[] = sectors.map((sector) => ({
    ...sector,
    name: t(`services.sectors.${sector.id}.name`),
    tagline: t(`services.sectors.${sector.id}.tagline`),
    headline: t(`services.sectors.${sector.id}.headline`),
    audience: t(`services.sectors.${sector.id}.audience`),
    intro: t(`services.sectors.${sector.id}.intro`),
    proof: t(`services.sectors.${sector.id}.proof`),
    offers: sectorOfferIds(sector.id).map((id) => ({
      id,
      title: t(`services.sectors.${sector.id}.offers.${id}.title`),
      description: t(`services.sectors.${sector.id}.offers.${id}.description`),
    })),
  }));

  const localizedCaseStudies: LocalizedCaseStudy[] = caseStudies.map((entry) => ({
    ...entry,
    title: t(`caseStudies.items.${entry.id}.title`),
    description: t(`caseStudies.items.${entry.id}.description`),
    sectorName: t(`services.sectors.${entry.sector}.name`),
  }));

  return { offers: localizedOffers, sectors: localizedSectors, caseStudies: localizedCaseStudies };
}

/**
 * Offer ids per sector, in the order they should be rendered. The ids are not
 * in messages/*.json as a list (that would duplicate the copy), so they are
 * derived from the translations present on the sector object.
 */
const OFFER_IDS: Record<string, string[]> = {
  realEstate:    ["projectSite", "landWatch", "autoPosting", "floorPlans"],
  ecommerce:     ["onlineStore", "priceWatch", "promoRestock", "supplierCatalog"],
  socialMedia:   ["simpleSite", "audienceDiscovery", "autoPosting", "weeklyReport"],
  healthcare:    ["bookingSite", "instantRecords", "reminders", "digitizeFiles"],
  manufacturing: ["corporateSite", "supplierTracking", "internalWorkflow", "technicalArchive"],
};

export function sectorOfferIds(sectorId: string): string[] {
  return OFFER_IDS[sectorId] ?? [];
}
