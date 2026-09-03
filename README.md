# Use Case Studio

A capture tool for use-case-driven requirements. It separates three things a
wiki page conflates:

- **Capture** — a structured Card / Conversation / Confirmation form per use case.
- **Representation** — a graph of actors, cards, and typed relationships
  (`includes`, `extends`, `precedes`).
- **Aggregation** — epics, a separate many-to-many grouping over cards.

## Stack

Vite + React + TypeScript, Tailwind + shadcn/ui, `@xyflow/react` for the graph.

## Develop

```bash
npm install
npm run dev
```

`npm run build` type-checks and produces a production bundle. `npm run lint`
runs oxlint.

## Persistence

Domain data (actors, epics, cards, relationships) and UI preferences are stored
under separate `localStorage` keys. Use **Export** / **Import** in the sidebar to
move a workspace as a JSON file.
