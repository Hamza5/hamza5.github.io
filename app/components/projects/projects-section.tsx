"use client";

import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import SectionHeading from "@/app/components/section-heading";
import ProjectCard from "@/app/components/projects/project-card";
import { useLocalizedProfile } from "@/app/hooks/use-localized-profile";

export default function ProjectsSection() {
  const { t } = useTranslation();
  const { projects } = useLocalizedProfile();

  return (
    <section className="timeline-section">
      <div className="timeline-container">
        <SectionHeading icon={faFolderOpen} title={t("projects.title")} id="projects" />

        <div className="timeline-spine-wrapper" style={{ marginTop: "2.5rem" }}>
          {projects.map((entry, index) => (
            <ProjectCard key={`${entry.id}-${entry.year}`} entry={entry} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
