import ContactSection from "@/app/components/contact/contact-section";
import StructuredData from "@/app/components/structured-data";
import { normalizeLocale } from "@/app/lib/locales";
import { getMessages } from "@/app/lib/messages";
import { localePath } from "@/app/lib/site";
import { pageMetadata } from "@/app/lib/page-metadata";
import { buildProfessionalServiceSchema } from "@/app/lib/seo";

const PATH = "/contact";

export const generateMetadata = pageMetadata(PATH, "contact");

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = normalizeLocale(lang);

  return (
    <main>
      <StructuredData
        data={[
          buildProfessionalServiceSchema(
            getMessages(locale),
            localePath(locale, PATH),
            "contact",
          ),
        ]}
      />
      <ContactSection />
    </main>
  );
}
