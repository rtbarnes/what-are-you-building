import type { Product } from "../../shared/types";

// Stub implementation - will be replaced with vector search
export async function searchProductsForCategory(
  category: string
): Promise<Product[]> {
  // Simulate async search
  await new Promise((resolve) =>
    setTimeout(resolve, 200 + Math.random() * 300)
  );

  const productMap: Record<string, Product[]> = {
    frontend: [
      {
        id: "react",
        name: "React",
        summary: "A JavaScript library for building user interfaces",
      },
      {
        id: "vue",
        name: "Vue.js",
        summary: "Progressive JavaScript framework",
      },
      {
        id: "svelte",
        name: "Svelte",
        summary: "Cybernetically enhanced web apps",
      },
      {
        id: "nextjs",
        name: "Next.js",
        summary: "The React framework for production",
      },
    ],
    authentication: [
      {
        id: "auth0",
        name: "Auth0",
        summary: "Identity platform for developers",
      },
      {
        id: "firebase-auth",
        name: "Firebase Auth",
        summary: "Google's authentication service",
      },
      {
        id: "supabase-auth",
        name: "Supabase Auth",
        summary: "Open source authentication",
      },
      { id: "clerk", name: "Clerk", summary: "Complete user management" },
    ],
    database: [
      {
        id: "postgresql",
        name: "PostgreSQL",
        summary: "Advanced open source database",
      },
      { id: "mongodb", name: "MongoDB", summary: "Document database" },
      { id: "redis", name: "Redis", summary: "In-memory data structure store" },
      {
        id: "supabase",
        name: "Supabase",
        summary: "Open source Firebase alternative",
      },
    ],
    deployment: [
      { id: "vercel", name: "Vercel", summary: "Frontend cloud platform" },
      { id: "netlify", name: "Netlify", summary: "Web development platform" },
      {
        id: "railway",
        name: "Railway",
        summary: "Deploy anything to the cloud",
      },
      {
        id: "render",
        name: "Render",
        summary: "Cloud platform for modern apps",
      },
    ],
    payments: [
      { id: "stripe", name: "Stripe", summary: "Online payment processing" },
      { id: "paypal", name: "PayPal", summary: "Digital payments platform" },
      {
        id: "square",
        name: "Square",
        summary: "Payment and point-of-sale solutions",
      },
    ],
  };

  return (
    productMap[category.toLowerCase()] || [
      {
        id: "placeholder",
        name: `${category} Solution`,
        summary: `Popular ${category} option`,
      },
    ]
  );
}
