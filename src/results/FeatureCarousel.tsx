import { useState } from "react";
import styles from "./FeatureCarousel.module.css";
import type { Page } from "../../shared/types";

type FeatureCarouselProps = {
  pages: Page[];
};

export function FeatureCarousel({ pages }: FeatureCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (pages.length === 0) {
    return null;
  }

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % pages.length);
  };

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + pages.length) % pages.length);
  };

  const currentPage = pages[currentIndex];

  return (
    <div className={styles.carousel}>
      <div className={styles.featureContainer}>
        <div className={styles.featureContent}>
          {currentPage.image && (
            <div className={styles.pageImageContainer}>
              <img
                src={currentPage.image}
                alt={currentPage.title}
                className={styles.pageImage}
              />
            </div>
          )}
          <div className={styles.pageInfo}>
            <a
              href={currentPage.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.featureLink}
            >
              {currentPage.title}
            </a>
            {currentPage.description && (
              <p className={styles.pageDescription}>
                {currentPage.description}
              </p>
            )}
            {currentPage.site && (
              <p className={styles.pageSite}>via {currentPage.site}</p>
            )}
          </div>
        </div>

        {pages.length > 1 && (
          <div className={styles.navigation}>
            <button
              onClick={prevPage}
              className={styles.navButton}
              aria-label="Previous page"
            >
              ←
            </button>
            <div className={styles.dots}>
              {pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`${styles.dot} ${
                    index === currentIndex ? styles.active : ""
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextPage}
              className={styles.navButton}
              aria-label="Next page"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
