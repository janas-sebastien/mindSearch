"use client";

import dynamic from "next/dynamic";
import Sidebar from "@/components/sidebar/Sidebar";
import QuestionInput from "@/components/QuestionInput";

const MindMapCanvas = dynamic(
  () => import("@/components/mind-map/MindMapCanvas"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <MindMapCanvas />
      <QuestionInput />
    </main>
  );
}
