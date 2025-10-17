import cors from "cors";
import express from "express";
import { getBroadCategories } from "./llm/openai";
import { searchProductsForCategory } from "./datasets/products";
import { searchProductPages } from "./datasets/pages";
import {
  enrichProductWithOpenGraph,
  enrichPageWithOpenGraph,
} from "./opengraph";
import {
  withNDJSONHeaders,
  writeStatus,
  writeCategories,
  writeProduct,
  writeProductDetail,
  writeGraph,
  writeDone,
} from "./stream";
import {
  BuildRequestSchema,
  SearchGraph,
  GraphNode,
  GraphLink,
} from "../shared/types";

const app = express();

app.use(cors());
app.use(express.json());

// Helper function to generate graph for a category
async function generateCategoryGraph(
  category: string,
  products: any[],
  neighborsNum: number = 5
): Promise<SearchGraph> {
  const nodes: GraphNode[] = products.map((product) => ({
    id: product.id,
    label: product.name,
    score: Math.random(), // Simulated relevance score
    group: category,
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

app.get("/", (_req, res) => {
  res.send("OK");
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/build", async (req, res) => {
  console.log("Received request:", req.body);
  try {
    const { prompt } = BuildRequestSchema.parse(req.body);
    withNDJSONHeaders(res);

    writeStatus(res, "Analyzing your project description...");

    // Phase 1: Generate categories
    const categories = [...(await getBroadCategories(prompt)), "deployment"];
    console.log("Generated categories:", categories);

    writeCategories(res, categories);
    writeStatus(res, "Searching for relevant technologies...");

    // Phase 2: Search products for each category
    const allProducts: Array<{ category: string; product: any }> = [];

    for (const category of categories) {
      const products = await searchProductsForCategory(category);

      for (const product of products) {
        const enrichedProduct = await enrichProductWithOpenGraph(product);
        writeProduct(res, category, enrichedProduct);
        allProducts.push({ category, product: enrichedProduct });
      }

      // Generate and stream graph for this category
      if (products.length > 0) {
        const categoryGraph = await generateCategoryGraph(category, products);
        writeGraph(res, category, categoryGraph);
      }
    }

    writeStatus(res, "Finding detailed resources...");

    // Phase 3: Search pages for each product
    for (const { product } of allProducts) {
      const pages = await searchProductPages(product.id);

      for (const page of pages) {
        const enrichedPage = await enrichPageWithOpenGraph(page);
        writeProductDetail(res, product.id, enrichedPage);
      }
    }

    writeDone(res);
    res.end();
  } catch (error) {
    if (!res.headersSent) {
      if (error instanceof Error && error.name === "ZodError") {
        res.status(400).json({ error: "Invalid request format" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.end();
    }
  }
});

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`);
});

export default app;
