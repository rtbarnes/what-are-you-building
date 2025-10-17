import cors from "cors";
import express from "express";
import { getBroadCategories, getRelevantPageURLs } from "./llm/openai";
import { searchProductsForCategory } from "./datasets/products";
import { searchProductPages } from "./datasets/pages";
import {
  enrichProductWithOpenGraph,
  enrichPageWithOpenGraph,
  fetchOpenGraphData,
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
import { BuildRequestSchema } from "../shared/types";
import { generateCategoryGraph } from "./datasets/graph";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

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

    await Promise.all(
      categories.map(async (category) => {
        const products = await searchProductsForCategory(category);

        console.log("Products:", products);

        // Parallelize enrichment of products
        const enrichedProducts = await Promise.all(
          products.map((product) => enrichProductWithOpenGraph(product))
        );
        for (const enrichedProduct of enrichedProducts) {
          writeProduct(res, category, enrichedProduct);
          allProducts.push({ category, product: enrichedProduct });
        }
      })
    );

    writeStatus(res, "Finding detailed resources...");

    await Promise.all(
      allProducts.map(async (product) => {
        // console.log("Getting relevant pages for:", product.product);
        const relevantPageURLs = await getRelevantPageURLs(
          prompt,
          product.product.customerPageFilepaths
        );
        console.log("Relevant pages:", relevantPageURLs);

        await Promise.all(
          relevantPageURLs.map(async (url) => {
            writeProductDetail(res, product.product.id, {
              url,
              ...(await fetchOpenGraphData(url)),
            });
          })
        );
      })
    );

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
