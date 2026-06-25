"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import ScreenshotLightbox from "./screenshot-lightbox";

export interface ProjectScreenshotGalleryProps {
  screenshots: string[];
  projectTitle: string;
}

export function fileNameToCaption(filename: string): string {
  const base = filename.replace(/\.[^/.]+$/, "");
  const words = base
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function ProjectScreenshotGallery({
  screenshots,
  projectTitle,
}: ProjectScreenshotGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();

  const count = screenshots.length;
  const altTemplate = t("projects.screenshotAlt", { projectTitle });

  const openAt = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = useCallback(() => setIsOpen(false), []);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % count);
  }, [count]);

  return (
    <>
      <div className="project-screenshot-gallery">
        {screenshots.map((src, index) => {
          const alt = `${altTemplate} ${index + 1}`;
          return (
            <button
              key={src}
              type="button"
              className="project-screenshot-thumbnail"
              onClick={() => openAt(index)}
              aria-label={alt}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 640px) 50vw, 160px"
                className="project-screenshot-thumb-img"
              />
            </button>
          );
        })}
      </div>

      <ScreenshotLightbox
        images={screenshots}
        projectTitle={projectTitle}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={closeLightbox}
        onPrev={goPrev}
        onNext={goNext}
        onGoTo={setCurrentIndex}
      />
    </>
  );
}
