import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateObject } from "ai";
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
