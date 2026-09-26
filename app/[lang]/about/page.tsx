import BasicInfoSection from "@/app/components/basic-info/basic-info-section";
import { pageMetadata } from "@/app/lib/page-metadata";

export const generateMetadata = pageMetadata("/about", "about");

export default function AboutPage() {
  return (
    <main>
      <BasicInfoSection />
    </main>
  );
}
