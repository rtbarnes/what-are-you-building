import { useState } from "react";
import styles from "./ResultsPanel.module.css";
import { ProductCard } from "./ProductCard";
import { GraphView } from "./GraphView";
import type { Product, Page, SearchGraph } from "../../shared/types";

type ProductWithPages = {
  product: Product;
  pages: Page[];
};

type ResultsPanelProps = {
  products: ProductWithPages[];
  graphs: Record<string, SearchGraph>;
};

export function ResultsPanel({ products, graphs }: ResultsPanelProps) {
  const [view, setView] = useState<"list" | "graph">("list");
  const [currentGraphIndex, setCurrentGraphIndex] = useState(0);

  const graphCategories = Object.keys(graphs);
  const currentGraph = graphCategories[currentGraphIndex]
    ? graphs[graphCategories[currentGraphIndex]]
    : null;

  if (products.length === 0) {
    return null;
  }

  const handleGraphNodeSelect = (id: string) => {
    // Find the product by ID and scroll to it in list view
    const productElement = document.querySelector(`[data-product-id="${id}"]`);
    if (productElement) {
      productElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handlePreviousGraph = () => {
    setCurrentGraphIndex((prev) =>
      prev > 0 ? prev - 1 : graphCategories.length - 1
    );
  };

  const handleNextGraph = () => {
    setCurrentGraphIndex((prev) =>
      prev < graphCategories.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <div className={styles.resultsPanel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recommended Technologies</h2>
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleButton} ${
              view === "list" ? styles.active : ""
            }`}
            onClick={() => setView("list")}
          >
            List
          </button>
          <button
            className={`${styles.toggleButton} ${
              view === "graph" ? styles.active : ""
            }`}
            onClick={() => setView("graph")}
          >
            Graph
          </button>
        </div>
      </div>

      {view === "list" ? (
        <div className={styles.grid}>
          {products.map(({ product, pages }) => (
            <div key={product.id} data-product-id={product.id}>
              <ProductCard product={product} pages={pages} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.graphContainer}>
          {graphCategories.length === 0 ? (
            <div className={styles.loading}>No graphs available</div>
          ) : (
            <>
              <div className={styles.graphHeader}>
                <h3 className={styles.graphTitle}>
                  {graphCategories[currentGraphIndex] || "Graph"}
                </h3>
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationButton}
                    onClick={handlePreviousGraph}
                    disabled={graphCategories.length <= 1}
                  >
                    ←
                  </button>
                  <span className={styles.paginationInfo}>
                    {currentGraphIndex + 1} of {graphCategories.length}
                  </span>
                  <button
                    className={styles.paginationButton}
                    onClick={handleNextGraph}
                    disabled={graphCategories.length <= 1}
                  >
                    →
                  </button>
                </div>
              </div>
              <GraphView
                graph={currentGraph}
                onSelect={handleGraphNodeSelect}
                products={products}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
