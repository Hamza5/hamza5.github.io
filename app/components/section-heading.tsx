import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SectionHeadingProps {
  icon: IconDefinition;
  title: string;
  id?: string;
}

export default function SectionHeading({ icon, title, id }: SectionHeadingProps) {
  return (
    <div id={id} className="section-heading">
      <FontAwesomeIcon icon={icon} className="section-heading-icon" />
      <h2 className="section-heading-title">{title}</h2>
    </div>
  );
}
