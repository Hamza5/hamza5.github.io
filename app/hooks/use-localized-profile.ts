"use client";

import { useTranslation } from "react-i18next";
import { profile } from "@/app/data/profile";
import type {
  TimelineEntry,
  ProjectEntry,
  Language,
  SkillCategory,
  SkillItem,
} from "@/app/data/profile";

export interface LocalizedTimelineEntry extends TimelineEntry {
  title: string;
}

export interface LocalizedProjectEntry extends ProjectEntry {
  title: string;
  description: string;
}

export interface LocalizedLanguage extends Language {
  name: string;
  description: string;
}

export interface LocalizedSkillItem extends SkillItem {
  name: string;
  description: string;
}

export interface LocalizedSkillCategory extends SkillCategory {
  name: string;
  items: LocalizedSkillItem[];
}

export function useLocalizedProfile() {
  const { t } = useTranslation();

  const timeline: LocalizedTimelineEntry[] = profile.timeline.map((entry) => ({
    ...entry,
    title: t(`profile.timeline.${entry.id}.title`),
  }));

  const projects: LocalizedProjectEntry[] = profile.projects.map((entry) => ({
    ...entry,
    title: t(`profile.projects.${entry.id}.title`),
    description: t(`profile.projects.${entry.id}.description`),
  }));

  const languages: LocalizedLanguage[] = profile.languages.map((lang) => ({
    ...lang,
    name: t(`profile.languages.${lang.id}.name`),
    description: t(`profile.languages.${lang.id}.description`),
  }));

  const skills: LocalizedSkillCategory[] = profile.skills.map((category) => ({
    ...category,
    name: t(`skills.categories.${category.id}`),
    items: category.items.map((item) => ({
      ...item,
      name: t(`profile.skills.items.${item.id}.name`),
      description: t(`profile.skills.items.${item.id}.description`),
    })),
  }));

  return {
    fullName: t("profile.fullName"),
    shortDescription: t("profile.shortDescription"),
    personal: {
      ...profile.personal,
      nationality: t("profile.personal.nationality"),
      religion: t("profile.personal.religion"),
    },
    location: {
      ...profile.location,
      district: t("profile.location.district"),
      city: t("profile.location.city"),
      country: t("profile.location.country"),
    },
    contact: profile.contact,
    socialLinks: profile.socialLinks,
    publications: profile.publications,
    timeline,
    projects,
    languages,
    skills,
  };
}
