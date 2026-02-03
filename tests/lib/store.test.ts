import { describe, it, expect, beforeEach, vi } from "vitest";
import { useStore } from "@/lib/store";
import type { ResearchBranch } from "@/lib/types";

// Mock persistence module
vi.mock("@/lib/persistence", () => ({
  loadSettings: vi.fn(() => ({
    apiKeys: { openai: "", anthropic: "", google: "" },
    selectedModel: "gpt-4o",
    sidebarOpen: true,
  })),
  saveSettings: vi.fn(),
  saveProject: vi.fn(),
  loadProjects: vi.fn(() => []),
}));

describe("useStore", () => {
  beforeEach(() => {
    // Reset store to initial state
    useStore.setState({
      nodes: [],
      edges: [],
      projectId: null,
      projectName: "",
      ui: {
        showQuestionInput: true,
        contextMenu: null,
        expandedNodeId: null,
      },
    });
  });

  describe("initProject", () => {
    it("creates a new project with root node", () => {
      const { initProject } = useStore.getState();
      const rootId = initProject("What is AI?");

      const state = useStore.getState();
      expect(state.projectId).toBeTruthy();
      expect(state.projectName).toBe("What is AI?");
      expect(state.nodes).toHaveLength(1);
      expect(state.nodes[0].id).toBe(rootId);
      expect(state.nodes[0].data.label).toBe("What is AI?");
      expect(state.nodes[0].data.nodeType).toBe("question");
      expect(state.ui.showQuestionInput).toBe(false);
    });

    it("truncates long project names", () => {
      const { initProject } = useStore.getState();
      const longQuestion = "A".repeat(100);
      initProject(longQuestion);

      const state = useStore.getState();
      expect(state.projectName.length).toBe(50);
    });
  });

  describe("addBranches", () => {
    it("adds child nodes to parent", () => {
      const { initProject, addBranches } = useStore.getState();
      const rootId = initProject("Test question");

      const branches: ResearchBranch[] = [
        { title: "Branch 1", summary: "Summary 1", nodeType: "topic" },
        { title: "Branch 2", summary: "Summary 2", nodeType: "detail" },
      ];

      addBranches(rootId, branches);

      const state = useStore.getState();
      expect(state.nodes).toHaveLength(3); // root + 2 branches
      expect(state.edges).toHaveLength(2);

      // Check edges connect to root
      state.edges.forEach((edge) => {
        expect(edge.source).toBe(rootId);
      });
    });

    it("does nothing if parent node not found", () => {
      const { initProject, addBranches } = useStore.getState();
      initProject("Test");

      const branches: ResearchBranch[] = [
        { title: "Branch", summary: "Summary", nodeType: "topic" },
      ];

      addBranches("non-existent-id", branches);

      const state = useStore.getState();
      expect(state.nodes).toHaveLength(1); // Only root node
      expect(state.edges).toHaveLength(0);
    });
  });

  describe("setNodeLoading", () => {
    it("sets loading state on node", () => {
      const { initProject, setNodeLoading } = useStore.getState();
      const rootId = initProject("Test");

      setNodeLoading(rootId, true);
      expect(useStore.getState().nodes[0].data.isLoading).toBe(true);

      setNodeLoading(rootId, false);
      expect(useStore.getState().nodes[0].data.isLoading).toBe(false);
    });
  });

  describe("setNodeStreaming", () => {
    it("sets streaming state on node", () => {
      const { initProject, setNodeStreaming } = useStore.getState();
      const rootId = initProject("Test");

      setNodeStreaming(rootId, true);
      expect(useStore.getState().nodes[0].data.isStreaming).toBe(true);

      setNodeStreaming(rootId, false);
      expect(useStore.getState().nodes[0].data.isStreaming).toBe(false);
    });
  });

  describe("updateSettings", () => {
    it("updates partial settings", () => {
      const { updateSettings } = useStore.getState();

      updateSettings({ selectedModel: "claude-sonnet" });

      const state = useStore.getState();
      expect(state.settings.selectedModel).toBe("claude-sonnet");
      expect(state.settings.sidebarOpen).toBe(true); // Unchanged
    });
  });

  describe("setUI", () => {
    it("updates partial UI state", () => {
      const { setUI } = useStore.getState();

      setUI({ contextMenu: { x: 100, y: 200, nodeId: "test" } });

      const state = useStore.getState();
      expect(state.ui.contextMenu).toEqual({ x: 100, y: 200, nodeId: "test" });
      expect(state.ui.showQuestionInput).toBe(true); // Unchanged
    });
  });

  describe("reset", () => {
    it("resets store to initial state", () => {
      const { initProject, reset } = useStore.getState();
      initProject("Test");

      reset();

      const state = useStore.getState();
      expect(state.nodes).toHaveLength(0);
      expect(state.edges).toHaveLength(0);
      expect(state.projectId).toBeNull();
      expect(state.projectName).toBe("");
      expect(state.ui.showQuestionInput).toBe(true);
    });
  });

  describe("loadProject", () => {
    it("loads an existing project", () => {
      const { loadProject } = useStore.getState();
      const project = {
        id: "existing-project",
        name: "Existing Project",
        nodes: [
          {
            id: "node-1",
            type: "mindNode" as const,
            position: { x: 0, y: 0 },
            data: { label: "Test", summary: "Test", nodeType: "question" as const },
          },
        ],
        edges: [],
        createdAt: 1000,
        updatedAt: 1000,
      };

      loadProject(project);

      const state = useStore.getState();
      expect(state.projectId).toBe("existing-project");
      expect(state.projectName).toBe("Existing Project");
      expect(state.nodes).toEqual(project.nodes);
      expect(state.ui.showQuestionInput).toBe(false);
    });
  });
});
