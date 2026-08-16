<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

RankLens is a single **Next.js 16 (App Router)** web app (SEO auditor). There is one
service: the Next dev server on port 3000. Standard commands live in `package.json`
scripts (`dev`, `build`, `start`, `lint`, `test`) — use those.

Non-obvious notes for future agents:

- Run the app with `pnpm dev` in a background/tmux terminal (not in the environment
  `install` phase — a foreground dev server never returns and would block setup).
- The SEO engine is split for testability: `analyzeHtml()` in `src/lib/seo/analyze.ts`
  is pure and network-free (that's what the Vitest suite covers), while
  `fetchAndAnalyze()` performs the outbound HTTP fetch. The `POST /api/analyze` route
  therefore needs **outbound internet egress** to reach target URLs; audits will fail
  with a fetch error if egress is blocked.
- Vitest config is `vitest.config.mts` — the `.mts` extension is intentional (avoids an
  ESM-in-CommonJS warning because `package.json` has no `"type": "module"`).
- `pnpm build` runs the TypeScript type-check, so a green build also validates types.
- The `nextjs-agent-rules` block above is auto-generated and re-added by `next dev`;
  keep it committed so the working tree stays clean.
