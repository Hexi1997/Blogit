import { getAllBlogPosts } from "@/lib/blog";

export const dynamic = "force-static";

function escapeXml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toRfc2822(dateInput: string): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return new Date().toUTCString();
  }
  return date.toUTCString();
}

function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (envUrl) return envUrl.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return "";
}

function normalizeCover(cover: string, baseUrl: string): string | null {
  if (!cover) return null;
  const normalizedPath = cover.replace("/api/blog-assets", "/blog-assets");
  const isAbsolute =
    normalizedPath.startsWith("http://") ||
    normalizedPath.startsWith("https://");
  if (isAbsolute) return normalizedPath;
  if (!baseUrl) return null;
  return `${baseUrl}${normalizedPath.startsWith("/") ? "" : "/"}${normalizedPath}`;
}

function inferImageMimeType(url: string): string | null {
  const lower = url.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return null;
}

export async function GET() {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return new Response("Missing NEXT_PUBLIC_SITE_URL", { status: 500 });
  }

  const posts = getAllBlogPosts().sort((a, b) => (a.date < b.date ? 1 : -1));

  const itemsXml = posts
    .map((post) => {
      const link = `${baseUrl}/blog/${post.slug}`;
      const guid = link;
      const title = escapeXml(post.title || "Untitled");
      const description = escapeXml(post.description || "");
      const pubDate = toRfc2822(post.date);
      const coverUrl = normalizeCover(post.cover, baseUrl);

      const categoriesXml = (post.tags || [])
        .map((tag) => `      <category>${escapeXml(tag)}</category>`)
        .join("\n");

      const coverType = coverUrl ? inferImageMimeType(coverUrl) : null;
      const enclosureXml =
        coverUrl && coverType
          ? `      <enclosure url="${escapeXml(coverUrl)}" type="${coverType}" />`
          : "";

      return [
        "    <item>",
        `      <title>${title}</title>`,
        `      <link>${link}</link>`,
        `      <guid isPermaLink=\"true\">${guid}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${description}</description>`,
        categoriesXml,
        enclosureXml,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const siteTitle = "BLOGIT";
  const siteDescription = "BLOGIT RSS Feed";
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
    },
  });
}
