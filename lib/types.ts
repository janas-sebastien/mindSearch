import type { Node, Edge } from "@xyflow/react";

export type NodeType = "question" | "topic" | "detail" | "example" | "illustration";

export type AIProvider = "openai" | "anthropic" | "google";

export interface ModelConfig {
  id: string;
  name: string;
  provider: AIProvider;
  modelId: string;
}

export interface MindNodeData {
  label: string;
  summary: string;
  nodeType: NodeType;
  isLoading?: boolean;
  isStreaming?: boolean;
  [key: string]: unknown;
}

export type MindNode = Node<MindNodeData>;
export type MindEdge = Edge;

export interface ResearchBranch {
  title: string;
  summary: string;
  nodeType: NodeType;
}

export interface ResearchResponse {
  branches: ResearchBranch[];
}

export interface ResearchRequest {
  question: string;
  contextPath: string[];
  action: "initial" | "deeper" | "examples" | "illustrations" | "custom";
  customPrompt?: string;
  provider: AIProvider;
  modelId: string;
  apiKey: string;
}

export interface Project {
  id: string;
  name: string;
  nodes: MindNode[];
  edges: MindEdge[];
  createdAt: number;
  updatedAt: number;
}

export interface APIKeySettings {
  openai: string;
  anthropic: string;
  google: string;
}

export interface AppSettings {
  apiKeys: APIKeySettings;
  selectedModel: string;
  sidebarOpen: boolean;
}
