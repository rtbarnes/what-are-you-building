import type {
  SearchGraph,
  GraphNode,
  GraphLink,
  Product,
  Page,
} from "../../shared/types";

// Helper function to generate graph for a category using pages
export async function generateCategoryGraph(
  category: string,
  productsWithPages: Array<{ product: Product; pages: Page[] }>,
  neighborsNum: number = 5
): Promise<SearchGraph> {
  // Flatten all pages from all products in this category
  const allPages: Array<Page & { productId: string; productName: string }> = [];

  for (const { product, pages } of productsWithPages) {
    for (const page of pages) {
      allPages.push({
        ...page,
        productId: product.id,
        productName: product.name,
      });
    }
  }

  // Create nodes from pages
  const nodes: GraphNode[] = allPages.map((page, index) => ({
    id: `${page.productId}-${index}`, // Unique ID combining product and page index
    label: page.title,
    score: Math.random(), // Simulated relevance score
    group: category,
    // Store additional metadata for the frontend
    productId: page.productId,
    productName: page.productName,
    url: page.url,
  }));

  // Create links based on simulated similarity within category
  const links: GraphLink[] = [];
  const nodeIds = new Set(nodes.map((n) => n.id));

  for (const node of nodes) {
    const similarNodes = nodes
      .filter((n) => n.id !== node.id)
      .slice(0, neighborsNum);

    for (const similarNode of similarNodes) {
      if (nodeIds.has(similarNode.id)) {
        links.push({
          source: node.id,
          target: similarNode.id,
          weight: Math.random(),
        });
      }
    }
  }

  // Deduplicate links
  const uniqueLinks = links.filter(
    (link, index, arr) =>
      arr.findIndex(
        (l) =>
          (l.source === link.source && l.target === link.target) ||
          (l.source === link.target && l.target === link.source)
      ) === index
  );

  return {
    nodes,
    links: uniqueLinks,
  };
}
