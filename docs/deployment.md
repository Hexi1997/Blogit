# Deployment

## Workflows

- `.github/workflows/deploy-blog.yml` — Build and deploy blog to Cloudflare Workers via OpenNext
- `.github/workflows/deploy-admin.yml` — Build and deploy admin to Cloudflare Pages
- `.github/workflows/sync-post-index.yml` — Regenerate `posts/_index.json` when posts change

## CI Secrets (GitHub Actions)

- `CLOUDFLARE_API_TOKEN` — Cloudflare account API token (Edit Workers template)
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID
- `ADMIN_PAT` — GitHub PAT for admin
- `ADMIN_PASSWORD_HASH` — SHA-256 password hash

## Targets

- Blog: Cloudflare Workers (via `opennextjs-cloudflare`)
- Admin: Cloudflare Pages (via `wrangler pages deploy`)
