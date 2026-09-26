import PublicationsSection from "@/app/components/publications/publications-section";
import { pageMetadata } from "@/app/lib/page-metadata";

export const generateMetadata = pageMetadata("/publications", "publications");

export default function PublicationsPage() {
  return (
    <main>
      <PublicationsSection />
    </main>
  );
}
