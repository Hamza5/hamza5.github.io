import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ContactItemProps {
  icon: IconDefinition;
  label: string;
  href?: string;
}

export default function ContactItem({ icon, label, href }: ContactItemProps) {
  const content = (
    <>
      <FontAwesomeIcon icon={icon} className="contact-item-icon" />
      <span className="contact-item-label">{label}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className="contact-item contact-item-link" target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <div className="contact-item">{content}</div>;
}
