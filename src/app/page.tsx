import Link from "next/link";
import { getAllSchemes, getAllExams, getAllPaisaArticles } from "@/lib/content";
import { Badge, Tag } from "@/components/ui";

export default function HomePage() {
  const schemes = getAllSchemes();
  const exams = getAllExams();
  const articles = getAllPaisaArticles();

  return (
    <>
      {/* Hero — Eligibility Tool CTA */}
      <section className="text-center px-5 pt-12 pb-10 bg-gradient-to-b from-purple-light to-bg">
        <p className="text-[11px] font-semibold text-purple uppercase tracking-widest mb-3">
          India's cleanest government info site
        </p>
        <h1 className="heading text-[28px] font-normal text-text leading-tight mb-3">
          Find Schemes You Qualify For
          <br />
          in 30 Seconds
        </h1>
        <p className="text-[14px] text-text-secondary max-w-md mx-auto leading-relaxed mb-6">
          Answer 5 quick questions and get a personalized list of government
          schemes, benefits, and how to apply.
        </p>
        <Link
          href="/check-eligibility"
          className="inline-block px-8 py-3.5 rounded-xl bg-purple text-white text-[15px] font-semibold shadow-lg shadow-purple/25 hover:shadow-purple/35 transition-shadow"
        >
          Check My Eligibility →
        </Link>
      </section>

      <div className="max-w-[720px] mx-auto px-5 pb-10">
        {/* Schemes */}
        <div className="flex justify-between items-center mt-8 mb-4">
          <h2 className="heading text-xl flex items-center gap-2">
            <span>🏛️</span> Popular Yojanas
          </h2>
          <Link
            href="/yojana"
            className="text-[13px] text-accent font-medium"
          >
            View all {schemes.length} →
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {schemes.slice(0, 5).map((s) => (
            <Link
              key={s.slug}
              href={`/yojana/${s.slug}`}
              className="flex items-center gap-3 p-3.5 card hover:border-accent/30 transition-colors"
            >
              <span className="text-2xl">{s.hero.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-text truncate">
                  {s.title}
                </div>
                <div className="text-[11px] text-text-muted mt-0.5 truncate">
                  {s.hero.one_liner}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[13px] font-bold text-accent">
                  {s.hero.stats[0]?.value}
                </div>
                <Badge status={s.hero.status as any}>Active</Badge>
              </div>
            </Link>
          ))}
        </div>

        {/* Exams */}
        <div className="flex justify-between items-center mt-10 mb-4">
          <h2 className="heading text-xl flex items-center gap-2">
            <span>📝</span> Exam Guides
          </h2>
          <Link href="/exam" className="text-[13px] text-accent font-medium">
            View all {exams.length} →
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {exams.slice(0, 4).map((e) => (
            <Link
              key={e.slug}
              href={`/exam/${e.slug}`}
              className="p-3.5 card hover:border-accent/30 transition-colors"
            >
              <div className="text-[14px] font-semibold text-text">
                {e.title}
              </div>
              <div className="text-[11px] text-text-muted mt-1 flex gap-4">
                <span>📅 {e.hero.stats[0]?.value}</span>
                <span>👥 {e.hero.stats[1]?.value} posts</span>
                <span>💰 {e.hero.stats[2]?.value}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Paisa */}
        <div className="flex justify-between items-center mt-10 mb-4">
          <h2 className="heading text-xl flex items-center gap-2">
            <span>💰</span> Paisa Guide
          </h2>
          <Link href="/paisa" className="text-[13px] text-accent font-medium">
            View all {articles.length} →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {articles.slice(0, 4).map((p) => (
            <Link
              key={p.slug}
              href={`/paisa/${p.slug}`}
              className="p-4 card hover:border-accent/30 transition-colors"
            >
              <Tag>{p.hero.tags[0]}</Tag>
              <div className="text-[13px] font-semibold text-text mt-2.5 mb-1">
                {p.title}
              </div>
              <div className="text-[11px] text-text-secondary leading-relaxed">
                {p.hero.one_liner.slice(0, 80)}...
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
