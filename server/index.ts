import cors from "cors";
import express from "express";
import { getBroadCategories } from "./llm/openai";
import { searchProductsForCategory } from "./datasets/products";
import { searchProductPages } from "./datasets/pages";
import {
  withNDJSONHeaders,
  writeStatus,
  writeCategory,
  writeProduct,
  writeProductDetail,
  writeDone,
} from "./stream";
import { BuildRequestSchema } from "../shared/types";

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
  try {
    const { prompt } = BuildRequestSchema.parse(req.body);
    withNDJSONHeaders(res);

    writeStatus(res, "Analyzing your project description...");

    // Phase 1: Generate categories
    const categories = await getBroadCategories(prompt);

    writeStatus(res, "Searching for relevant technologies...");

    // Phase 2: Search products for each category
    const allProducts: Array<{ category: string; product: any }> = [];

    for (const category of categories) {
      writeCategory(res, category);
      const products = await searchProductsForCategory(category);

      for (const product of products) {
        writeProduct(res, category, product);
        allProducts.push({ category, product });
      }
    }

    writeStatus(res, "Finding detailed resources...");

    // Phase 3: Search pages for each product
    for (const { product } of allProducts) {
      const pages = await searchProductPages(product.id);

      for (const page of pages) {
        writeProductDetail(res, product.id, page);
      }
    }

    writeDone(res);
    res.end();
  } catch (error) {
    console.error("Error in /api/build:", error);
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
