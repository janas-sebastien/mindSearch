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

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";
        let addedBranches = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Try to parse streamed JSON object
          try {
            const parsed = JSON.parse(buffer);
            if (parsed.branches && Array.isArray(parsed.branches) && !addedBranches) {
              const validBranches = parsed.branches.filter(
                (b: ResearchBranch) => b.title && b.summary && b.nodeType
              );
              if (validBranches.length > 0) {
                useStore.getState().addBranches(nodeId, validBranches);
                addedBranches = true;
              }
            }
          } catch {
            // Not valid JSON yet, keep buffering
          }
        }

        // Final parse attempt
        if (!addedBranches) {
          try {
            const parsed = JSON.parse(buffer);
            if (parsed.branches) {
              const validBranches = parsed.branches.filter(
                (b: ResearchBranch) => b.title && b.summary && b.nodeType
              );
              if (validBranches.length > 0) {
                useStore.getState().addBranches(nodeId, validBranches);
              }
            }
          } catch (e) {
            console.error("Failed to parse research response:", e);
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
