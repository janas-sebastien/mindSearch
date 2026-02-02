"use client";

import { useStore } from "@/lib/store";
import type { AIProvider } from "@/lib/types";

const providers: { key: AIProvider; label: string }[] = [
  { key: "openai", label: "OpenAI" },
  { key: "anthropic", label: "Anthropic" },
  { key: "google", label: "Google" },
];

export default function APIKeySettings() {
  const apiKeys = useStore((s) => s.settings.apiKeys);
  const updateSettings = useStore((s) => s.updateSettings);

  const setKey = (provider: AIProvider, value: string) => {
    updateSettings({ apiKeys: { ...apiKeys, [provider]: value } });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">API Keys</h3>
      {providers.map(({ key, label }) => (
        <div key={key}>
          <label className="block text-xs text-gray-600 mb-1">{label}</label>
          <input
            type="password"
            value={apiKeys[key]}
            onChange={(e) => setKey(key, e.target.value)}
            placeholder={`${label} API key...`}
            className="w-full text-xs border rounded px-2 py-1.5 outline-none focus:border-blue-400 bg-white"
          />
        </div>
      ))}
    </div>
  );
}
