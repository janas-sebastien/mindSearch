import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindSearch - AI Research Explorer",
  description: "Iterative AI-powered research with mind map visualization",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
