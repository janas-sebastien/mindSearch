import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  loadProjects,
  saveProjects,
  saveProject,
  deleteProject,
  loadSettings,
  saveSettings,
} from "@/lib/persistence";
import type { Project, AppSettings } from "@/lib/types";

describe("persistence", () => {
  const mockProject: Project = {
    id: "test-project-1",
    name: "Test Project",
    nodes: [],
    edges: [],
    createdAt: 1000,
    updatedAt: 1000,
  };

  const mockSettings: AppSettings = {
    apiKeys: { openai: "test-key", anthropic: "", google: "" },
    selectedModel: "gpt-4o",
    sidebarOpen: true,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe("loadProjects", () => {
    it("returns empty array when no projects saved", () => {
      expect(loadProjects()).toEqual([]);
    });

    it("loads saved projects", () => {
      localStorage.setItem("mindsearch_projects", JSON.stringify([mockProject]));
      expect(loadProjects()).toEqual([mockProject]);
    });

    it("returns empty array on parse error", () => {
      localStorage.setItem("mindsearch_projects", "invalid json");
      expect(loadProjects()).toEqual([]);
    });
  });

  describe("saveProjects", () => {
    it("saves projects to localStorage", () => {
      saveProjects([mockProject]);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "mindsearch_projects",
        JSON.stringify([mockProject])
      );
    });
  });

  describe("saveProject", () => {
    it("adds new project", () => {
      saveProject(mockProject);
      const projects = loadProjects();
      expect(projects).toHaveLength(1);
      expect(projects[0].id).toBe(mockProject.id);
    });

    it("updates existing project", () => {
      saveProject(mockProject);
      const updatedProject = { ...mockProject, name: "Updated Name" };
      saveProject(updatedProject);
      const projects = loadProjects();
      expect(projects).toHaveLength(1);
      expect(projects[0].name).toBe("Updated Name");
    });
  });

  describe("deleteProject", () => {
    it("removes project by id", () => {
      saveProjects([mockProject, { ...mockProject, id: "test-2" }]);
      deleteProject(mockProject.id);
      const projects = loadProjects();
      expect(projects).toHaveLength(1);
      expect(projects[0].id).toBe("test-2");
    });

    it("handles deleting non-existent project", () => {
      saveProjects([mockProject]);
      deleteProject("non-existent");
      expect(loadProjects()).toHaveLength(1);
    });
  });

  describe("loadSettings", () => {
    it("returns default settings when none saved", () => {
      const settings = loadSettings();
      expect(settings.selectedModel).toBe("gpt-4o");
      expect(settings.sidebarOpen).toBe(true);
      expect(settings.apiKeys).toEqual({ openai: "", anthropic: "", google: "" });
    });

    it("loads saved settings", () => {
      localStorage.setItem("mindsearch_settings", JSON.stringify(mockSettings));
      const settings = loadSettings();
      expect(settings.apiKeys.openai).toBe("test-key");
    });

    it("merges saved settings with defaults", () => {
      localStorage.setItem(
        "mindsearch_settings",
        JSON.stringify({ selectedModel: "claude-sonnet" })
      );
      const settings = loadSettings();
      expect(settings.selectedModel).toBe("claude-sonnet");
      expect(settings.sidebarOpen).toBe(true);
    });

    it("returns defaults on parse error", () => {
      localStorage.setItem("mindsearch_settings", "invalid");
      const settings = loadSettings();
      expect(settings.selectedModel).toBe("gpt-4o");
    });
  });

  describe("saveSettings", () => {
    it("saves settings to localStorage", () => {
      saveSettings(mockSettings);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "mindsearch_settings",
        JSON.stringify(mockSettings)
      );
    });
  });
});
