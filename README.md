# MindSearch

AI-powered research explorer with mind map visualization. Ask a question, and AI breaks it down into an interactive, expandable mind map.

## Features

- **Iterative research** - Start with a question, then expand any branch with follow-up queries
- **Mind map visualization** - React Flow-based interactive canvas with zoom, pan, and minimap
- **Multiple AI providers** - OpenAI (GPT-4o), Anthropic (Claude), and Google (Gemini)
- **Right-click actions** - Go deeper, get examples, illustrations, or custom prompts on any node
- **BYOK** - Bring your own API keys, stored locally in your browser
- **Project persistence** - Auto-saves to localStorage, load previous research sessions
- **JSON export** - Download your mind map data

## Getting Started

### Prerequisites

- Node.js 18+
- An API key from OpenAI, Anthropic, or Google

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Usage

1. Enter an API key in the sidebar (OpenAI, Anthropic, or Google)
2. Select a model from the dropdown
3. Type a research question and click **Go**
4. Right-click any node to expand it:
   - **Go deeper** - Explore underlying details
   - **Examples** - Get concrete real-world examples
   - **Illustrations** - Get analogies and mental models
   - **Custom** - Enter your own research prompt

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- React Flow (@xyflow/react) for mind map rendering
- Vercel AI SDK for streaming structured AI responses
- Zustand for state management
- Tailwind CSS v4 for styling
- Zod for AI output schema validation
- localStorage for persistence (no database, no auth)

## Project Structure

```
app/
  layout.tsx                # Root layout
  page.tsx                  # Main page
  api/research/route.ts     # AI research streaming endpoint
components/
  QuestionInput.tsx         # Initial question dialog
  mind-map/
    MindMapCanvas.tsx       # React Flow canvas
    MindMapNode.tsx         # Custom node component
    NodeContextMenu.tsx     # Right-click context menu
  sidebar/
    Sidebar.tsx             # Collapsible sidebar
    APIKeySettings.tsx      # API key inputs
    ModelSelector.tsx       # Model dropdown
    ProjectList.tsx         # Saved projects
    ExportButton.tsx        # JSON export
hooks/
  useResearch.ts            # Research orchestration hook
lib/
  store.ts                  # Zustand store
  types.ts                  # TypeScript types
  persistence.ts            # localStorage helpers
  layout.ts                 # Node position calculator
  utils.ts                  # Utilities
  ai/
    provider.ts             # AI model registry
    schemas.ts              # Zod schemas
    prompts.ts              # Prompt builder
```

## License

MIT
