import type { Page } from "../../shared/types";

// Stub implementation - will be replaced with vector search
export async function searchProductPages(productId: string): Promise<Page[]> {
  // Simulate async search
  await new Promise((resolve) =>
    setTimeout(resolve, 150 + Math.random() * 200)
  );

  const pageMap: Record<string, Page[]> = {
    react: [
      { title: "Getting Started", url: "https://react.dev/learn" },
      {
        title: "Components and Props",
        url: "https://react.dev/learn/passing-props-to-a-component",
      },
      {
        title: "State Management",
        url: "https://react.dev/learn/state-a-components-memory",
      },
      { title: "Hooks Reference", url: "https://react.dev/reference/react" },
    ],
    nextjs: [
      { title: "Quick Start", url: "https://nextjs.org/docs/app" },
      {
        title: "Routing",
        url: "https://nextjs.org/docs/app/building-your-application/routing",
      },
      {
        title: "Data Fetching",
        url: "https://nextjs.org/docs/app/building-your-application/data-fetching",
      },
      {
        title: "Deployment",
        url: "https://nextjs.org/docs/app/building-your-application/deploying",
      },
    ],
    auth0: [
      { title: "Quick Start", url: "https://auth0.com/docs/quickstart/webapp" },
      {
        title: "Authentication API",
        url: "https://auth0.com/docs/api/authentication",
      },
      {
        title: "Management API",
        url: "https://auth0.com/docs/api/management/v2",
      },
      { title: "SDKs", url: "https://auth0.com/docs/libraries" },
    ],
    stripe: [
      { title: "Getting Started", url: "https://stripe.com/docs/stripe-js" },
      {
        title: "Payment Intents",
        url: "https://stripe.com/docs/api/payment_intents",
      },
      { title: "Webhooks", url: "https://stripe.com/docs/webhooks" },
      { title: "Testing", url: "https://stripe.com/docs/testing" },
    ],
    postgresql: [
      { title: "Documentation", url: "https://www.postgresql.org/docs/" },
      {
        title: "Tutorial",
        url: "https://www.postgresql.org/docs/current/tutorial.html",
      },
      {
        title: "SQL Reference",
        url: "https://www.postgresql.org/docs/current/sql.html",
      },
      {
        title: "Performance Tips",
        url: "https://wiki.postgresql.org/wiki/Performance_Optimization",
      },
    ],
    vercel: [
      { title: "Deploying", url: "https://vercel.com/docs/deployments" },
      {
        title: "Environment Variables",
        url: "https://vercel.com/docs/projects/environment-variables",
      },
      { title: "Functions", url: "https://vercel.com/docs/functions" },
      {
        title: "Edge Runtime",
        url: "https://vercel.com/docs/functions/edge-functions",
      },
    ],
  };

  return (
    pageMap[productId] || [
      { title: "Documentation", url: `https://${productId}.com/docs` },
      { title: "Getting Started", url: `https://${productId}.com/quickstart` },
      { title: "API Reference", url: `https://${productId}.com/api` },
    ]
  );
}
