import type {
  Embedding,
  ProductEmbedding,
  Product,
  SearchProductsResponse,
} from "../../shared/types";

const SEARCH_SERVER_URL =
  process.env.SEARCH_SERVER_URL || "http://localhost:4000";

export async function searchProductsForCategory(
  category: string
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${SEARCH_SERVER_URL}/search-products?q=${encodeURIComponent(
        category
      )}&limit=2`
    );

    if (!response.ok) {
      console.error(
        `Search server error: ${response.status} ${response.statusText}`
      );
      return getFallbackProducts(category);
    }

    const responseBody: SearchProductsResponse = await response.json();

    // Transform search results to Product format
    return responseBody.results.map((result: ProductEmbedding) => ({
      id: result.subdomain,
      name: result.name,
      summary: result.summary,
      docsUrl: `https://${result.subdomain}.mintlify.app/${result.path}`,
      customerPageFilepaths: result.customerPageFilepaths,
    }));
  } catch (error) {
    console.error("Failed to fetch products from search server:", error);
    return getFallbackProducts(category);
  }
}

function getFallbackProducts(category: string): Product[] {
  const productMap: Record<string, Product[]> = {
    frontend: [
      {
        id: "react",
        name: "React",
        summary: "A JavaScript library for building user interfaces",
        docsUrl: "https://react.dev",
      },
      {
        id: "vue",
        name: "Vue.js",
        summary: "Progressive JavaScript framework",
        docsUrl: "https://vuejs.org",
      },
      {
        id: "svelte",
        name: "Svelte",
        summary: "Cybernetically enhanced web apps",
        docsUrl: "https://svelte.dev",
      },
      {
        id: "nextjs",
        name: "Next.js",
        summary: "The React framework for production",
        docsUrl: "https://nextjs.org",
      },
    ],
    authentication: [
      {
        id: "auth0",
        name: "Auth0",
        summary: "Identity platform for developers",
        docsUrl: "https://auth0.com",
      },
      {
        id: "firebase-auth",
        name: "Firebase Auth",
        summary: "Google's authentication service",
        docsUrl: "https://firebase.google.com",
      },
      {
        id: "supabase-auth",
        name: "Supabase Auth",
        summary: "Open source authentication",
        docsUrl: "https://supabase.com",
      },
      {
        id: "clerk",
        name: "Clerk",
        summary: "Complete user management",
        docsUrl: "https://clerk.com",
      },
    ],
    database: [
      {
        id: "postgresql",
        name: "PostgreSQL",
        summary: "Advanced open source database",
        docsUrl: "https://www.postgresql.org",
      },
      {
        id: "mongodb",
        name: "MongoDB",
        summary: "Document database",
        docsUrl: "https://www.mongodb.com",
      },
      {
        id: "redis",
        name: "Redis",
        summary: "In-memory data structure store",
        docsUrl: "https://redis.io",
      },
      {
        id: "supabase",
        name: "Supabase",
        summary: "Open source Firebase alternative",
        docsUrl: "https://supabase.com",
      },
    ],
    deployment: [
      {
        id: "vercel",
        name: "Vercel",
        summary: "Frontend cloud platform",
        docsUrl: "https://vercel.com",
      },
      {
        id: "netlify",
        name: "Netlify",
        summary: "Web development platform",
        docsUrl: "https://www.netlify.com",
      },
      {
        id: "railway",
        name: "Railway",
        summary: "Deploy anything to the cloud",
        docsUrl: "https://railway.app",
      },
      {
        id: "render",
        name: "Render",
        summary: "Cloud platform for modern apps",
        docsUrl: "https://render.com",
      },
    ],
    payments: [
      {
        id: "stripe",
        name: "Stripe",
        summary: "Online payment processing",
        docsUrl: "https://stripe.com",
      },
      {
        id: "paypal",
        name: "PayPal",
        summary: "Digital payments platform",
        docsUrl: "https://www.paypal.com",
      },
      {
        id: "square",
        name: "Square",
        summary: "Payment and point-of-sale solutions",
        docsUrl: "https://squareup.com",
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
