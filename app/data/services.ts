// ---------------------------------------------------------------------------
// Services data — structural source of truth.
//
// Mirrors app/data/profile.ts: ids, illustration paths and routes live here;
// every human-readable string lives in messages/*.json and is resolved by
// useLocalizedServices().
// ---------------------------------------------------------------------------

import type { SectorPath } from "@/app/lib/site";

/** An illustration plus its intrinsic size, so no layout shift on load. */
export interface Art {
  src: string;
  width: number;
  height: number;
}

export interface OfferEntry {
  id: "website" | "dataCollection" | "automation" | "digitization";
  /** The home page band's icon. The /services card shows the illustration. */
  icon: string;
  /** Storyset illustration: the card's mark on /services, and the social card art. */
  image: Art;
}

// The sizes below are the *trimmed* intrinsic sizes, printed by
// `node scripts/storyset-illustrations.mjs`. They must be refreshed whenever
// that script runs: the art is laid out by width (`img { width: 100% }`), so a
// stale ratio both reserves the wrong box and lets the drawing sit small in it.
export const offers: OfferEntry[] = [
  { id: "website", icon: "globe", image: { src: "/images/services/offer-website.svg", width: 584, height: 445 } },
  { id: "dataCollection", icon: "tableList", image: { src: "/images/services/offer-data.svg", width: 638, height: 426 } },
  { id: "automation", icon: "robot", image: { src: "/images/services/offer-automation.svg", width: 444, height: 457 } },
  { id: "digitization", icon: "folderTree", image: { src: "/images/services/offer-digitization.svg", width: 442, height: 474 } },
];

// ---------------------------------------------------------------------------
// Sectors
// ---------------------------------------------------------------------------

export type SectorId =
  | "realEstate"
  | "ecommerce"
  | "businessDirectories"
  | "recruitment"
  | "legal"
  | "socialMedia"
  | "healthcare"
  | "manufacturing";

export interface SectorEntry {
  id: SectorId;
  path: SectorPath;
  image: Art;
  /**
   * The home page band's icon, and the sector page's eyebrow label. The sector
   * *card* on /services shows the illustration instead.
   */
  icon: string;
  /** Case-study ids on /case-studies that this sector can point at. */
  caseStudyIds: string[];
}

export const sectors: SectorEntry[] = [
  {
    id: "realEstate",
    path: "/services/real-estate",
    icon: "building",
    image: { src: "/images/services/sector-real-estate.svg", width: 438, height: 419 },
    caseStudyIds: ["realEstateTemplate", "realEstateRegister"],
  },
  {
    id: "ecommerce",
    path: "/services/ecommerce",
    icon: "cartShopping",
    image: { src: "/images/services/sector-ecommerce.svg", width: 655, height: 434 },
    caseStudyIds: ["marketplaceScrapers", "priceWatch", "digitalShelf"],
  },
  {
    id: "businessDirectories",
    path: "/services/business-directories",
    icon: "addressBook",
    image: { src: "/images/services/sector-business-directories.svg", width: 583, height: 351 },
    caseStudyIds: ["businessDirectoryScrapers"],
  },
  {
    id: "recruitment",
    path: "/services/recruitment",
    icon: "userGroup",
    image: { src: "/images/services/sector-recruitment.svg", width: 443, height: 422 },
    caseStudyIds: ["jobBoardScraper"],
  },
  {
    id: "legal",
    path: "/services/legal",
    icon: "scaleBalanced",
    image: { src: "/images/services/sector-legal.svg", width: 432, height: 406 },
    caseStudyIds: ["legalRegisterScraper"],
  },
  {
    id: "socialMedia",
    path: "/services/social-media",
    icon: "hashtag",
    image: { src: "/images/services/sector-social-media.svg", width: 402, height: 386 },
    caseStudyIds: ["contentAutomation"],
  },
  {
    id: "healthcare",
    path: "/services/healthcare",
    icon: "stethoscope",
    image: { src: "/images/services/sector-healthcare.svg", width: 345, height: 415 },
    caseStudyIds: ["patientsTimetable", "medicineRegister"],
  },
  {
    id: "manufacturing",
    path: "/services/manufacturing",
    icon: "gears",
    image: { src: "/images/services/sector-manufacturing.svg", width: 550, height: 406 },
    caseStudyIds: ["smrisTools"],
  },
];

export function findSector(id: string): SectorEntry | undefined {
  return sectors.find((sector) => sector.id === id);
}

// ---------------------------------------------------------------------------
// Case studies
// ---------------------------------------------------------------------------

