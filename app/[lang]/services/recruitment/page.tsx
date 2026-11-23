import SectorSection from "@/app/components/services/sector-section";
import StructuredData from "@/app/components/structured-data";
import { normalizeLocale } from "@/app/lib/locales";
import { getMessages } from "@/app/lib/messages";
import { localePath } from "@/app/lib/site";
import { buildSectorServiceSchema } from "@/app/lib/seo";
import { pageMetadata } from "@/app/lib/page-metadata";

const PATH = "/services/recruitment";
const SECTOR = "recruitment";
const SEO_KEY = "servicesRecruitment";

export const generateMetadata = pageMetadata(PATH, SEO_KEY);

export default async function RecruitmentPage({
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
          buildSectorServiceSchema(getMessages(locale), localePath(locale, PATH), SEO_KEY, SECTOR),
        ]}
      />
      <SectorSection sectorId={SECTOR} />
    </main>
  );
}
