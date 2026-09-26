import { profile } from "@/app/data/profile";
import type { Messages } from "./messages";
import type { Locale } from "./locales";
import { absoluteUrl, SITE_URL, WHATSAPP_NUMBER } from "./site";

// ---------------------------------------------------------------------------
// schema.org builders.
//
// Every node uses an absolute, language-independent @id so that the three
// locale copies of a page merge into a single entity in Google's knowledge
// graph instead of being treated as three different people or businesses.
// ---------------------------------------------------------------------------

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const SERVICE_ID = `${SITE_URL}/#service`;

const AREA_SERVED = [
  { "@type": "City", "name": "Oran" },
  { "@type": "Country", "name": "Algeria" },
];

function postalAddress(messages: Messages) {
  return {
    "@type": "PostalAddress",
    "addressLocality": messages.profile.location.city,
    "addressRegion": messages.profile.location.district,
    "addressCountry": "DZ",
  };
}

function contactPoint() {
  return [
    {
      "@type": "ContactPoint",
      "telephone": `+${WHATSAPP_NUMBER}`,
      "contactType": "customer service",
      "areaServed": ["DZ"],
      "availableLanguage": ["ar", "fr", "en"],
      "url": absoluteUrl("/en/contact"),
    },
  ];
}

export function buildPersonSchema(messages: Messages) {
  const email = profile.contact.emails[0];
  const phone = profile.contact.phones[0];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: messages.profile.fullName,
    url: absoluteUrl("/en"),
    image: absoluteUrl("/avatar.svg"),
    email,
    telephone: `+${phone.number}`,
    jobTitle: messages.profile.shortDescription,
    description: messages.seo.home.description,
    address: postalAddress(messages),
    knowsLanguage: ["ar", "en", "fr", "zh", "ru"],
    knowsAbout: Object.values(messages.profile.skills.items).map((item) => item.name),
    sameAs: profile.socialLinks.map((link) => link.url),
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Wuhan University of Technology (WHUT)" },
      {
        "@type": "CollegeOrUniversity",
        name: "University of Science and Technology Houari Boumediene (USTHB)",
      },
    ],
  };
}

export function buildWebSiteSchema(messages: Messages, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/en"),
    name: messages.profile.fullName,
    description: messages.seo.home.description,
    inLanguage: locale,
    publisher: { "@id": PERSON_ID },
  };
}

/**
 * The service business itself: a ProfessionalService rather than a Person,
 * because the service pages are what should be attached to a LocalBusiness
 * type. Offers are described qualitatively — prices are quoted per project.
 */
export function buildProfessionalServiceSchema(
  messages: Messages,
  path: string,
  seoKey: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": SERVICE_ID,
    name: `${messages.profile.fullName} — ${messages.services.title}`,
    description: messages.seo[seoKey as keyof Messages["seo"]].description,
    url: absoluteUrl(path),
    image: absoluteUrl("/avatar.svg"),
    email: profile.contact.emails[0],
    telephone: `+${WHATSAPP_NUMBER}`,
    address: postalAddress(messages),
    areaServed: AREA_SERVED,
    availableLanguage: ["ar", "fr", "en"],
    founder: { "@id": PERSON_ID },
    contactPoint: contactPoint(),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: messages.services.offersTitle,
      itemListElement: Object.entries(messages.services.offers).map(([id, offer]) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: offer.title, description: offer.description },
        "@id": `${SERVICE_ID}/offers/${id}`,
      })),
    },
  };
}

/** One sector page: a Service with the audience it is aimed at. */
export function buildSectorServiceSchema(
  messages: Messages,
  path: string,
  seoKey: string,
  sectorId: string,
) {
  const sector = (
    messages.services.sectors as unknown as Record<
      string,
      {
        name: string;
        serviceType: string;
        audience: string;
        intro: string;
        offers?: Record<string, { title: string; description: string }>;
      }
    >
  )[sectorId];

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SERVICE_ID}/${sectorId}`,
    name: sector.serviceType,
    serviceType: sector.serviceType,
    description: messages.seo[seoKey as keyof Messages["seo"]].description,
    url: absoluteUrl(path),
    provider: { "@id": SERVICE_ID },
    areaServed: AREA_SERVED,
    availableLanguage: ["ar", "fr", "en"],
    audience: {
      "@type": "BusinessAudience",
      audienceType: sector.name,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: sector.name,
      itemListElement: Object.entries(sector.offers ?? {}).map(([id, offer]) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: offer.title, description: offer.description },
        "@id": `${SERVICE_ID}/${sectorId}/${id}`,
      })),
    },
  };
}

/** The case-studies page: an ItemList of CreativeWork entries. */
export function buildCaseStudyListSchema(messages: Messages, path: string) {
  const items = messages.caseStudies.items as unknown as Record<
    string,
    { title: string; description: string }
  >;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#case-studies`,
    name: messages.caseStudies.title,
    description: messages.seo.caseStudies.description,
    url: absoluteUrl(path),
    numberOfItems: Object.keys(items).length,
    itemListElement: Object.entries(items).map(([id, item], index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: item.title,
        description: item.description,
        url: absoluteUrl(`${path}#${id}`),
        creator: { "@id": PERSON_ID },
      },
    })),
  };
}
