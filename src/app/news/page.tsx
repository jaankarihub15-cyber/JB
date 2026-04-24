import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb } from "@/components/ui";
import { JsonLd } from "@/components/json-ld";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "News & Updates — Government Schemes, Exams, Policy Changes | KnowledgeKendra",
  description: "Latest news on government schemes, competitive exam notifications, recruitment updates, and policy changes in India. Updated daily.",
  alternates: { canonical: "https://knowledgekendra.com/news" },
};

function getNewsArticles() {
  const dir = path.join(process.cwd(), "src/content/news");
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f: string) => f.endsWith(".json"));
  return files.map((f: string) => {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
    return data;
  }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const catColors: Record<string, string> = {
  "SARKARI YOJANA": "#1B6B4A",
  "EXAM UPDATE": "#2563EB",
  "RECRUITMENT": "#7C3AED",
  "POLICY UPDATE": "#EA580C",
  "BUDGET": "#DC2626",
};

export default function NewsPage() {
  const articles = getNewsArticles();
  return (
    <div className="max-w-[860px] mx-auto px-5 py-6">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "KnowledgeKendra News" }} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "News & Updates" }]} />
      <h1 className="text-2xl font-extrabold tracking-tight text-text mb-2">News & Updates</h1>
      <p className="text-[15px] text-text-secondary leading-[1.75] mb-6">Latest government scheme announcements, exam notifications, recruitment updates, and policy changes.</p>
      <div className="grid gap-5">
        {articles.map((a: any) => (
          <Link key={a.slug} href={`/news/${a.slug}`} className="card overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <img src={`/news/${a.slug}.png`} alt={a.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: catColors[a.category] || "#1B6B4A" }}>{a.category}</span>
                <span className="text-xs text-text-muted">{a.date}</span>
              </div>
              <h2 className="text-[16px] font-bold text-text leading-snug group-hover:text-accent transition-colors">{a.title}</h2>
              <p className="text-sm text-text-secondary mt-1.5">{a.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
