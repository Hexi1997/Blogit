# Blog App (apps/blog)

Reader-facing blog built with Next.js 16 (App Router, SSG), deployed to Cloudflare via OpenNext.

## Commands

```bash
pnpm dev:blog                          # Dev server (http://localhost:3000)
pnpm build:blog                        # Build
pnpm preview:blog                      # Build + Cloudflare local preview
pnpm --filter blog run lint            # Lint
pnpm --filter blog run generate-index  # Rebuild posts/_index.json
pnpm --filter blog run sync-assets     # Sync post assets to public/blog-assets
```

## Routes

- `/` — Home/post list
- `/blog/[slug]` — Post detail
- `/api/posts` — Post data API
- `/api/blog-assets/[...path]` — Asset serving
- `/rss.xml` — RSS feed
- `/sitemap.xml`, `/robots.txt` — SEO

## Content Structure

```
posts/<slug>/
├── index.md       # Markdown with YAML frontmatter
└── assets/        # Images and other assets
```

`posts/_index.json` is a generated metadata cache (rebuilt by CI, not manually).

## Frontmatter Fields

- **title** (required): post title
- **date** (required): YYYY-MM-DD
- **pinned** (optional): pinned posts sort before regular posts
- **cover** (optional): relative path or external URL; fallback to first image in markdown, then `/default-cover.webp`
- **tags** (optional): YAML array
- **source** (optional): external URL; card click redirects to this URL instead of internal page

## Tech Stack

- Next.js 16, React 19, Tailwind CSS v4 (`@tailwindcss/postcss`, `@tailwindcss/typography`)
- Markdown pipeline: remark → rehype with GFM, KaTeX, Shiki syntax highlighting
- UI: shadcn/ui, lucide-react, motion, react-photo-view
- Deployment: OpenNext (`opennextjs-cloudflare`)

## Environment Variables (.env)

- `NEXT_PUBLIC_SITE_URL` — Deployed blog URL
- `NEXT_PUBLIC_GISCUS_REPO`, `NEXT_PUBLIC_GISCUS_REPO_ID`, `NEXT_PUBLIC_GISCUS_CATEGORY`, `NEXT_PUBLIC_GISCUS_CATEGORY_ID` — Giscus comments (optional)
