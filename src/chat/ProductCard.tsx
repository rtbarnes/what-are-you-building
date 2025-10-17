import type { ProductCard as ProductCardType } from "./types";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  productCard: ProductCardType;
};

export function ProductCard({ productCard }: ProductCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{productCard.title}</h3>
        <p className={styles.subtitle}>{productCard.subtitle}</p>
      </div>

      <div className={styles.features}>
        <h4 className={styles.featuresTitle}>Key Features:</h4>
        <ul className={styles.featuresList}>
          {productCard.features.map((feature, index) => (
            <li key={index} className={styles.feature}>
              {feature.link ? (
                <a
                  href={feature.link}
                  className={styles.featureLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {feature.text}
                </a>
              ) : (
                <span className={styles.featureText}>{feature.text}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
