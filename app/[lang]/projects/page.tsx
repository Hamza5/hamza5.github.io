import ProjectsSection from "@/app/components/projects/projects-section";
import { profile } from "@/app/data/profile";
import { getProjectScreenshots } from "@/app/lib/screenshots";
import { pageMetadata } from "@/app/lib/page-metadata";

export const generateMetadata = pageMetadata("/projects", "projects");

export default async function ProjectsPage() {
  const screenshotsById: Record<string, string[]> = {};
  for (const project of profile.projects) {
    screenshotsById[project.id] = getProjectScreenshots(project.id);
  }

  return (
    <main>
      <ProjectsSection screenshotsById={screenshotsById} />
    </main>
  );
}
