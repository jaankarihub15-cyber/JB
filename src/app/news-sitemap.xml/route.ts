import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const newsDir = path.join(process.cwd(), "src/content/news");
  const files = fs.readdirSync(newsDir).filter((f) => f.endsWith(".json"));

  const articles = files
    .map((f) => {
      const data = JSON.parse(fs.readFileSync(path.join(newsDir, f), "utf-8"));
      return {
        slug: data.slug || f.replace(".json", ""),
        title: data.title || "",
        date: data.date || "",
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  // Google News Sitemap spec: only articles published in the last 2 days (48 hours)
  const now = new Date();
  const cutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const cutoffStr = cutoff.toISOString().split("T")[0]; // "YYYY-MM-DD"

  const included = articles.filter((a) => a.date >= cutoffStr);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${included
  .map(
    (a) => `  <url>
    <loc>https://knowledgekendra.com/news/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>KnowledgeKendra</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${a.date}T00:00:00+05:30</news:publication_date>
      <news:title>${a.title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</news:title>
    </news:news>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      // Short cache so it refreshes frequently — new articles should appear quickly
      "Cache-Control": "public, max-age=1800, must-revalidate",
    },
  });
}
