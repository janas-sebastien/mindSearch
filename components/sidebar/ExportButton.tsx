"use client";

import { useStore } from "@/lib/store";

export default function ExportButton() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const projectName = useStore((s) => s.projectName);

  const handleExport = () => {
    const data = { name: projectName, nodes, edges, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName || "mindsearch"}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={nodes.length === 0}
      className="w-full text-xs text-gray-600 hover:text-gray-900 border rounded px-3 py-1.5 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Export as JSON
    </button>
  );
}
