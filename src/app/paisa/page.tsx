import Link from "next/link";
import { getAllPaisaArticles } from "@/lib/content";
import { Tag } from "@/components/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paisa Guide — Personal Finance & Investing Made Simple",
  description:
    "Learn about SIP, mutual funds, PPF, tax saving, credit score, and more. Simple financial literacy guides for beginners.",
};

export default function PaisaHubPage() {
  const articles = getAllPaisaArticles();

  return (
    <div className="max-w-[860px] mx-auto px-5 py-6">
      <div className="mb-6">
        <h1 className="heading text-3xl font-normal text-text mb-1.5">
          💰 Paisa Guide
        </h1>
        <p className="text-base text-text-secondary">
          {articles.length} articles — investing, savings, tax, and personal
          finance made simple
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {articles.map((p) => (
          <Link
            key={p.slug}
            href={`/paisa/${p.slug}`}
            className="p-4 card hover:border-accent/30 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex gap-1.5 flex-wrap mb-2.5">
                {p.hero.tags.map((t) => (
                  <Tag key={t} className="bg-orange-light">
                    {t}
                  </Tag>
                ))}
              </div>
              <div className="text-base font-semibold text-text mb-1 leading-snug">
                {p.title}
              </div>
              <div className="text-sm text-text-secondary leading-relaxed">
                {p.hero.one_liner.slice(0, 100)}
                {p.hero.one_liner.length > 100 ? "..." : ""}
              </div>
            </div>
            <div className="text-xs text-text-muted mt-3">
              📖 {p.hero.read_time} read
            </div>
          </Link>
        ))}
      </div>

      {articles.length === 0 && (
        <p className="text-center py-10 text-text-muted">
          No articles available yet. Check back soon!
        </p>
      )}
    </div>
  );
}
