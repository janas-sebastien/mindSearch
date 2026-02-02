"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { loadProjects, deleteProject } from "@/lib/persistence";
import type { Project } from "@/lib/types";

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const loadProject = useStore((s) => s.loadProject);
  const reset = useStore((s) => s.reset);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const refresh = () => setProjects(loadProjects());

  const handleDelete = (id: string) => {
    deleteProject(id);
    refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Projects</h3>
        <button
          onClick={() => { reset(); refresh(); }}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          + New
        </button>
      </div>
      {projects.length === 0 ? (
        <p className="text-xs text-gray-400">No saved projects</p>
      ) : (
        <div className="space-y-1">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between group text-xs hover:bg-gray-100 rounded px-2 py-1.5 cursor-pointer"
            >
              <span
                onClick={() => loadProject(p)}
                className="truncate flex-1"
                title={p.name}
              >
                {p.name}
              </span>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
