import styles from "./ResultsPanel.module.css";
import { ProductCard } from "./ProductCard";
import type { Product, Page } from "../../shared/types";

type ProductWithPages = {
  product: Product;
  pages: Page[];
};

type ResultsPanelProps = {
  products: ProductWithPages[];
};

export function ResultsPanel({ products }: ResultsPanelProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>Recommended Technologies</h2>
      <div className={styles.grid}>
        {products.map(({ product, pages }) => (
          <ProductCard key={product.id} product={product} pages={pages} />
        ))}
      </div>
    </div>
  );
}
