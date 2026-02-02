"use client";

import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import APIKeySettings from "./APIKeySettings";
import ModelSelector from "./ModelSelector";
import ProjectList from "./ProjectList";
import ExportButton from "./ExportButton";

export default function Sidebar() {
  const sidebarOpen = useStore((s) => s.settings.sidebarOpen);
  const updateSettings = useStore((s) => s.updateSettings);

  return (
    <>
      <button
        onClick={() => updateSettings({ sidebarOpen: !sidebarOpen })}
        className="fixed top-4 left-4 z-40 bg-white border rounded-lg p-2 shadow-sm hover:bg-gray-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div
        className={cn(
          "fixed top-0 left-0 h-full bg-white border-r shadow-lg z-30 transition-transform duration-200 w-64 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 pt-5 border-b">
          <h1 className="font-bold text-lg pl-8">MindSearch</h1>
          <p className="text-xs text-gray-500">AI-powered research explorer</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <ModelSelector />
          <APIKeySettings />
          <ProjectList />
        </div>
        <div className="p-4 border-t">
          <ExportButton />
        </div>
      </div>
    </>
  );
}