export interface CaseStudyEntry {
  id: string;
  /** Which sector page this case study supports. */
  sector: SectorId;
  /**
   * Only used when there is no screenshot. A card with a screenshot shows the
   * screenshot alone, never both.
   */
  icon: string;
  /**
   * Set only where a real screenshot of this exact work exists, read from
   * public/images/projects. A screenshot stands in for the icon rather than
   * sitting next to it.
   */
  screenshot?: { src: string; width: number; height: number; alt: string };
  /** Ids on /projects this case study corresponds to, for the deep link. */
  projectIds: string[];
  status?: "inProgress";
}

export const caseStudies: CaseStudyEntry[] = [
  {
    id: "marketplaceScrapers",
    sector: "ecommerce",
    icon: "tags",
    screenshot: {
      src: "/images/projects/ouedknissMultiScraper/1 OuedKniss Multi-Scraper on Apify.png",
      width: 1440,
      height: 900,
      alt: "OuedKniss Multi-Scraper on Apify",
    },
    projectIds: [
      "hamizMultiScraper",
      "tijelabinMultiScraper",
      "ouedknissMultiScraper",
      "autobipScraper",
      "yassirMarketplaceScraper",
    ],
  },
  {
    id: "realEstateRegister",
    sector: "realEstate",
    icon: "building",
    screenshot: {
      src: "/images/projects/fgcmpiScraper/1 FGCMPI Scraper on Apify.png",
      width: 1440,
      height: 900,
      alt: "FGCMPI Scraper on Apify",
    },
    projectIds: ["fgcmpiScraper"],
  },
  {
    id: "medicineRegister",
    sector: "healthcare",
    icon: "folderOpen",
    screenshot: {
      src: "/images/projects/algeriaMedicinesRegisterScraper/1 Algeria Medicines Register Scraper on Apify.png",
      width: 1440,
      height: 900,
      alt: "Algeria Medicines Register Scraper on Apify",
    },
    projectIds: ["algeriaMedicinesRegisterScraper"],
  },
  {
    id: "businessDirectoryScrapers",
    sector: "businessDirectories",
    icon: "addressBook",
    screenshot: {
      src: "/images/projects/elmouchirScraper/1 El Mouchir Scraper on Apify.png",
      width: 1440,
      height: 900,
      alt: "El Mouchir Scraper on Apify",
    },
    projectIds: ["elmouchirScraper", "ypBusinessDirectoriesScraper"],
  },
  {
    id: "jobBoardScraper",
    sector: "recruitment",
    icon: "userGroup",
    screenshot: {
      src: "/images/projects/emploiticScraper/1 Emploitic Scraper on Apify.png",
      width: 1440,
      height: 900,
      alt: "Emploitic Scraper on Apify",
    },
    projectIds: ["emploiticScraper"],
  },
  {
    id: "legalRegisterScraper",
    sector: "legal",
    icon: "scaleBalanced",
    screenshot: {
      src: "/images/projects/joradpScraper/1 JORADP Scraper on Apify.png",
      width: 1440,
      height: 900,
      alt: "JORADP Scraper on Apify",
    },
    projectIds: ["joradpScraper"],
  },
  {
    id: "priceWatch",
    sector: "ecommerce",
    icon: "tags",
    // Store Scrap: the same retail-price scraping work, product catalogue side.
    screenshot: {
      src: "/images/projects/storeScrap/Store Scrap.png",
      width: 1378,
      height: 917,
      alt: "Store Scrap",
    },
    projectIds: ["storeScrap"],
  },
  {
    id: "digitalShelf",
    sector: "ecommerce",
    icon: "chartLine",
    projectIds: [],
  },
  {
    id: "patientsTimetable",
    sector: "healthcare",
    icon: "folderOpen",
    projectIds: ["patientsTimetable"],
  },
  {
    id: "smrisTools",
    sector: "manufacturing",
    icon: "diagramProject",
    screenshot: {
      src: "/images/projects/pftSmrisWebsite/1 PFT-SMRIS Plateforme Technologique Système Mécanique Robotique.png",
      width: 3072,
      height: 1472,
      alt: "PFT-SMRIS",
    },
    projectIds: ["pftSmrisWebsite"],
  },
  {
    id: "contentAutomation",
    sector: "socialMedia",
    icon: "clock",
    projectIds: ["instagramAutomation"],
  },
  {
    id: "realEstateTemplate",
    sector: "realEstate",
    icon: "building",
    projectIds: [],
    status: "inProgress",
  },
];
