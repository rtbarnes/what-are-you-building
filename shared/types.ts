import { z } from "zod";

export type SearchProductsResponse = {
  query: string;
  results: ProductEmbedding[];
  total: number;
};

export type SearchPagesResponse = {
  query: string;
  results: Embedding[];
  total: number;
};

export type Embedding = {
  subdomain: string;
  customDomain: string;
  path: string;
  distance: number;
};

export type ProductEmbedding = Embedding & {
  summary: string;
};

// Chat message types
export const ChatRoleSchema = z.enum(["user", "assistant"]);
export type ChatRole = z.infer<typeof ChatRoleSchema>;

export const ProductCardSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  features: z.array(
    z.object({
      text: z.string(),
      link: z.string().optional(),
    })
  ),
});
export type ProductCard = z.infer<typeof ProductCardSchema>;

export const ChatMessageSchema = z.object({
  id: z.string(),
  role: ChatRoleSchema,
  content: z.string(),
  timestamp: z.number(),
  productCard: ProductCardSchema.optional(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Product and page types
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string().optional(),
  docsUrl: z.string().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  site: z.string().optional(),
});
export type Product = z.infer<typeof ProductSchema>;

export const PageSchema = z.object({
  title: z.string(),
  url: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  site: z.string().optional(),
});
export type Page = z.infer<typeof PageSchema>;

// Stream event types
export const StreamEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("status"),
    message: z.string(),
  }),
  z.object({
    type: z.literal("categories"),
    categories: z.array(z.string()),
  }),
  z.object({
    type: z.literal("product"),
    category: z.string(),
    product: ProductSchema,
  }),
  z.object({
    type: z.literal("product-detail"),
    productId: z.string(),
    page: PageSchema,
  }),
  z.object({
    type: z.literal("graph"),
    category: z.string(),
    graph: z.object({
      nodes: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          score: z.number().optional(),
          group: z.string().optional(),
        })
      ),
      links: z.array(
        z.object({
          source: z.string(),
          target: z.string(),
          weight: z.number().optional(),
        })
      ),
    }),
  }),
  z.object({
    type: z.literal("done"),
  }),
]);
export type StreamEvent = z.infer<typeof StreamEventSchema>;

// API request/response types
export const BuildRequestSchema = z.object({
  prompt: z.string(),
});
export type BuildRequest = z.infer<typeof BuildRequestSchema>;

// LLM response types
export const CategoriesResponseSchema = z.object({
  categories: z.array(z.string()),
});
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;

// Graph visualization types
export type GraphNode = {
  id: string; // result id
  label: string; // title or name
  score?: number; // relevance score from the main query
  group?: string; // e.g., dataset/product/page or other tagging
  // Page-specific metadata
  productId?: string; // ID of the product this page belongs to
  productName?: string; // Name of the product this page belongs to
  url?: string; // URL of the page
};

export type GraphLink = {
  source: string; // node id
  target: string; // node id
  weight?: number; // similarity score
};

export type SearchGraph = {
  nodes: GraphNode[];
  links: GraphLink[];
};
