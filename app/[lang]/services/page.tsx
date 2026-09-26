import ServicesSection from "@/app/components/services/services-section";
import StructuredData from "@/app/components/structured-data";
import { normalizeLocale } from "@/app/lib/locales";
import { getMessages } from "@/app/lib/messages";
import { localePath } from "@/app/lib/site";
import { buildProfessionalServiceSchema } from "@/app/lib/seo";
import { pageMetadata } from "@/app/lib/page-metadata";

const PATH = "/services";

export const generateMetadata = pageMetadata(PATH, "services");

export default async function ServicesPage({
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
            "services",
          ),
        ]}
      />
      <ServicesSection />
    </main>
  );
}
