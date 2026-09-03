# User Story Studio

A capture tool for use-case-driven requirements. It separates three things a
wiki page conflates:

- **Capture** — a structured Card / Conversation / Confirmation form per use case.
- **Representation** — a graph of actors, cards, and typed relationships
  (`includes`, `extends`, `precedes`).
- **Aggregation** — epics, a separate many-to-many grouping over cards.

## Stack

Vite + React + TypeScript, Tailwind + shadcn/ui, `@xyflow/react` for the graph,
`fflate` for the project archive. Uses `pnpm`.

## Develop

```bash
pnpm install
pnpm dev
```

`pnpm build` type-checks and produces a production bundle. `pnpm lint` runs
oxlint.

## Persistence

The current map autosaves to the browser (IndexedDB) as you work. **Save / Save
as** binds it to a portable **`.uss`** file — a zip archive containing the
manifest, one JSON file per entity, and a generated `stories.md`. Where the
browser supports the File System Access API, subsequent edits write straight
back to that file; otherwise Save downloads a fresh copy. **Open** loads a
`.uss` file, and **Markdown** exports a standalone human-readable `.md`.

UI preferences (active view, epic filter, theme) are kept separately in
`localStorage`.
