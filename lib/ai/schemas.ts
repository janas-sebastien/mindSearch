import { z } from "zod";

export const researchBranchSchema = z.object({
  title: z.string().describe("Short title for this research branch (3-8 words)"),
  summary: z.string().describe("Brief summary of the finding (1-3 sentences)"),
  nodeType: z
    .enum(["topic", "detail", "example", "illustration"])
    .describe("The type of content this branch represents"),
});

export const researchResponseSchema = z.object({
  branches: z
    .array(researchBranchSchema)
    .min(2)
    .max(6)
    .describe("Research branches to add to the mind map"),
});
