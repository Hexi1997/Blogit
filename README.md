# Blogit

[English](./README.md) | [中文](./README_CN.md)

Blogit is a pnpm monorepo for a Markdown-first blog system:

- `apps/blog`: public blog site built with Next.js 16 (App Router), deployed to Cloudflare via OpenNext.
- `apps/admin`: password-protected admin panel built with React + Vite, deployed on Cloudflare Pages Functions, writing blog content directly to GitHub with the Git Data API.

## Core Value

**Own your content. For real.**

Blogit is designed around content ownership instead of platform dependency:

- **Content as code**: posts are plain Markdown files in your own Git repo.
- **Local media, no image CDN lock-in**: image assets are stored with each post (`posts/<slug>/assets`), without third-party image hosting.
- **Writing as commit**: every edit is a Git commit with full history and diff.
- **Publishing as push**: publish by pushing changes through your existing CI/CD flow.
- **Cloneable and forkable**: your blog system is portable and reproducible.
- **No platform lock-in**: no proprietary CMS data silo; files stay with you.

## 1. What This Repo Includes

- Markdown content lives in `apps/blog/posts/<slug>/index.md`.
- Per-post assets live in `apps/blog/posts/<slug>/assets/*`.
- Blog list index cache: `apps/blog/posts/_index.json`.
- Public blog runtime:
  - SSG pages
  - SEO (`sitemap.xml`, `robots.txt`, metadata)
  - Giscus comments
  - Math (KaTeX), code highlighting (Shiki), copy-code and image preview enhancements
- Admin runtime:
  - Simple password login
  - Post list / create / edit / delete
  - Atomic commits to GitHub (content + images + `_index.json` in one commit)

## 2. Monorepo Structure

```text
.
├── apps/
│   ├── blog/                  # Public blog (Next.js 16)
│   │   ├── app/
│   │   ├── posts/             # Markdown source of truth
│   │   ├── public/
│   │   └── scripts/
│   └── admin/                 # Admin panel (React + Vite + CF Pages Functions)
├── package.json               # Workspace scripts
└── pnpm-workspace.yaml
```

## 3. Prerequisites

- Node.js 20+ recommended
- pnpm `10.30.0` (declared in root `packageManager`)
- A GitHub Personal Access Token (PAT) with repo write permission (for admin)
- Cloudflare account (for deployment)

## 4. Install Dependencies

```bash
pnpm install
```

## 5. Run Locally

### 5.1 Start Both Apps

```bash
pnpm dev
```

### 5.2 Start Individual Apps

```bash
pnpm dev:blog
pnpm dev:admin
```

Default local endpoints:

- Blog: `http://localhost:3000`
- Admin: Wrangler Pages dev prints its own URL (commonly `http://localhost:8788`)

## 6. Environment Variables

### 6.1 Blog (`apps/blog`)

The blog expects:

- `NEXT_PUBLIC_SITE_URL` (required): canonical site URL, used by metadata/sitemap/robots.

Example:

```bash
cd apps/blog
echo 'NEXT_PUBLIC_SITE_URL=https://your-blog-domain.com' > .env.local
```

### 6.2 Admin (`apps/admin`)

Admin Pages Function `functions/api/auth/login.ts` uses:

- `ADMIN_PAT`: GitHub PAT used by server-side login response and GitHub API writes.
- `ADMIN_PASSWORD_HASH`: SHA-256 hash of the login password.

Create SHA-256 hash:

```bash
printf "your-password" | shasum -a 256
```

Set secrets in Cloudflare Pages project (Production/Preview), and use `.dev.vars` for local wrangler dev.

## 7. Blog Content Workflow

### 7.1 Post Format

Path:

```text
apps/blog/posts/<slug>/
├── index.md
└── assets/
```

Frontmatter example:

```yaml
---
title: "Post Title"
date: "2026-03-05"
cover: "assets/cover.webp"
tags:
  - nextjs
  - cloudflare
source: "https://example.com/original-link" # optional external source
---
```

Notes:

- If `cover` is missing, blog auto-falls back to first image in markdown, then `/default-cover.png`.
- If `source` is set, the list card links to external URL directly.
- Relative image paths are resolved from post assets.

### 7.2 Index and Assets

Useful scripts in `apps/blog`:

- `pnpm --filter blog run generate-index`: regenerate `posts/_index.json`.
- `pnpm --filter blog run sync-assets`: sync `posts/*/assets` to `public/blog-assets` for static serving.

Admin writes `_index.json` during save/delete operations, so manual generation is usually unnecessary when editing through admin.

## 8. Build and Deploy

### 8.1 Workspace Build

```bash
pnpm build
```

### 8.2 Deploy Blog (OpenNext + Cloudflare)

```bash
pnpm --filter blog run preview   # local preview with OpenNext Cloudflare runtime
pnpm --filter blog run deploy    # deploy worker/assets per wrangler config
```

### 8.3 Deploy Admin (Cloudflare Pages)

```bash
pnpm --filter admin run build
pnpm --filter admin run deploy
```

## 9. Repo Configuration You Should Update

Edit:

- `apps/admin/src/lib/config.ts`

`BLOG_REPO_CONFIG` defaults to:

- `owner: "Hexi1997"`
- `repo: "Blogit"`
- `blogPath: "apps/blog/posts"`
- `branch: "main"`

Change these to your own repo if you fork/use this project.

## 10. Script Reference

Root:

- `pnpm dev`: run all app dev scripts in parallel
- `pnpm dev:blog`
- `pnpm dev:admin`
- `pnpm build`
- `pnpm build:blog`
- `pnpm build:admin`
- `pnpm preview:blog`

Blog app:

- `pnpm --filter blog run dev`
- `pnpm --filter blog run build`
- `pnpm --filter blog run preview`
- `pnpm --filter blog run deploy`
- `pnpm --filter blog run generate-index`
- `pnpm --filter blog run sync-assets`

Admin app:

- `pnpm --filter admin run dev`
- `pnpm --filter admin run build`
- `pnpm --filter admin run deploy`

## 11. License

MIT License. See [LICENSE](./LICENSE).
