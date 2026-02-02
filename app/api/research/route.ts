import { streamObject } from "ai";
import { researchResponseSchema } from "@/lib/ai/schemas";
import { buildPrompt } from "@/lib/ai/prompts";
import { getModel } from "@/lib/ai/provider";
import type { ResearchRequest } from "@/lib/types";

export async function POST(req: Request) {
  const body: ResearchRequest = await req.json();
  const { question, contextPath, action, customPrompt, provider, modelId, apiKey } = body;

  if (!apiKey) {
    return Response.json({ error: "API key is required" }, { status: 400 });
  }

  const model = getModel(provider, modelId, apiKey);
  const { system, user } = buildPrompt(question, contextPath, action, customPrompt);

  const result = streamObject({
    model,
    schema: researchResponseSchema,
    system,
    prompt: user,
  });

  return result.toTextStreamResponse();
}
