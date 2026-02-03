import { describe, it, expect } from "vitest";
import { researchBranchSchema, researchResponseSchema } from "@/lib/ai/schemas";

describe("researchBranchSchema", () => {
  it("validates a valid branch", () => {
    const branch = {
      title: "Test Branch",
      summary: "This is a test summary.",
      nodeType: "topic" as const,
    };
    const result = researchBranchSchema.safeParse(branch);
    expect(result.success).toBe(true);
  });

  it("accepts all valid nodeTypes", () => {
    const nodeTypes = ["topic", "detail", "example", "illustration"] as const;
    nodeTypes.forEach((nodeType) => {
      const branch = { title: "Test", summary: "Summary", nodeType };
      const result = researchBranchSchema.safeParse(branch);
      expect(result.success).toBe(true);
    });
  });

  it("rejects invalid nodeType", () => {
    const branch = {
      title: "Test",
      summary: "Summary",
      nodeType: "invalid",
    };
    const result = researchBranchSchema.safeParse(branch);
    expect(result.success).toBe(false);
  });

  it("rejects missing title", () => {
    const branch = {
      summary: "Summary",
      nodeType: "topic",
    };
    const result = researchBranchSchema.safeParse(branch);
    expect(result.success).toBe(false);
  });

  it("rejects missing summary", () => {
    const branch = {
      title: "Test",
      nodeType: "topic",
    };
    const result = researchBranchSchema.safeParse(branch);
    expect(result.success).toBe(false);
  });
});

describe("researchResponseSchema", () => {
  const validBranch = {
    title: "Test Branch",
    summary: "Test summary",
    nodeType: "topic" as const,
  };

  it("validates response with 2-6 branches", () => {
    for (let count = 2; count <= 6; count++) {
      const response = {
        branches: Array(count).fill(validBranch),
      };
      const result = researchResponseSchema.safeParse(response);
      expect(result.success).toBe(true);
    }
  });

  it("rejects response with less than 2 branches", () => {
    const response = { branches: [validBranch] };
    const result = researchResponseSchema.safeParse(response);
    expect(result.success).toBe(false);
  });

  it("rejects response with more than 6 branches", () => {
    const response = { branches: Array(7).fill(validBranch) };
    const result = researchResponseSchema.safeParse(response);
    expect(result.success).toBe(false);
  });

  it("rejects empty branches array", () => {
    const response = { branches: [] };
    const result = researchResponseSchema.safeParse(response);
    expect(result.success).toBe(false);
  });

  it("rejects response without branches field", () => {
    const response = {};
    const result = researchResponseSchema.safeParse(response);
    expect(result.success).toBe(false);
  });
});
