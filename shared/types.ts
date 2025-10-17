import { z } from "zod";

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
});
export type Product = z.infer<typeof ProductSchema>;

export const PageSchema = z.object({
  title: z.string(),
  url: z.string(),
});
export type Page = z.infer<typeof PageSchema>;

// Stream event types
export const StreamEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("status"),
    message: z.string(),
  }),
  z.object({
    type: z.literal("category"),
    category: z.string(),
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
