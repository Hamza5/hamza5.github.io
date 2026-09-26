"use client";

import {
  faCode,
  faCubesStacked,
  faDatabase,
  faGears,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useTranslation } from "react-i18next";
import SectionHeading from "@/app/components/section-heading";
import { useLocalizedProfile } from "@/app/hooks/use-localized-profile";
import SkillCategory from "./skill-category";

/** Maps category id to a FontAwesome icon. */
const categoryIcons: Record<string, IconDefinition> = {
  languages: faCode,
  frameworks: faCubesStacked,
  databases: faDatabase,
  devops: faGears,
  graphic: faPalette,
};

export default function SkillsSection() {
  const { t } = useTranslation();
  const { skills } = useLocalizedProfile();

  return (
    <section className="skills-section">
      <div className="skills-container">
        <SectionHeading level={1} icon={faCode} title={t("skills.heading")} id="skills" />
        {skills.map((category) => (
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
