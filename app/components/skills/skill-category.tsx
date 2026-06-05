import { iconRegistry } from "@/app/data/skill-icons";
import SectionHeading from "@/app/components/section-heading";
import SkillItem from "./skill-item";
import type { SkillCategory as SkillCategoryType } from "@/app/data/profile";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface SkillCategoryProps {
  category: SkillCategoryType;
  icon: IconDefinition;
}

export default function SkillCategory({ category, icon }: SkillCategoryProps) {
  return (
    <div className="skill-category">
      <SectionHeading icon={icon} title={category.name} id={category.id} />

      <div className="skill-grid" style={{ marginTop: "1.5rem" }}>
        {category.items.map((item) => {
          const iconData = item.slug ? iconRegistry[item.slug] ?? null : null;
          return (
            <SkillItem
              key={item.name}
              name={item.name}
              description={item.description}
              proficiency={item.proficiency}
              iconSvg={iconData?.svg ?? null}
              iconHex={iconData?.hex ?? null}
              fallbackImageSrc={item.fallbackImageSrc ?? null}
            />
          );
        })}
      </div>
    </div>
  );
}
