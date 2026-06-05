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
} from "@fortawesome/free-solid-svg-icons";
import { useNavDirection } from "./nav-direction-context";

const navItems = [
  { href: "/",         label: "Home",     icon: faHouse },
  { href: "/about",    label: "About",    icon: faUser },
  { href: "/career",   label: "Career",   icon: faBriefcase },
  { href: "/projects", label: "Projects", icon: faFolderOpen },
  { href: "/skills",   label: "Skills",   icon: faCode },
] as const;

const PAGE_ORDER = navItems.map((i) => i.href);

export default function Nav() {
  const pathname = usePathname();
  const { setDirection } = useNavDirection();

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {navItems.map(({ href, label, icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`nav-item${isActive ? " active" : ""}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => {
              const currentIdx = PAGE_ORDER.indexOf(pathname as typeof PAGE_ORDER[number]);
              const targetIdx  = PAGE_ORDER.indexOf(href);
              setDirection(targetIdx >= currentIdx ? 1 : -1);
            }}
          >
            <FontAwesomeIcon icon={icon} className="nav-item-icon" />
            <span className="nav-item-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
