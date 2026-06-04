// ---------------------------------------------------------------------------
// Profile data — single source of truth for all static content.
//
// Design notes:
//  - All collections are arrays even if currently one item, to avoid a
//    future structural change when more items are added.
//  - The top-level `Profile` interface is locale-neutral (plain strings).
//    To support i18n later, wrap in `getProfile(locale: string): Profile`.
//  - Proficiency values are 0–1 (same scale as InteractiveCV).
// ---------------------------------------------------------------------------

export interface Phone {
  country: string;     // ISO 3166-1 alpha-2, e.g. "DZ"
  flag: string;        // emoji flag, e.g. "🇩🇿"
  number: string;      // E.164 format, e.g. "+213659418469"
  label: string;       // display-friendly, e.g. "+213 659 418 469"
}

export interface Language {
  name: string;
  flagSrc: string;     // path relative to /public, e.g. "/images/flags/france.png"
  description: string;
  proficiency: number; // 0–1
}

export interface Location {
  district?: string;   // suburb / neighbourhood within the city, e.g. "Bab Ezzouar"
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;    // IANA timezone, e.g. "Africa/Algiers"
}

export interface PersonalDetails {
  dateOfBirth: string; // ISO 8601, e.g. "1994-05-13"
  nationality: string;
  religion: string;
}

export interface ContactInfo {
  emails: string[];
  phones: Phone[];
}

// ---------------------------------------------------------------------------
// Timeline — unified education + work history, sorted descending by endYear.
//
// Design notes:
//  - `category` drives the visual accent colour (education → purple, work → cyan).
//  - `type` drives the badge label on each card.
//  - `endYear` is used as the primary sort key; for ongoing entries use the
//    current year or 9999 to pin them to the top.
//  - `startYear` equals `endYear` for single-year entries (e.g. an exam).
//  - `logoSrc` is relative to /public (e.g. "/images/logos/usthb_logo.png").
//  - `institutionUrl` is used to make the logo a clickable link.
// ---------------------------------------------------------------------------

export type TimelineEntryType =
  | "bachelor"
  | "master"
  | "phd"
  | "language"
  | "certificate"
  | "course"
  | "internship"
  | "job"
  | "freelance";

export type TimelineEntryCategory = "education" | "work";

export interface TimelineEntry {
  type: TimelineEntryType;
  category: TimelineEntryCategory;
  institution: string;
  logoSrc: string;
  institutionUrl: string;
  title: string;
  startYear: number;
  endYear: number;
}

