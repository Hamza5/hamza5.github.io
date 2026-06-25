"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { fileNameToCaption } from "./project-screenshot-gallery";

interface ScreenshotLightboxProps {
  images: string[];
  projectTitle: string;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
}

export default function ScreenshotLightbox({
  images,
  projectTitle,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
  onGoTo,
}: ScreenshotLightboxProps) {
  const { t } = useTranslation();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const hasMultiple = images.length > 1;
  const currentImage = images[currentIndex] ?? images[0];
  const caption = currentImage
    ? fileNameToCaption(currentImage.split("/").pop() ?? "")
    : "";

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, onPrev, onNext]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="screenshot-lightbox-backdrop"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label={t("projects.screenshotAlt", { projectTitle })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="screenshot-lightbox-content"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="screenshot-lightbox-close"
              onClick={onClose}
              aria-label={t("projects.close")}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <div className="screenshot-lightbox-image">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="screenshot-lightbox-image-inner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={currentImage}
                    alt={caption || t("projects.screenshotAlt", { projectTitle })}
                    fill
                    sizes="90vw"
                    className="screenshot-lightbox-img"
                    unoptimized
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {caption && (
              <p className="screenshot-lightbox-caption">{caption}</p>
            )}

            {hasMultiple && (
              <div className="screenshot-lightbox-nav">
                <button
                  type="button"
                  className="screenshot-lightbox-nav-btn"
                  onClick={onPrev}
                  aria-label={t("projects.previous")}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                <div className="screenshot-lightbox-dots">
                  {images.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      className={`screenshot-lightbox-dot ${i === currentIndex ? "active" : ""}`}
                      onClick={() => onGoTo(i)}
                      aria-label={fileNameToCaption(img.split("/").pop() ?? "")}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="screenshot-lightbox-nav-btn"
                  onClick={onNext}
                  aria-label={t("projects.next")}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
