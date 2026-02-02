import { create } from "zustand";
import {
  applyNodeChanges,
  applyEdgeChanges,
  type OnNodesChange,
  type OnEdgesChange,
} from "@xyflow/react";
import type {
  MindNode,
  MindEdge,
  AppSettings,
  Project,
  ResearchBranch,
  NodeType,
} from "./types";
import { generateId } from "./utils";
import { loadSettings, saveSettings, saveProject, loadProjects } from "./persistence";
import { calculateChildPositions } from "./layout";

interface UIState {
  showQuestionInput: boolean;
  contextMenu: { x: number; y: number; nodeId: string } | null;
}

interface AppState {
  // Mind map data
  nodes: MindNode[];
  edges: MindEdge[];
  projectId: string | null;
  projectName: string;

  // Settings
  settings: AppSettings;

  // UI
  ui: UIState;

  // React Flow handlers
  onNodesChange: OnNodesChange<MindNode>;
  onEdgesChange: OnEdgesChange<MindEdge>;

  // Actions
  initProject: (question: string) => string;
  loadProject: (project: Project) => void;
  addBranches: (parentId: string, branches: ResearchBranch[]) => void;
  setNodeLoading: (nodeId: string, loading: boolean) => void;
  setNodeStreaming: (nodeId: string, streaming: boolean) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setUI: (ui: Partial<UIState>) => void;
  persistCurrentProject: () => void;
  reset: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  nodes: [],
  edges: [],
  projectId: null,
  projectName: "",

  settings: loadSettings(),

  ui: {
    showQuestionInput: true,
    contextMenu: null,
  },

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  initProject: (question: string) => {
    const projectId = generateId();
    const rootNode: MindNode = {
      id: generateId(),
      type: "mindNode",
      position: { x: 0, y: 0 },
      data: {
        label: question,
        summary: question,
        nodeType: "question" as NodeType,
      },
    };

    set({
      projectId,
      projectName: question.slice(0, 50),
      nodes: [rootNode],
      edges: [],
      ui: { showQuestionInput: false, contextMenu: null },
    });

    return rootNode.id;
  },

  loadProject: (project: Project) => {
    set({
      projectId: project.id,
      projectName: project.name,
      nodes: project.nodes,
      edges: project.edges,
      ui: { showQuestionInput: false, contextMenu: null },
    });
  },

  addBranches: (parentId: string, branches: ResearchBranch[]) => {
    const { nodes, edges } = get();
    const parentNode = nodes.find((n) => n.id === parentId);
    if (!parentNode) return;

    const existingChildren = edges.filter((e) => e.source === parentId).length;
    const positions = calculateChildPositions(
      parentNode.position,
      branches.length,
      existingChildren
    );

    const newNodes: MindNode[] = branches.map((branch, i) => ({
      id: generateId(),
      type: "mindNode",
      position: positions[i],
      data: {
        label: branch.title,
        summary: branch.summary,
        nodeType: branch.nodeType,
      },
    }));

    const newEdges: MindEdge[] = newNodes.map((node) => ({
      id: `e-${parentId}-${node.id}`,
      source: parentId,
      target: node.id,
      type: "smoothstep",
    }));

    set({
      nodes: [...nodes, ...newNodes],
      edges: [...edges, ...newEdges],
    });
  },

  setNodeLoading: (nodeId: string, loading: boolean) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, isLoading: loading } } : n
      ),
    });
  },

  setNodeStreaming: (nodeId: string, streaming: boolean) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, isStreaming: streaming } } : n
      ),
    });
  },

  updateSettings: (partial: Partial<AppSettings>) => {
    const newSettings = { ...get().settings, ...partial };
    set({ settings: newSettings });
    saveSettings(newSettings);
  },

  setUI: (partial: Partial<UIState>) => {
    set({ ui: { ...get().ui, ...partial } });
  },

  persistCurrentProject: () => {
    const { projectId, projectName, nodes, edges } = get();
    if (!projectId) return;
    saveProject({
      id: projectId,
      name: projectName,
      nodes,
      edges,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },

  reset: () => {
    set({
      nodes: [],
      edges: [],
      projectId: null,
      projectName: "",
      ui: { showQuestionInput: true, contextMenu: null },
    });
  },
}));
