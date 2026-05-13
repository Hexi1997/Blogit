# Admin App (apps/admin)

Content management panel built with React + Vite, deployed as Cloudflare Pages with Pages Functions backend.

## Commands

```bash
pnpm dev:admin                 # Dev server (http://localhost:8788, via Wrangler)
pnpm build:admin               # Build
pnpm --filter admin run lint   # Lint
```

## Architecture

- **Frontend**: React 19, react-router-dom, Tiptap rich-text editor, shadcn/ui
- **Backend**: Cloudflare Pages Functions at `functions/api/` (password auth via SHA-256 hash)
- **GitHub integration**: Writes content to repo via GitHub Git Data API using Octokit (`src/lib/github.ts`)
- Atomic commits: bundles content + images + `_index.json` in a single commit

## Key Files

- `src/lib/config.ts` — Target repo config (owner, repo, branch, blogPath)
- `src/lib/github.ts` — Octokit wrapper for Git Data API operations
- `src/lib/auth.ts` — Auth utilities
- `functions/api/auth/login.ts` — Login endpoint
- `src/pages/` — login, blog list, blog editor

## Tech Stack

- Vite 7, React 19, Tailwind CSS v4 (`@tailwindcss/vite`)
- Editor: Tiptap + Milkdown + CodeMirror
- UI: shadcn/ui (radix-ui), lucide-react
- Deployment: Cloudflare Pages (`wrangler pages`)

## Environment Variables (.dev.vars)

- `ADMIN_PAT` — GitHub fine-grained PAT with Contents read/write
- `ADMIN_PASSWORD_HASH` — SHA-256 hash of admin password
