import Link from "next/link";
import { getAllPaisaArticles } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paisa Guide — Personal Finance, Tax, Insurance & Investments",
  description: "Simple guides on SIP, mutual funds, tax saving, insurance, FD, PPF, and more. Personal finance explained for beginners.",
  alternates: { canonical: "https://knowledgekendra.com/paisa" },
};

export default function PaisaHubPage() {
  const articles = getAllPaisaArticles();

  return (
    <div className="max-w-[1100px] mx-auto px-6">
      <div className="mt-8 mb-8 bg-card border border-border rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-orange-light flex items-center justify-center text-3xl">💰</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">Paisa Guide</h1>
            <p className="text-sm text-text-secondary">{articles.length} articles — personal finance explained simply</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {["Investing", "Tax Saving", "Insurance", "Savings", "Loans", "Credit"].map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-lg bg-card-alt text-xs font-semibold text-text-muted border border-border">{t}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-12">
        {articles.map((a: any) => (
          <Link key={a.slug} href={`/paisa/${a.slug}`} className="bg-card border border-border rounded-2xl p-5 hover:border-orange/40 hover:shadow-sm hover:-translate-y-px transition-all">
            <div className="flex gap-2 mb-2 flex-wrap">
              {a.hero?.tags?.slice(0, 2).map((t: string) => (
                <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-orange-light text-orange">{t}</span>
              ))}
            </div>
            <div className="text-sm font-bold text-text mb-1">{a.title}</div>
            <div className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{a.hero?.one_liner}</div>
            <div className="text-[11px] text-text-muted mt-2">{a.hero?.read_time} read</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
