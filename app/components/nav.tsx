"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import Icon from "@/app/components/fa-icon";
import {
  groupForPath,
  matchesRoute as matches,
  routes,
  stripLocale,
  type NavGroupId,
  type RouteEntry,
} from "@/app/lib/site";
import { useNavDirection } from "./nav-direction-context";

const GROUPS: NavGroupId[] = ["personal", "services"];

export default function Nav() {
  const pathname = usePathname();
  const { lang = "en" } = useParams<{ lang: string }>();
  const { setDirection } = useNavDirection();
  const { t } = useTranslation();

  const activeGroup = groupForPath(pathname);
  const stripped = stripLocale(pathname);
  const items = routes.filter((route) => route.group === activeGroup && route.inNav);

  // Page transitions animate in the direction of travel, so the effect matches
  // the order the items are shown in.
  const step = (target: string) => {
    const from = items.findIndex((route) => matches(route, stripped));
    const to = items.findIndex((route) => matches(route, target));
    if (from >= 0 && to >= 0 && to !== from) setDirection(to > from ? 1 : -1);
  };

  const hrefFor = (route: RouteEntry) =>
    route.path === "" ? `/${lang}` : `/${lang}${route.path}`;
  const target = (path: string) => (path === "" ? "/" : path);

  return (
    <nav className="bottom-nav" aria-label={t("nav.label")}>
      {/* Group switcher. Deliberately quiet: it labels the row of items below
          rather than competing with it. */}
      <div className="bottom-nav-groups">
        {GROUPS.map((group, i) => {
          const isActive = group === activeGroup;
          const first = routes.find((route) => route.group === group && route.inNav)!;
          return (
            <span key={group} className="bottom-nav-group">
              {i > 0 && <span className="bottom-nav-group-sep" aria-hidden="true" />}
              <Link
                href={hrefFor(first)}
                className={`nav-group-tab${isActive ? " active" : ""}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => step(target(first.path))}
              >
                {t(`nav.groups.${group}`)}
              </Link>
            </span>
          );
        })}
      </div>

      <ul className="bottom-nav-items">
        {items.map((route) => {
          const isActive = matches(route, stripped);
          return (
            <li key={route.path}>
              <Link
                href={hrefFor(route)}
                className={`nav-item${isActive ? " active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => step(target(route.path))}
              >
                <Icon name={route.icon} className="nav-item-icon" />
                <span className="nav-item-label">{t(route.navKey)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
