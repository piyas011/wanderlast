<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

Single Next.js 16.4.4 app (App Router) — no monorepo, no `src/`; routes live in `app/` at the repo root. React 19, strict TypeScript, Tailwind CSS v4, shadcn/ui. No test suite, no CI, no pre-commit hooks — don't look for them.

## Commands (repo root)

- `npm run dev` — dev server; Turbopack is the default bundler in Next 16 (`--webpack` opts out)
- `npm run lint` — ESLint 9 flat config (`eslint-config-next`: core-web-vitals + TypeScript)
- `npm run typecheck` — `tsc --noEmit`
- `npm run format` — Prettier over `**/*.{ts,tsx}` only (no semicolons, double quotes, Tailwind plugin)
- `npm run build` — production build; also typechecks

Verify changes with `npm run lint && npm run typecheck`, then `npm run build` before claiming done. Run `npm run format` so output matches repo style.

## Conventions

- Path alias `@/*` → repo root (tsconfig `paths`).
- `lib/utils.ts` re-exports `cn` from the `cn` package (not clsx/tailwind-merge) — import `cn` from `@/lib/utils`.
- shadcn/ui style is `base-nova` on `@base-ui/react` (not Radix); add components with `npx shadcn@latest add <name>` → `components/ui/`. Config in `components.json`.
- Tailwind v4 is CSS-first: there is no `tailwind.config` — theme tokens live in `app/globals.css` (`@theme inline`).
- Components are Server Components by default (`components.json: "rsc": true`); add `"use client"` only when needed (`components/home/Navbar.tsx` and `components/theme-provider.tsx` already have it).
- Root layout loads Josefin Sans via `next/font/google` (`--font-josefin-sans`, wired to `--font-sans`/`--font-heading` in globals.css); theming goes through `next-themes` in `components/theme-provider.tsx` (keep `suppressHydrationWarning` on `<html>`).

## Gotchas

- Keep the managed `nextjs-agent-rules` block above intact; `next dev` rewrites it and removing it just re-creates a dirty diff.
- `.env*`, `next-env.d.ts`, and `*.tsbuildinfo` are gitignored; no env vars are used yet.
- Sibling `../wanderlust-server-side` is a separate repo (Express + MongoDB, port 5000). This client makes no API calls yet — don't wire fetches to it unasked.
