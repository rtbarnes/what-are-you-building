import styles from "./ProductCard.module.css";
import type { Product, Page } from "../../shared/types";

type ProductCardProps = {
  product: Product;
  pages: Page[];
};

export function ProductCard({ product, pages }: ProductCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{product.name}</h3>
        {product.summary && <p className={styles.summary}>{product.summary}</p>}
      </div>

      {pages.length > 0 && (
        <div className={styles.pages}>
          <h4 className={styles.pagesTitle}>Resources:</h4>
          <ul className={styles.pageList}>
            {pages.map((page, index) => (
              <li key={index} className={styles.pageItem}>
                <a
                  href={page.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pageLink}
                >
                  {page.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
