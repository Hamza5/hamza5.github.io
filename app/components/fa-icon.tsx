import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faHouse,
  faUser,
  faBriefcase,
  faFolderOpen,
  faCode,
  faAward,
  faComments,
  faGlobe,
  faTableList,
  faRobot,
  faFolderTree,
  faBuilding,
  faCartShopping,
  faHashtag,
  faStethoscope,
  faGears,
  faTags,
  faChartLine,
  faDiagramProject,
  faClock,
  faArrowRight,
  faPhone,
  faEnvelope,
  faLocationDot,
  faCircleCheck,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

/**
 * Icons are referenced from the data layer by string key rather than by
 * importing the definition at each call site — app/data/*.ts stays a plain
 * data module, and the whole set is tree-shaken through this single map.
 */
const ICONS: Record<string, IconDefinition> = {
  house: faHouse,
  user: faUser,
  briefcase: faBriefcase,
  folderOpen: faFolderOpen,
  code: faCode,
  award: faAward,
  comments: faComments,
  globe: faGlobe,
  tableList: faTableList,
  robot: faRobot,
  folderTree: faFolderTree,
  building: faBuilding,
  cartShopping: faCartShopping,
  hashtag: faHashtag,
  stethoscope: faStethoscope,
  gears: faGears,
  tags: faTags,
  chartLine: faChartLine,
  diagramProject: faDiagramProject,
  clock: faClock,
  arrowRight: faArrowRight,
  phone: faPhone,
  envelope: faEnvelope,
  locationDot: faLocationDot,
  circleCheck: faCircleCheck,
  circleInfo: faCircleInfo,
  whatsapp: faWhatsapp,
};

type IconStyle = React.ComponentProps<typeof FontAwesomeIcon>["style"];

interface IconProps {
  /** Key from the ICONS map above. */
  name: string;
  className?: string;
  style?: IconStyle;
}

export default function Icon({ name, className, style }: IconProps) {
  const icon = ICONS[name];
  if (!icon) return null;
  return <FontAwesomeIcon icon={icon} className={className} style={style} />;
}
