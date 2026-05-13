
# Blogit

A Git-powered, local-first blogging system.

## Build & Development Commands

```bash
pnpm install                  # Install all dependencies
pnpm dev                      # Start both apps in parallel
pnpm dev:blog                 # Blog only (http://localhost:3000)
pnpm dev:admin                # Admin only (http://localhost:8788)
pnpm build                    # Build all apps
pnpm --filter blog run lint   # Lint blog
pnpm --filter admin run lint  # Lint admin
```

## Architecture

pnpm monorepo (`apps/*`) with two independent applications:

- **apps/blog** — Reader-facing Next.js 16 SSG blog, deployed to Cloudflare via OpenNext. See [docs/blog-app.md](docs/blog-app.md).
- **apps/admin** — Content management panel (React + Vite + Cloudflare Pages Functions). See [docs/admin-app.md](docs/admin-app.md).

Posts are Markdown files at `apps/blog/posts/<slug>/index.md`. Admin writes to the repo via GitHub Git Data API.

## Key Conventions

- Package manager: pnpm 10.30 (do not use npm/yarn)
- Tailwind CSS v4 in both apps
- shadcn/ui component patterns in both apps
- TypeScript throughout

## Further Reading

- [docs/blog-app.md](docs/blog-app.md) — Blog app details, routes, content structure, frontmatter
- [docs/admin-app.md](docs/admin-app.md) — Admin app details, architecture, key files
- [docs/deployment.md](docs/deployment.md) — CI/CD workflows, secrets, deployment targets
