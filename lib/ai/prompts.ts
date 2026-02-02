const SYSTEM_PROMPT = `You are a research assistant that helps explore topics in depth. You generate structured research branches that form a mind map. Each branch should be informative, concise, and add genuine insight.

Guidelines:
- Generate 3-5 branches per request
- Each branch title should be 3-8 words
- Each summary should be 1-3 informative sentences
- Branches should cover different aspects/angles of the topic
- Avoid repetition with existing context`;

type Action = "initial" | "deeper" | "examples" | "illustrations" | "custom";

const actionPrompts: Record<Action, string> = {
  initial:
    "Break down this research question into key subtopics and areas worth investigating. Use 'topic' as the nodeType for each branch.",
  deeper:
    "Go deeper into this topic. Explore underlying mechanisms, nuances, and important details. Use 'detail' as the nodeType for each branch.",
  examples:
    "Provide concrete, real-world examples that illustrate this topic. Use 'example' as the nodeType for each branch.",
  illustrations:
    "Provide helpful analogies, metaphors, and mental models that make this topic easier to understand. Use 'illustration' as the nodeType for each branch.",
  custom: "",
};

export function buildPrompt(
  question: string,
  contextPath: string[],
  action: Action,
  customPrompt?: string
): { system: string; user: string } {
  const contextStr =
    contextPath.length > 0
      ? `\n\nResearch path so far:\n${contextPath.map((c, i) => `${"  ".repeat(i)}→ ${c}`).join("\n")}`
      : "";

  const actionInstruction =
    action === "custom" && customPrompt
      ? customPrompt
      : actionPrompts[action];

  return {
    system: SYSTEM_PROMPT,
    user: `Topic: ${question}${contextStr}\n\nInstruction: ${actionInstruction}`,
  };
}
