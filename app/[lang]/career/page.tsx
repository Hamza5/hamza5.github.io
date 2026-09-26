import TimelineSection from "@/app/components/timeline/timeline-section";
import { pageMetadata } from "@/app/lib/page-metadata";

export const generateMetadata = pageMetadata("/career", "career");

export default function CareerPage() {
  return (
    <main>
      <TimelineSection />
    </main>
  );
}
