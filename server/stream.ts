import { Response } from "express";
import { Page } from "../shared/types";

export function withNDJSONHeaders(res: Response): void {
  res.setHeader("Content-Type", "application/x-ndjson");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
}

export function writeEvent(res: Response, event: any): void {
  res.write(JSON.stringify(event) + "\n");
}

export function writeStatus(res: Response, message: string): void {
  writeEvent(res, { type: "status", message });
}

export function writeCategories(res: Response, categories: string[]): void {
  writeEvent(res, { type: "categories", categories });
}

export function writeProduct(
  res: Response,
  category: string,
  product: any
): void {
  writeEvent(res, { type: "product", category, product });
}

export function writeProductDetail(
  res: Response,
  productId: string,
  page: Page
): void {
  writeEvent(res, { type: "product-detail", productId, page });
}

export function writeGraph(res: Response, category: string, graph: any): void {
  writeEvent(res, { type: "graph", category, graph });
}

export function writeDone(res: Response): void {
  writeEvent(res, { type: "done" });
}
