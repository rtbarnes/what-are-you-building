# What are you building?

An interactive assistant that turns a short project description into a streaming list of relevant technologies, key documentation links, and per-category relationship graphs.

Front‑end is a small React app with a chat UI. Back‑end is an Express server that uses an LLM (OpenRouter) to infer high‑level categories, looks up candidate products/pages (stub datasets), enriches them with Open Graph data, and streams results to the client as NDJSON.

## Features

- Category inference via LLM and streaming status updates
- Suggested technologies with docs previews (Open Graph enrichment)
- Toggleable results: list view and an interactive 2D force graph
- Typed, schema‑validated payloads shared between client and server (Zod)

## Tech Stack

- React 19 + TypeScript
- Express 5 (server) running with Bun
- OpenRouter + `ai` SDK for object‑mode generation
- `react-force-graph-2d` for graph visualization
- Zod for runtime validation and shared types

## How it works

1. The client posts `{ prompt }` to the server at `/api/build`.
2. The server:
   - generates broad categories from the prompt (`server/llm/openai.ts`),
   - finds products for each category (`server/datasets/products.ts` – stub),
   - finds pages per product (`server/datasets/pages.ts` – stub),
   - enriches products/pages with Open Graph (`server/opengraph.ts`),
   - builds per‑category graphs (`server/datasets/graph.ts`).
3. Events are streamed back as NDJSON and rendered incrementally in the UI.

## API

POST `/api/build`

Request

```json
{ "prompt": "I’m building a SaaS with subscriptions and dashboards" }
```

Response stream (NDJSON). Each line is a JSON event discriminated by `type`:

```json
{ "type": "status", "message": "Analyzing your project description..." }
{ "type": "categories", "categories": ["frontend", "authentication", "database", "deployment"] }
{ "type": "product", "category": "frontend", "product": { "id": "react", "name": "React", ... } }
{ "type": "product-detail", "productId": "react", "page": { "title": "Getting Started", "url": "https://react.dev/learn" } }
{ "type": "graph", "category": "frontend", "graph": { "nodes": [...], "links": [...] } }
{ "type": "done" }
```

Schemas are defined in `shared/types.ts` and used both server‑ and client‑side.

## Local development

Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- OpenRouter API key available in your environment (e.g. `OPENROUTER_API_KEY=...`). Bun auto‑loads `.env` if present.

Install dependencies

```sh
bun install
```

Run in development (frontend + server)

```sh
bun run dev
```

Or run individually

```sh
bun run dev:server   # Express on http://localhost:3000
bun run dev:frontend # Vite dev server with /api proxy to 3000
```

Build and preview

```sh
bun run build   # typecheck + vite build
bun run preview # vite preview
```

## Code map

- `server/index.ts` — Express app, `/api/build` streaming endpoint
- `server/llm/openai.ts` — category generation with OpenRouter in object mode
- `server/datasets/{products,pages}.ts` — stubbed search data
- `server/datasets/graph.ts` — per‑category graph construction
- `server/opengraph.ts` — Open Graph enrichment for products/pages
- `server/stream.ts` — NDJSON helpers for the streaming protocol
- `shared/types.ts` — Zod schemas and shared TypeScript types
- `src/chat/Chat.tsx` — chat loop, NDJSON reader, event reducer
- `src/results/*` — `ResultsPanel`, `ProductCard`, `GraphView`

## Notes

- Product/page search is currently stubbed; swap in your vector/database search.
- The frontend reads NDJSON directly using `ReadableStream` and updates state incrementally.
