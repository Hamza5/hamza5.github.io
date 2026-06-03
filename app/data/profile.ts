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

export interface Profile {
  fullName: string;
  shortDescription: string;
  contact: ContactInfo;
  personal: PersonalDetails;
  languages: Language[];
  location: Location;
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
};
