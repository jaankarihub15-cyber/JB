import { getAllSchemes, getAllExams, getAllPaisaArticles, getAllGuides, getAllCompare } from "@/lib/content";

export async function GET() {
  const BASE = "https://knowledgekendra.com";
  const now = new Date().toUTCString();

  const schemes = getAllSchemes().map((s: any) => ({
    title: s.title, url: `${BASE}/yojana/${s.slug}`,
    desc: s.hero?.one_liner || s.meta_description || "", cat: "Yojana",
  }));
  const exams = getAllExams().map((e: any) => ({
    title: e.title, url: `${BASE}/exam/${e.slug}`,
    desc: e.hero?.one_liner || e.meta_description || "", cat: "Exam",
  }));
  const paisa = getAllPaisaArticles().map((a: any) => ({
    title: a.title, url: `${BASE}/paisa/${a.slug}`,
    desc: a.hero?.one_liner || a.meta_description || "", cat: "Paisa",
  }));
  const guides = getAllGuides().map((g: any) => ({
    title: g.title, url: `${BASE}/guide/${g.slug}`,
    desc: g.hero?.one_liner || g.meta_description || "", cat: "Guide",
  }));
  const compares = getAllCompare().map((c: any) => ({
    title: c.title, url: `${BASE}/compare/${c.slug}`,
    desc: c.hero?.one_liner || c.meta_description || "", cat: "Compare",
  }));

  const all = [...schemes, ...exams, ...paisa, ...guides, ...compares];

  const items = all.map((item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.url}</link>
      <description><![CDATA[${item.desc}]]></description>
      <category>${item.cat}</category>
      <pubDate>${now}</pubDate>
      <guid isPermaLink="true">${item.url}</guid>
    </item>`).join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>KnowledgeKendra</title>
    <link>${BASE}</link>
    <description>Government schemes, competitive exams, and personal finance guides for India</description>
    <language>en-in</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
