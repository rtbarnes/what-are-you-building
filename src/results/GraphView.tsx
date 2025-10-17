import { useMemo, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import type { SearchGraph, Product, Page } from "../../shared/types";
import styles from "./GraphView.module.css";

// Generate distinct colors for products
const generateProductColors = (
  productNames: string[]
): Record<string, string> => {
  const colors = [
    "#ff6b6b", // Red
    "#4dabf7", // Blue
    "#51cf66", // Green
    "#ffd43b", // Yellow
    "#da77f2", // Purple
    "#ff8cc8", // Pink
    "#20c997", // Teal
    "#fd7e14", // Orange
    "#6c757d", // Gray
    "#e83e8c", // Magenta
  ];

  const colorMap: Record<string, string> = {};
  productNames.forEach((name, index) => {
    colorMap[name] = colors[index % colors.length];
  });
  return colorMap;
};

type Props = {
  graph: SearchGraph | null;
  onSelect: (id: string) => void;
  products?: Array<{ product: Product; pages: Page[] }>;
};

export function GraphView({ graph, onSelect, products = [] }: Props) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const neighbors = useMemo(() => {
    if (!graph) return new Map<string, Set<string>>();
    const map = new Map<string, Set<string>>();
    for (const { source, target } of graph.links) {
      if (!map.has(String(source))) map.set(String(source), new Set());
      if (!map.has(String(target))) map.set(String(target), new Set());
      map.get(String(source))!.add(String(target));
      map.get(String(target))!.add(String(source));
    }
    return map;
  }, [graph]);

  const productColors = useMemo(() => {
    if (!graph) return {};
    const productNames = [
      ...new Set(
        graph.nodes
          .map((n) => n.productName)
          .filter((name): name is string => Boolean(name))
      ),
    ];
    return generateProductColors(productNames);
  }, [graph]);

  const hoveredPage = useMemo(() => {
    if (!hoverId || !graph) return null;

    // Find the node to get page metadata
    const node = graph.nodes.find((n) => n.id === hoverId);
    if (!node || !node.productId) return null;

    // Find the product and page
    const product = products.find((p) => p.product.id === node.productId);
    if (!product) return null;

    // Find the specific page by URL
    const page = product.pages.find((page) => page.url === node.url);
    if (!page) return null;

    return { product: product.product, page };
  }, [hoverId, graph, products]);

  if (!graph || graph.nodes.length === 0) {
    return (
      <div className={styles.graphView}>
        <div className={styles.empty}>No graph data available</div>
      </div>
    );
  }

  return (
    <div className={styles.graphView}>
      {/* Legend */}
      <div className={styles.legend}>
        <h4 className={styles.legendTitle}>Products</h4>
        <div className={styles.legendItems}>
          {Object.entries(productColors).map(([productName, color]) => (
            <div key={productName} className={styles.legendItem}>
              <div
                className={styles.legendColor}
                style={{ backgroundColor: color }}
              />
              <span className={styles.legendLabel}>{productName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Graph */}
      <div className={styles.graphContainer}>
        <ForceGraph2D
          graphData={graph}
          nodeLabel={(n: any) => n.label}
          nodeRelSize={6}
          onNodeHover={(n: any, event: any) => {
            setHoverId(n?.id ?? null);
            if (n && event) {
              setHoverPosition({ x: event.clientX, y: event.clientY });
            } else {
              setHoverPosition(null);
            }
          }}
          onNodeClick={(n: any) => onSelect(String(n.id))}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const id = String(node.id);
            const isHover = hoverId === id;
            const isNeighbor = hoverId && neighbors.get(hoverId)?.has(id);
            const fontSize = 12 / globalScale;

            // Get base color from product
            const baseColor = node.productName
              ? productColors[node.productName]
              : "#adb5bd";

            const radius = isHover ? 6 : 4;

            // Draw the main node circle
            ctx.fillStyle = baseColor;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
            ctx.fill();

            // Draw white outline for hovered node or its neighbors
            if (isHover || isNeighbor) {
              ctx.strokeStyle = "#ffffff";
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
              ctx.stroke();
            }

            if (globalScale > 1.5) {
              ctx.font = `${fontSize}px system-ui`;
              ctx.fillStyle = "#ffffff";
              ctx.fillText(node.label, node.x + 6, node.y + 4);
            }
          }}
          linkColor={() => "#6c757d"}
          linkWidth={(l: any) =>
            hoverId && (l.source.id === hoverId || l.target.id === hoverId)
              ? 2
              : 1
          }
          cooldownTicks={100}
          onEngineStop={() => {
            /* optionally freeze positions */
          }}
        />
      </div>

      {hoveredPage && hoverPosition && (
        <div
          className={styles.hoverCard}
          style={{
            left: hoverPosition.x + 10,
            top: hoverPosition.y - 10,
          }}
        >
          <div className={styles.pageCard}>
            <h4 className={styles.pageTitle}>{hoveredPage.page.title}</h4>
            <p className={styles.pageProduct}>
              from {hoveredPage.product.name}
            </p>
            <a
              href={hoveredPage.page.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pageLink}
            >
              View Page →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
