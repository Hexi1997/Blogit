# Blogit

[English](./README.md) | [中文](./README_CN.md)

<p style="text-align:center;font-weight:600;font-size:26px;">Own your content. For real.</p>

- **Content as code**：内容就是代码，文章是你仓库里的 Markdown 文件。
- **Local media, no image CDN lock-in**：图片与文章一起存放在仓库中（`posts/<slug>/assets`），不依赖第三方图床。
- **Writing as commit**：写作就是提交，每次修改都有完整 Git 历史和差异可追踪。
- **Publishing as push**：发布就是推送，直接走现有的 Git/CI/CD 流程。
- **Cloneable and forkable**：可克隆、可 Fork，整套博客系统可迁移、可复现。
- **No platform lock-in**：没有平台锁定，不依赖私有 CMS 数据孤岛。

## Quick Start

1. **Use this template**

在右上角点击 `Use this template` 创建你自己的仓库（Public），然后克隆到本地并安装依赖。
2. **修改 apps/admin/src/lib/config.ts 中的仓库配置**

默认值是：
  - `owner: "Hexi1997"`
  - `repo: "Blogit"`
  - `blogPath: "apps/blog/posts"`
  - `branch: "main"`
   如果你是 fork 或迁移到其他仓库，需要改成你自己的配置。
3. **生成 GitHub PAT + 初始化 Admin 本地变量**

生成一个有仓库写权限的 GitHub PAT(Personal access token)，复制 `.dev.vars.example` 到 `.dev.vars`：

然后在 `apps/admin/.dev.vars` 中更新：
  - `ADMIN_PAT=<your_github_pat>`
  - `ADMIN_PASSWORD_HASH=<sha256_of_password>`（可用 `printf "your-password" | shasum -a 256` 生成）
4. **配置 Giscus 评论区并写入 blog 环境变量**

