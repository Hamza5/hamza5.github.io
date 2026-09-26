import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SectionHeadingProps {
  icon: IconDefinition;
  title: string;
  id?: string;
  /**
   * The page's main heading should be an h1; every other section heading is an
   * h2. Defaults to h2 so existing call sites stay correct.
   */
  level?: 1 | 2;
}

export default function SectionHeading({
  icon,
  title,
  id,
  level = 2,
}: SectionHeadingProps) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div id={id} className="section-heading">
      <FontAwesomeIcon icon={icon} className="section-heading-icon" />
      <Heading className="section-heading-title">{title}</Heading>
    </div>
  );
}
