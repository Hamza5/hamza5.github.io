import SkillsSection from "@/app/components/skills/skills-section";
import { pageMetadata } from "@/app/lib/page-metadata";

export const generateMetadata = pageMetadata("/skills", "skills");

export default function SkillsPage() {
  return (
    <main>
      <SkillsSection />
    </main>
  );
}
