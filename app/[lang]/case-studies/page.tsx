import CaseStudiesSection from "@/app/components/case-studies/case-studies-section";
import StructuredData from "@/app/components/structured-data";
import { normalizeLocale } from "@/app/lib/locales";
import { getMessages } from "@/app/lib/messages";
import { localePath } from "@/app/lib/site";
import { pageMetadata } from "@/app/lib/page-metadata";
import { buildCaseStudyListSchema } from "@/app/lib/seo";

const PATH = "/case-studies";

export const generateMetadata = pageMetadata(PATH, "caseStudies");

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = normalizeLocale(lang);

  return (
    <main>
      <StructuredData
        data={[buildCaseStudyListSchema(getMessages(locale), localePath(locale, PATH))]}
      />
      <CaseStudiesSection />
    </main>
  );
}
