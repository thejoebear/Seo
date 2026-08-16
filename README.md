# RankLens

Instant, agency-grade **SEO audits** for any URL. RankLens fetches a page,
analyzes 20+ on-page and technical ranking signals, and returns a 0–100 score
with a prioritized, plain-English list of fixes — the kind of report you can put
in front of a paying client.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and
**Tailwind CSS v4**.

## Features

- **On-page + technical audit engine** (`src/lib/seo/analyze.ts`): title & meta
  description, headings, word count, image alt text, internal/external links,
  canonical, viewport, `lang`, robots/indexability, HTTPS, Open Graph, Twitter
  cards, and JSON-LD structured data.
- **Weighted 0–100 score** with an A–F letter grade.
- **Marketing landing page** with hero, features, and pricing tiers.
- **JSON API** at `POST /api/analyze` (`{ "url": "example.com" }`).

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Start the development server         |
| `pnpm build`   | Production build (runs type-check)   |
| `pnpm start`   | Serve the production build           |
| `pnpm lint`    | Run ESLint                           |
| `pnpm test`    | Run the Vitest unit suite            |

## API

```bash
curl -s -X POST http://localhost:3000/api/analyze \
  -H 'Content-Type: application/json' \
  -d '{"url":"example.com"}'
```

Returns a JSON `SeoReport` (see `src/lib/seo/types.ts`) containing the score,
grade, per-signal checks, and page metrics.
