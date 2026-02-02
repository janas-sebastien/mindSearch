"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { useResearch } from "@/hooks/useResearch";

export default function NodeContextMenu() {
  const contextMenu = useStore((s) => s.ui.contextMenu);
  const setUI = useStore((s) => s.setUI);
  const { research } = useResearch();
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setUI({ contextMenu: null });
    setShowCustom(false);
    setCustomPrompt("");
  }, [setUI]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [close]);

  if (!contextMenu) return null;

  const handleAction = (action: "deeper" | "examples" | "illustrations" | "custom") => {
    if (action === "custom" && !showCustom) {
      setShowCustom(true);
      return;
    }
    research(contextMenu.nodeId, action, action === "custom" ? customPrompt : undefined);
    close();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[200px]"
      style={{ left: contextMenu.x, top: contextMenu.y }}
    >
      <button
        onClick={() => handleAction("deeper")}
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
      >
        <span>🔍</span> Go deeper
      </button>
      <button
        onClick={() => handleAction("examples")}
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
      >
        <span>📋</span> Examples
      </button>
      <button
        onClick={() => handleAction("illustrations")}
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
      >
        <span>💡</span> Illustrations
      </button>
      <div className="border-t border-gray-100 my-1" />
      {showCustom ? (
        <div className="px-3 py-2">
          <input
            autoFocus
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customPrompt.trim()) handleAction("custom");
              if (e.key === "Escape") close();
            }}
            placeholder="Custom research prompt..."
            className="w-full text-sm border rounded px-2 py-1 outline-none focus:border-blue-400"
          />
        </div>
      ) : (
        <button
          onClick={() => handleAction("custom")}
          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
        >
          <span>✏️</span> Custom...
        </button>
      )}
    </div>
  );
}
