import type { RequestInfo } from "rwsdk/worker";
import { PostResolver } from "~platform/@resolvers/post";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toISOString().split("T")[0];
}

export default async function SitemapRoute({ request }: RequestInfo) {
  const baseUrl = request ? `${new URL(request.url).protocol}//${new URL(request.url).host}` : "";
  const posts = await PostResolver.instance().getPosts({ published: 1, orderBy: "updatedAt", orderDir: "desc" });

  const urls: string[] = [];

  // Home page
  urls.push(`  <url>
    <loc>${escapeXml(baseUrl)}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  // Published articles
  for (const post of posts) {
    urls.push(`  <url>
    <loc>${escapeXml(baseUrl)}/${escapeXml(post.slug)}</loc>
    <lastmod>${escapeXml(formatDate(post.updatedAt))}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
