import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { ModelConfig, AIProvider } from "../types";

export const MODELS: ModelConfig[] = [
  { id: "gpt-4o", name: "GPT-4o", provider: "openai", modelId: "gpt-4o" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai", modelId: "gpt-4o-mini" },
  { id: "claude-sonnet", name: "Claude Sonnet 4", provider: "anthropic", modelId: "claude-sonnet-4-20250514" },
  { id: "claude-haiku", name: "Claude Haiku 3.5", provider: "anthropic", modelId: "claude-3-5-haiku-20241022" },
  { id: "gemini-pro", name: "Gemini 2.0 Flash", provider: "google", modelId: "gemini-2.0-flash" },
  { id: "gemini-flash", name: "Gemini 2.0 Flash Lite", provider: "google", modelId: "gemini-2.0-flash-lite" },
];

export function getModel(provider: AIProvider, modelId: string, apiKey: string) {
  switch (provider) {
    case "openai": {
      const openai = createOpenAI({ apiKey });
      return openai(modelId);
    }
    case "anthropic": {
      const anthropic = createAnthropic({ apiKey });
      return anthropic(modelId);
    }
    case "google": {
      const google = createGoogleGenerativeAI({ apiKey });
      return google(modelId);
    }
  }
}
