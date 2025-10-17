import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
import { z } from "zod";
import { CategoriesResponseSchema } from "../../shared/types";

export async function getBroadCategories(prompt: string): Promise<string[]> {
  const result = await generateObject({
    model: openrouter("gpt-4o-mini"),
    prompt: `Given this project description: "${prompt}"

Generate 3-5 broad technology categories that would be relevant for building this project. Return only the category names as an array of strings.

Examples: ["frontend", "authentication", "database", "deployment", "payments"]`,
    schema: CategoriesResponseSchema,
  });

  return result.object.categories;
}

const RelevantPagesSchema = z.object({
  pages: z.array(z.string()),
});

export async function getRelevantPageURLs(
  prompt: string,
  pageFilepaths: string[]
): Promise<string[]> {
  // If there are 5 or less pages, return all of them
  if (pageFilepaths.length <= 5) {
    return pageFilepaths;
  }

  const result = await generateObject({
    model: openrouter("google/gemini-2.5-flash-lite-preview-09-2025"),
    prompt: `Given this user's project description: "${prompt}"

And these documentation pages:
${pageFilepaths.join("\n")}

Select the 5 most relevant pages that would help someone build this project. Return exactly the FULL URLs as they appear in the list above.`,
    schema: RelevantPagesSchema,
  });

  console.log("Relevant pages:", result.object.pages);

  return result.object.pages;
}
