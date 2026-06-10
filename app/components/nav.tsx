"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faUser,
  faBriefcase,
  faFolderOpen,
  faCode,
  faAward,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useTranslation } from "react-i18next";
import { useNavDirection } from "./nav-direction-context";

const NAV_CONFIG: { href: string; key: string; icon: IconDefinition }[] = [
  { href: "/",             key: "nav.home",         icon: faHouse },
  { href: "/about",        key: "nav.about",        icon: faUser },
  { href: "/career",       key: "nav.career",       icon: faBriefcase },
  { href: "/projects",     key: "nav.projects",     icon: faFolderOpen },
  { href: "/skills",       key: "nav.skills",       icon: faCode },
  { href: "/publications", key: "nav.publications", icon: faAward },
];

const PAGE_ORDER = NAV_CONFIG.map((i) => i.href);

export default function Nav() {
  const pathname = usePathname();
  const { setDirection } = useNavDirection();
  const { t } = useTranslation();

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_CONFIG.map(({ href, key, icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`nav-item${isActive ? " active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => {
              const currentIdx = PAGE_ORDER.indexOf(pathname as typeof PAGE_ORDER[number]);
              const targetIdx  = PAGE_ORDER.indexOf(href as typeof PAGE_ORDER[number]);
              setDirection(targetIdx >= currentIdx ? 1 : -1);
            }}
          >
            <FontAwesomeIcon icon={icon} className="nav-item-icon" />
            <span className="nav-item-label">{t(key)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
