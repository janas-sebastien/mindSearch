"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { MindNodeData } from "@/lib/types";
import { cn } from "@/lib/utils";

const nodeStyles: Record<string, string> = {
  question: "bg-blue-600 text-white border-blue-700",
  topic: "bg-amber-50 text-amber-900 border-amber-300",
  detail: "bg-green-50 text-green-900 border-green-300",
  example: "bg-purple-50 text-purple-900 border-purple-300",
  illustration: "bg-pink-50 text-pink-900 border-pink-300",
};

function MindMapNode({ id, data }: NodeProps) {
  const nodeData = data as unknown as MindNodeData & { expandedNodeId?: string | null };
  const style = nodeStyles[nodeData.nodeType] || nodeStyles.topic;
  const isExpanded = nodeData.expandedNodeId === id;

  return (
    <div
      className={cn(
        "px-4 py-3 rounded-xl border-2 shadow-md min-w-[160px] transition-all cursor-pointer",
        isExpanded ? "max-w-[500px] z-10" : "max-w-[260px]",
        style,
        nodeData.isLoading && "animate-pulse opacity-70",
        nodeData.isStreaming && "ring-2 ring-blue-400 ring-offset-2"
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-2 !h-2" />
      <div className="font-semibold text-sm leading-tight">{nodeData.label}</div>
      {nodeData.summary && nodeData.summary !== nodeData.label && (
        <div className={cn("text-xs mt-1 opacity-80 leading-snug", !isExpanded && "line-clamp-3")}>
          {nodeData.summary}
        </div>
      )}
      {nodeData.isLoading && (
        <div className="text-xs mt-1 opacity-60">Researching...</div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-2 !h-2" />
    </div>
  );
}

export default memo(MindMapNode);