在仓库开启 `Discussions`并安装 [Giscus App](https://github.com/apps/giscus)，网页访问 [giscus.app](https://giscus.app) 生成参数，写入 `apps/blog/.env`：
  - `NEXT_PUBLIC_GISCUS_REPO`
  - `NEXT_PUBLIC_GISCUS_REPO_ID`
  - `NEXT_PUBLIC_GISCUS_CATEGORY`
  - `NEXT_PUBLIC_GISCUS_CATEGORY_ID`
5. **配置 Github Action 环境变量**
登录 `Cloudflare` 后台，创建 `Account API Token`（由 `Edit Cloudflare Workers` 模板创建即可，需要对应权限）并获取 `Account ID`。

在仓库 `Settings -> Secrets and variables -> Actions -> Repository secrets` 中配置如下变量：
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`
  - `ADMIN_PAT`
  - `ADMIN_PASSWORD_HASH`

## 1. 模块介绍

Blogit 是一个基于 pnpm monorepo 的 Markdown 博客系统，包含两个应用：

- `apps/blog`：面向读者的博客站点，技术栈是 Next.js 16（App Router），通过 OpenNext 部署到 Cloudflare。
- `apps/admin`：后台管理端，支持博客的增删改查。技术栈是 React + Vite + Cloudflare Pages Functions，通过 GitHub Git Data API 直接写入博客内容。

## 2. 项目包含内容

- 博客正文来源：`apps/blog/posts/<slug>/index.md`
- 文章资源文件：`apps/blog/posts/<slug>/assets/`*
- 列表索引缓存：`apps/blog/posts/_index.json`
- Blog 能力：
  - SSG 静态页面
  - SEO（`sitemap.xml`、`robots.txt`、metadata）
  - Giscus 评论
  - KaTeX 数学公式、Shiki 代码高亮、代码复制/图片预览增强
- Admin 能力：
  - 密码登录
  - 文章列表 / 新建 / 编辑 / 删除
  - 原子化提交（正文 + 图片 + `_index.json` 同一次 commit）

## 3. 目录结构

```text
├── apps/
│   ├── blog/                  # 对外博客（Next.js 16）
│   │   ├── app/
│   │   ├── posts/             # Markdown 内容源
│   │   ├── public/
│   │   └── scripts/
│   └── admin/                 # 后台（React + Vite + CF Pages Functions）
├── package.json               # 工作区脚本
└── pnpm-workspace.yaml
```

## 4. 前置要求

- 建议 Node.js 20+
- pnpm `10.30.0`（根目录 `packageManager` 已声明）
- GitHub Personal Access Token（PAT，需有仓库写权限）
- Cloudflare 账号（用于部署）

## 5. 安装依赖

```bash
pnpm install
```

## 6. 本地开发

### 6.1 同时启动两个应用

```bash
pnpm dev
```

### 6.2 单独启动

```bash
pnpm dev:blog
pnpm dev:admin
```

常见本地地址：

- Blog：`http://localhost:3000`
- Admin：由 Wrangler Pages dev 输出（`http://localhost:8788`）

## 7. 环境变量

### 7.1 Blog（`apps/blog`）

Blog 项目的环境变量：

- `NEXT_PUBLIC_SITE_URL`（必填）：站点正式 URL，用于 metadata / sitemap / robots。
- `NEXT_PUBLIC_GISCUS_REPO`
- `NEXT_PUBLIC_GISCUS_REPO_ID`
- `NEXT_PUBLIC_GISCUS_CATEGORY`
- `NEXT_PUBLIC_GISCUS_CATEGORY_ID`

说明：

- 后四项用于 Giscus 评论区，缺少任意一项时评论区会自动不渲染。
- `NEXT_PUBLIC_SITE_URL` 请在部署后于 `apps/blog/.env` 中同步更新。

Giscus 配置步骤：

1. 在你的 GitHub 仓库开启 `Discussions`。
2. 安装并授权 [Giscus App](https://github.com/apps/giscus) 访问该仓库。
3. 打开 [giscus.app](https://giscus.app)网页，按页面向导输入仓库、选择 Discussion Category（推荐使用 Announcements ）、映射方式（本项目使用 `pathname`）。
4. 将生成的值写入 `apps/blog/.env`。

### 7.2 Admin（`apps/admin`）

Admin 项目的环境变量：

- `ADMIN_PAT`：用于调用 GitHub API 的 PAT（后续文章增删改也依赖它）
- `ADMIN_PASSWORD_HASH`：登录密码的 SHA-256

生成 SHA-256：

```bash
printf "your-password" | shasum -a 256
```

本地启动时需要将 `.dev.vars.example` 复制到 `.dev.vars` 并更新值。

### 7.3 Github 流水线

本仓库的 GitHub Actions 工作流使用仓库级 `Secrets`（路径：`Settings -> Secrets and variables -> Actions`）。

请在 Repository secrets 至少配置以下变量：

- `CLOUDFLARE_API_TOKEN`：Cloudflare API Token，用于 blog/admin 部署。
- `CLOUDFLARE_ACCOUNT_ID`：Cloudflare Account ID，用于 blog/admin 部署。
- `ADMIN_PAT`：当前代码仓库的 owner 的 Github Personal Access Token（admin 登录与 blog 内容管理）。
- `ADMIN_PASSWORD_HASH`：登录密码的 SHA256 （admin 登录密码校验）。

说明：

- `CLOUDFLARE_API_TOKEN` 直接由 `Edit Cloudflare Workers` 模板创建即可，需要对应权限。
- `ADMIN_PAT` 和 `ADMIN_PASSWORD_HASH` 的数值同 `.dev.vars`，注意不要将 `.dev.vars` 上传到 github 仓库。

## 8. 博客内容工作流

### 8.1 文章格式

路径：

```text
apps/blog/posts/<slug>/
├── index.md
└── assets/
```

Frontmatter 示例：

```yaml
---
title: "文章标题"
date: "2026-03-05"
cover: "assets/cover.webp"
tags:
  - nextjs
  - cloudflare
source: "https://example.com/original-link" # 可选，外链文章
---
```

规则说明：

- `cover` 未填写时，系统会自动取正文第一张图，再兜底到 `/default-cover.png`。
- 设置 `source` 后，列表点击会直接跳外链。
- 正文中的相对图片路径会按文章目录资源解析。

### 8.2 索引与资源同步

`apps/blog` 可用脚本：

- `pnpm --filter blog run generate-index`：重建 `posts/_index.json`
- `pnpm --filter blog run sync-assets`：同步 `posts/*/assets` 到 `public/blog-assets`

会通过 Github 流水线自动更新 `_index.json`，通常不需要手动重建。

## 9. 你需要修改的仓库配置

请修改：

- `apps/admin/src/lib/config.ts`

默认值是：

- `owner: "Hexi1997"`
- `repo: "Blogit"`
- `blogPath: "apps/blog/posts"`
- `branch: "main"`

如果你是 fork 或迁移到其他仓库，需要改成你自己的配置。

## 10. 许可证

MIT License，见 [LICENSE](./LICENSE)。