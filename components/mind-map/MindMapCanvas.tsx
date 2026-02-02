"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useStore } from "@/lib/store";
import MindMapNode from "./MindMapNode";
import NodeContextMenu from "./NodeContextMenu";

export default function MindMapCanvas() {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const onNodesChange = useStore((s) => s.onNodesChange);
  const onEdgesChange = useStore((s) => s.onEdgesChange);
  const setUI = useStore((s) => s.setUI);

  const nodeTypes: NodeTypes = useMemo(
    () => ({ mindNode: MindMapNode }),
    []
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: { id: string }) => {
      event.preventDefault();
      setUI({ contextMenu: { x: event.clientX, y: event.clientY, nodeId: node.id } });
    },
    [setUI]
  );

  const onPaneClick = useCallback(() => {
    setUI({ contextMenu: null });
  }, [setUI]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.5 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{ type: "smoothstep", animated: true }}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="!bg-gray-50"
        />
      </ReactFlow>
      <NodeContextMenu />
    </div>
  );
}
