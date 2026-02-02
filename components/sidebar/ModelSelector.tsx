"use client";

import { useStore } from "@/lib/store";
import { MODELS } from "@/lib/ai/provider";

export default function ModelSelector() {
  const selectedModel = useStore((s) => s.settings.selectedModel);
  const updateSettings = useStore((s) => s.updateSettings);

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Model</h3>
      <select
        value={selectedModel}
        onChange={(e) => updateSettings({ selectedModel: e.target.value })}
        className="w-full text-sm border rounded px-2 py-1.5 outline-none focus:border-blue-400 bg-white"
      >
        {MODELS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
}
