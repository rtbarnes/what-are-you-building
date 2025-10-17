import { useState } from "react";
import styles from "./ProductCard.module.css";
import { FeatureCarousel } from "./FeatureCarousel";
import type { Product, Page } from "../../shared/types";

type ProductCardProps = {
  product: Product;
  pages: Page[];
};

export function ProductCard({ product, pages }: ProductCardProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const shouldTruncateDescription =
    product.description && product.description.length > 100;
  const displayDescription =
    shouldTruncateDescription && !isDescriptionExpanded
      ? product.description!.substring(0, 100) + "..."
      : product.description;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {product.image && (
          <div className={styles.imageContainer}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.image}
            />
          </div>
        )}
        <h3 className={styles.name}>{product.name}</h3>
        {product.description && (
          <div className={styles.descriptionContainer}>
            <p className={styles.description}>{displayDescription}</p>
            {shouldTruncateDescription && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className={styles.expandButton}
              >
                {isDescriptionExpanded ? "view less" : "view more"}
              </button>
            )}
          </div>
        )}
        {product.summary && <p className={styles.summary}>{product.summary}</p>}
        {product.site && <p className={styles.site}>via {product.site}</p>}
      </div>

      {pages.length > 0 && <FeatureCarousel pages={pages} />}
    </div>
  );
}
