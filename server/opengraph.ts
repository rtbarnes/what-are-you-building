import type { Product, Page } from "../shared/types";

interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  site?: string;
}

export async function fetchOpenGraphData(url: string): Promise<OpenGraphData> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OpenGraphBot/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Extract OpenGraph meta tags
    const ogTitleMatch = html.match(
      /<meta property="og:title" content="([^"]*)"[^>]*>/i
    );
    const ogDescriptionMatch = html.match(
      /<meta property="og:description" content="([^"]*)"[^>]*>/i
    );
    const ogImageMatch = html.match(
      /<meta property="og:image" content="([^"]*)"[^>]*>/i
    );
    const ogSiteMatch = html.match(
      /<meta property="og:site_name" content="([^"]*)"[^>]*>/i
    );

    return {
      title: ogTitleMatch?.[1],
      description: ogDescriptionMatch?.[1],
      image: ogImageMatch?.[1]?.replaceAll("amp;", ""),
      site: ogSiteMatch?.[1],
    };
  } catch (error) {
    console.error(`Failed to fetch OpenGraph data for ${url}:`, error);
    return {};
  }
}

export async function enrichProductWithOpenGraph(
  product: Product
): Promise<Product> {
  // Use docsUrl if available to fetch OpenGraph data
  if (product.docsUrl) {
    const ogData = await fetchOpenGraphData(product.docsUrl);

    return {
      ...product,
      image: ogData.image,
      description: ogData.description,
      site: ogData.site,
    };
  }

  return product;
}

export async function enrichPageWithOpenGraph(page: Page): Promise<Page> {
  try {
    const ogData = await fetchOpenGraphData(page.url);

    return {
      ...page,
      description: ogData.description || page.description,
      image: ogData.image || page.image,
      site: ogData.site || page.site,
    };
  } catch (error) {
    console.error(`Failed to enrich page ${page.url}:`, error);
    return page;
  }
}
