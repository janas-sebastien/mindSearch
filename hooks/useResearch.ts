"use client";

import { useCallback } from "react";
import { useStore } from "@/lib/store";
import { MODELS } from "@/lib/ai/provider";
import type { ResearchRequest, ResearchBranch } from "@/lib/types";

function getContextPath(nodeId: string): string[] {
  const { nodes, edges } = useStore.getState();
  const path: string[] = [];
  let currentId: string | null = nodeId;

  while (currentId) {
    const node = nodes.find((n) => n.id === currentId);
    if (node) {
      path.unshift(node.data.label);
    }
    const parentEdge = edges.find((e) => e.target === currentId);
    currentId = parentEdge ? parentEdge.source : null;
  }

  return path;
}

export function useResearch() {
  const research = useCallback(
    async (
      nodeId: string,
      action: ResearchRequest["action"],
      customPrompt?: string
    ) => {
      const store = useStore.getState();
      const { settings } = store;
      const modelConfig = MODELS.find((m) => m.id === settings.selectedModel);
      if (!modelConfig) return;

      const apiKey = settings.apiKeys[modelConfig.provider];
      if (!apiKey) {
        alert(`Please set your ${modelConfig.provider} API key in the sidebar settings.`);
        return;
      }

      const node = store.nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const contextPath = getContextPath(nodeId);

      store.setNodeLoading(nodeId, true);

      try {
        const body: ResearchRequest = {
          question: node.data.label,
          contextPath,
          action,
          customPrompt,
          provider: modelConfig.provider,
          modelId: modelConfig.modelId,
          apiKey,
        };

        const response = await fetch("/api/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const err = await response.text();
          throw new Error(err);
        }

        store.setNodeStreaming(nodeId, true);

        const data = await response.json();
        if (data.branches && Array.isArray(data.branches)) {
          const validBranches = data.branches.filter(
            (b: ResearchBranch) => b.title && b.summary && b.nodeType
          );
          if (validBranches.length > 0) {
            useStore.getState().addBranches(nodeId, validBranches);
          }
        }
      } catch (error) {
        console.error("Research error:", error);
        alert(`Research failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      } finally {
        useStore.getState().setNodeLoading(nodeId, false);
        useStore.getState().setNodeStreaming(nodeId, false);
        useStore.getState().persistCurrentProject();
      }
    },
    []
  );

  return { research };
}
