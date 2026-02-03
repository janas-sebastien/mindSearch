import { describe, it, expect, vi } from "vitest";
import { MODELS, getModel } from "@/lib/ai/provider";

// Mock the AI SDK providers
vi.mock("@ai-sdk/openai", () => ({
  createOpenAI: vi.fn(() => vi.fn((modelId: string) => ({ provider: "openai", modelId }))),
}));

vi.mock("@ai-sdk/anthropic", () => ({
  createAnthropic: vi.fn(() => vi.fn((modelId: string) => ({ provider: "anthropic", modelId }))),
}));

vi.mock("@ai-sdk/google", () => ({
  createGoogleGenerativeAI: vi.fn(() => vi.fn((modelId: string) => ({ provider: "google", modelId }))),
}));

describe("MODELS configuration", () => {
  it("contains expected models", () => {
    expect(MODELS.length).toBeGreaterThanOrEqual(6);
  });

  it("has unique IDs for all models", () => {
    const ids = MODELS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes OpenAI models", () => {
    const openaiModels = MODELS.filter((m) => m.provider === "openai");
    expect(openaiModels.length).toBeGreaterThanOrEqual(2);
    expect(openaiModels.some((m) => m.id === "gpt-4o")).toBe(true);
    expect(openaiModels.some((m) => m.id === "gpt-4o-mini")).toBe(true);
  });

  it("includes Anthropic models", () => {
    const anthropicModels = MODELS.filter((m) => m.provider === "anthropic");
    expect(anthropicModels.length).toBeGreaterThanOrEqual(2);
    expect(anthropicModels.some((m) => m.id === "claude-sonnet")).toBe(true);
    expect(anthropicModels.some((m) => m.id === "claude-haiku")).toBe(true);
  });

  it("includes Google models", () => {
    const googleModels = MODELS.filter((m) => m.provider === "google");
    expect(googleModels.length).toBeGreaterThanOrEqual(2);
    expect(googleModels.some((m) => m.id === "gemini-pro")).toBe(true);
    expect(googleModels.some((m) => m.id === "gemini-flash")).toBe(true);
  });

  it("all models have required fields", () => {
    MODELS.forEach((model) => {
      expect(model.id).toBeTruthy();
      expect(model.name).toBeTruthy();
      expect(model.provider).toBeTruthy();
      expect(model.modelId).toBeTruthy();
      expect(["openai", "anthropic", "google"]).toContain(model.provider);
    });
  });
});

describe("getModel", () => {
  it("creates OpenAI model correctly", () => {
    const model = getModel("openai", "gpt-4o", "test-key");
    expect(model).toEqual({ provider: "openai", modelId: "gpt-4o" });
  });

  it("creates Anthropic model correctly", () => {
    const model = getModel("anthropic", "claude-sonnet-4-20250514", "test-key");
    expect(model).toEqual({ provider: "anthropic", modelId: "claude-sonnet-4-20250514" });
  });

  it("creates Google model correctly", () => {
    const model = getModel("google", "gemini-2.0-flash", "test-key");
    expect(model).toEqual({ provider: "google", modelId: "gemini-2.0-flash" });
  });
});
