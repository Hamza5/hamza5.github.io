import { profile } from "../data/profile";

/**
 * Builds a vCard 3.0 string from the global profile.
 * Version 3.0 is used for widest scanner compatibility.
 */
export function buildVCard(): string {
  const { fullName, shortDescription, contact, socialLinks } = profile;
  const email = contact.emails[0] ?? "";
  const phone = contact.phones[0]?.number ?? "";
  const parts = fullName.trim().split(/\s+/);
  const givenName = parts[0] ?? "";
  const familyName = parts.slice(1).join(" ");

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fullName}`,
    `N:${familyName};${givenName};;;`,
    `TITLE:${shortDescription}`,
  ];
  if (email) lines.push(`EMAIL;TYPE=INTERNET:${email}`);
  if (phone) lines.push(`TEL;TYPE=CELL:${phone}`);
  for (const link of socialLinks) {
    lines.push(`URL:${link.url}`);
  }
  lines.push("END:VCARD");
  return lines.join("\r\n");
}
