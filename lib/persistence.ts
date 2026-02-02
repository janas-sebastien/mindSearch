import type { Project, AppSettings } from "./types";

const PROJECTS_KEY = "mindsearch_projects";
const SETTINGS_KEY = "mindsearch_settings";

const defaultSettings: AppSettings = {
  apiKeys: { openai: "", anthropic: "", google: "" },
  selectedModel: "gpt-4o",
  sidebarOpen: true,
};

export function loadProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function saveProject(project: Project) {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.push(project);
  }
  saveProjects(projects);
}

export function deleteProject(id: string) {
  const projects = loadProjects().filter((p) => p.id !== id);
  saveProjects(projects);
}

export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
