import React, { useMemo, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import type { SearchGraph, Product, Page } from "../../shared/types";
import { ProductCard } from "./ProductCard";
import styles from "./GraphView.module.css";

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

  const hoveredProduct = useMemo(() => {
    if (!hoverId) return null;
    return products.find((p) => p.product.id === hoverId) || null;
  }, [hoverId, products]);

  if (!graph || graph.nodes.length === 0) {
    return (
      <div className={styles.root}>
        <div className={styles.empty}>No graph data available</div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
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
          const color = isHover
            ? "#ff6b6b"
            : isNeighbor
            ? "#4dabf7"
            : "#adb5bd";

          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, isHover ? 6 : 4, 0, 2 * Math.PI, false);
          ctx.fill();

          if (globalScale > 1.5) {
            ctx.font = `${fontSize}px system-ui`;
            ctx.fillStyle = "#343a40";
            ctx.fillText(node.label, node.x + 6, node.y + 4);
          }
        }}
        linkColor={() => "#ced4da"}
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

      {hoveredProduct && hoverPosition && (
        <div
          className={styles.hoverCard}
          style={{
            left: hoverPosition.x + 10,
            top: hoverPosition.y - 10,
          }}
        >
          <ProductCard
            product={hoveredProduct.product}
            pages={hoveredProduct.pages}
          />
        </div>
      )}
    </div>
  );
}
