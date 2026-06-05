import {
  faCode,
  faCubesStacked,
  faDatabase,
  faGears,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { profile } from "@/app/data/profile";
import SkillCategory from "./skill-category";

/** Maps category id → FontAwesome icon */
const categoryIcons: Record<string, IconDefinition> = {
  languages: faCode,
  frameworks: faCubesStacked,
  databases: faDatabase,
  devops: faGears,
  graphic: faPalette,
};

export default function SkillsSection() {
  return (
    <section className="skills-section">
      <div className="skills-container">
        {profile.skills.map((category) => (
          <SkillCategory
            key={category.id}
            category={category}
            icon={categoryIcons[category.id] ?? faCode}
          />
        ))}
      </div>
    </section>
  );
}
