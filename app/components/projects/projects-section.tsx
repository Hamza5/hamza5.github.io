import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "@/app/components/section-heading";
import ProjectCard from "@/app/components/projects/project-card";
import { profile } from "@/app/data/profile";

export default function ProjectsSection() {
  return (
    <section className="timeline-section">
      <div className="timeline-container">
        <SectionHeading icon={faFolderOpen} title="Projects" id="projects" />

        <div className="timeline-spine-wrapper" style={{ marginTop: "2.5rem" }}>
          {profile.projects.map((entry, index) => (
            <ProjectCard key={`${entry.title}-${entry.year}`} entry={entry} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