export interface Profile {
  fullName: string;
  shortDescription: string;
  contact: ContactInfo;
  personal: PersonalDetails;
  languages: Language[];
  location: Location;
  timeline: TimelineEntry[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const profile: Profile = {
  fullName: "Hamza Abbad",
  shortDescription: "Engineer in Artificial Intelligence and Computer Science",

  contact: {
    emails: [
      "hamza.abbad@gmail.com",
    ],
    phones: [
      {
        country: "DZ",
        flag: "🇩🇿",
        number: "+213659418469",
        label: "+213 6 59 41 84 69",
      },
    ],
  },

  personal: {
    dateOfBirth: "1994-05-13",
    nationality: "Algerian",
    religion: "Islam",
  },

  languages: [
    {
      name: "Arabic",
      flagSrc: "/images/flags/arab-league.png",
      description: "Standard Arabic and most dialects",
      proficiency: 0.9,
    },
    {
      name: "English",
      flagSrc: "/images/flags/united-states.png",
      description: "American accent",
      proficiency: 0.8,
    },
    {
      name: "French",
      flagSrc: "/images/flags/france.png",
      description: "Metropolitan French",
      proficiency: 0.7,
    },
    {
      name: "Chinese",
      flagSrc: "/images/flags/china.png",
      description: "Mandarin Chinese",
      proficiency: 0.6,
    },
    {
      name: "Russian",
      flagSrc: "/images/flags/russia.png",
      description: "Basic words and sentences",
      proficiency: 0.1,
    },
  ],

  location: {
    district: "Bir El Djir",
    city: "Oran",
    country: "Algeria",
    latitude: 35.706047773344736,
    longitude: -0.5866758062029425,
    timezone: "Africa/Algiers",
  },

  // Sorted descending by endYear, then by startYear for same-endYear entries.
  timeline: [
    {
      type: "job",
      category: "work",
      institution: "SMRIS-CRTI",
      logoSrc: "/images/logos/SMRIS-CRTI_logo.png",
      institutionUrl: "https://www.smris-crti.dz/",
      title: "State Engineer for Research Support",
      startYear: 2025,
      endYear: 9999, // Ongoing
    },
    {
      type: "freelance",
      category: "work",
      institution: "Upwork",
      logoSrc: "/images/logos/upwork_logo.png",
      institutionUrl: "https://www.upwork.com/",
      title: "Web Scraping and Web Developement projects",
      startYear: 2024,
      endYear: 2025,
    },
    {
      type: "freelance",
      category: "work",
      institution: "Hsoub Academy",
      logoSrc: "/images/logos/Hsoub_academy.png",
      institutionUrl: "https://academy.hsoub.com/",
      title: "Helping students in Python programming",
      startYear: 2024,
      endYear: 2024,
    },
    {
      type: "phd",
      category: "education",
      institution: "Wuhan University of Technology (WHUT)",
      logoSrc: "/images/logos/whut_logo.png",
      institutionUrl: "https://www.whut.edu.cn/",
      title: "PhD in Arabic Natural Language Processing using Deep Learning",
      startYear: 2018,
      endYear: 2024,
    },
    {
      type: "job",
      category: "work",
      institution: "Data Impact",
      logoSrc: "/images/logos/dataimpact_logo.png",
      institutionUrl: "https://www.dataimpact.io/",
      title: "Web scraping for digital shelf",
      startYear: 2022,
      endYear: 2022,
    },
    {
      type: "course",
      category: "education",
      institution: "EdX",
      logoSrc: "/images/logos/edx_logo.png",
      institutionUrl: "https://www.edx.org/",
      title: "Reinforcement Learning Explained",
      startYear: 2019,
      endYear: 2019,
    },
    {
      type: "certificate",
      category: "education",
      institution: "International Education Specialists (IDP)",
      logoSrc: "/images/logos/idp_logo.png",
      institutionUrl: "https://www.idp.com/",
      title: "International English Language Testing System (IELTS)",
      startYear: 2018,
      endYear: 2018,
    },
    {
      type: "course",
      category: "education",
      institution: "Coursera",
      logoSrc: "/images/logos/coursera_logo.png",
      institutionUrl: "https://www.coursera.org/",
      title: "Machine Learning",
      startYear: 2018,
      endYear: 2018,
    },
    {
      type: "language",
      category: "education",
      institution: "Wuhan University of Technology (WHUT)",
      logoSrc: "/images/logos/whut_logo.png",
      institutionUrl: "https://www.whut.edu.cn/",
      title: "Mandarin Chinese",
      startYear: 2017,
      endYear: 2018,
    },
    {
      type: "master",
      category: "education",
      institution: "University of Science and Technology Houari Boumediene (USTHB)",
      logoSrc: "/images/logos/usthb_logo.png",
      institutionUrl: "https://www.usthb.dz/",
      title: "Master in Artificial Intelligence",
      startYear: 2015,
      endYear: 2017,
    },
    {
      type: "internship",
      category: "work",
      institution: "AlBaraka Bank",
      logoSrc: "/images/logos/albaraka_logo.png",
      institutionUrl: "https://www.albaraka-bank.dz/",
      title: "Internship in IT",
      startYear: 2014,
      endYear: 2014,
    },
    {
      type: "bachelor",
      category: "education",
      institution: "University of Science and Technology Houari Boumediene (USTHB)",
      logoSrc: "/images/logos/usthb_logo.png",
      institutionUrl: "https://www.usthb.dz/",
      title: "Bachelor in Computer Science",
      startYear: 2012,
      endYear: 2015,
    },
  ],
};
