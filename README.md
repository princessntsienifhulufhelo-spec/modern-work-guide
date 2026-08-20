# AI Workplace Productivity Assistant

A modern, responsive SaaS-style web app that helps professionals automate everyday
workplace tasks with AI. Fill in a short structured form, get an editable AI draft back.

## What the app does

| Tool | Route | Purpose |
| --- | --- | --- |
| Dashboard | `/` | Overview of all tools with quick links |
| Smart Email Generator | `/email` | Turns bullet points into a polished, on-tone email |
| Meeting Notes Summarizer | `/notes` | Extracts summary, decisions and action items from raw notes |
| AI Task Planner | `/planner` | Builds a prioritised, time-boxed plan around a deadline |
| AI Research Assistant | `/research` | Produces a structured briefing with options and open questions |
| AI Chatbot | `/chat` | Free-form conversational assistant with markdown replies |

Every AI output is rendered in an editable textarea with copy and clear actions, plus a
responsible-AI disclaimer reminding you that drafts must be reviewed before use.

## How it works

1. **UI layer** — `src/components/AppLayout.tsx` provides the persistent sidebar
   (collapsing into a sheet menu on mobile) and page header. Routes live in `src/routes/`
   using TanStack Start file-based routing.
2. **Structured prompts** — the four form-based tools all reuse
   `src/components/ToolWorkspace.tsx`. Each route declares its own `system` message,
   field definitions, and a `buildPrompt(values)` function, so the user never writes a
   raw prompt.
3. **Server call** — submitting runs the `runAssistant` server function in
   `src/lib/ai.functions.ts` (TanStack `createServerFn`). It validates input with Zod and
   never exposes the API key to the browser.
4. **AI provider** — `src/lib/ai-gateway.server.ts` creates an OpenAI-compatible client
   pointed at the Lovable AI Gateway; the model text is generated with the Vercel AI SDK
   and returned to the client.
5. **Chat** — `/chat` keeps message history in React state and sends the whole transcript
   as the prompt on each turn, rendering assistant replies as markdown.
6. **Error handling** — exhausted credits (402) and rate limits (429) surface as friendly
   inline messages instead of raw errors.

## Tech stack

- TanStack Start (React 19, file-based routing, server functions)
- Vite 7 + TypeScript
- Tailwind CSS v4 with semantic design tokens in `src/styles.css`
- shadcn/ui components
- TanStack Query for mutation state
- Vercel AI SDK via the Lovable AI Gateway

## Project structure

```text
src/
  components/       AppLayout, ToolWorkspace, AiDisclaimer, ui/ (shadcn)
  lib/              ai.functions.ts (server fn), ai-gateway.server.ts, utils
  routes/           __root.tsx, index.tsx, email, notes, planner, research, chat
  styles.css        design tokens, gradients, shadows
```

## Running locally

```sh
npm i
npm run dev
```

The app requires a `LOVABLE_API_KEY` environment variable on the server for AI
requests; inside Lovable this is provided automatically.

## Responsible AI

Outputs are generated drafts and may be inaccurate. Review all content — especially
names, figures, dates and sources — before sending or publishing.
