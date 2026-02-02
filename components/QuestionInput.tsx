"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useResearch } from "@/hooks/useResearch";

export default function QuestionInput() {
  const showQuestionInput = useStore((s) => s.ui.showQuestionInput);
  const initProject = useStore((s) => s.initProject);
  const { research } = useResearch();
  const [question, setQuestion] = useState("");

  if (!showQuestionInput) return null;

  const handleSubmit = () => {
    const q = question.trim();
    if (!q) return;
    const rootId = initProject(q);
    research(rootId, "initial");
    setQuestion("");
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-bold mb-2">What do you want to research?</h2>
        <p className="text-gray-500 text-sm mb-6">
          Ask a question and AI will break it down into an explorable mind map.
        </p>
        <div className="flex gap-2">
          <input
            autoFocus
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            placeholder="e.g., How do large language models work?"
            className="flex-1 border-2 rounded-xl px-4 py-3 text-lg outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSubmit}
            disabled={!question.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}
