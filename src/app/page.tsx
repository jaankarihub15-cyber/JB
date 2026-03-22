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
      <section className="text-center px-6 pt-14 pb-12 bg-gradient-to-b from-purple-light to-bg">
        <p className="text-sm font-semibold text-purple uppercase tracking-widest mb-4">
          India&apos;s cleanest government info site
        </p>
        <h1 className="heading text-4xl md:text-5xl font-normal text-text leading-tight mb-4">
          Find Schemes You
          <br />
          Qualify For in 30 Seconds
        </h1>
        <p className="text-lg text-text-secondary max-w-lg mx-auto leading-relaxed mb-8">
          Answer 5 quick questions and get a personalized list of government
          schemes, benefits, and how to apply.
        </p>
        <Link
          href="/check-eligibility"
          className="inline-block px-10 py-4 rounded-xl bg-purple text-white text-lg font-semibold shadow-lg shadow-purple/25 hover:shadow-purple/35 transition-shadow"
        >
          Check My Eligibility →
        </Link>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card">
        <div className="max-w-[860px] mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: `${schemes.length}+`, label: "Government Schemes" },
            { value: `${exams.length}+`, label: "Exam Guides" },
            { value: `${articles.length}+`, label: "Finance Articles" },
            { value: "100%", label: "Free & Ad-Free" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-accent">{s.value}</div>
              <div className="text-sm text-text-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-[860px] mx-auto px-6 pb-12">

        {/* How It Works */}
        <section className="mt-14">
          <h2 className="heading text-2xl text-center mb-8">How JaankariHub Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🔍", title: "Find What Applies to You", desc: "Take our 30-second eligibility quiz or browse by category. We match you with schemes based on your age, occupation, income, and gender." },
              { icon: "📖", title: "Understand in Simple Language", desc: "Every scheme, exam, and finance topic explained in plain English. No jargon, no filler — just the facts you need to take action." },
              { icon: "✅", title: "Apply with Confidence", desc: "Step-by-step instructions, official portal links, document checklists, and FAQs. Everything to go from 'I didn't know this existed' to 'I just applied.'" },
            ].map((step) => (
              <div key={step.title} className="card p-6 text-center">
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="text-lg font-semibold text-text mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Browse by Category */}
        <section className="mt-14">
          <h2 className="heading text-2xl mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: "🌾", label: "Farmers", href: "/yojana" },
              { icon: "👩", label: "Women", href: "/yojana" },
              { icon: "🏠", label: "Housing", href: "/yojana" },
              { icon: "🏥", label: "Health", href: "/yojana" },
              { icon: "💼", label: "Business", href: "/yojana" },
              { icon: "👴", label: "Pension", href: "/yojana" },
              { icon: "📚", label: "Education", href: "/exam" },
              { icon: "💰", label: "Finance", href: "/paisa" },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="card p-4 text-center hover:border-accent/40 transition-colors"
              >
                <div className="text-2xl mb-1.5">{cat.icon}</div>
                <div className="text-sm font-medium text-text">{cat.label}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Schemes */}
        <section className="mt-14">
          <div className="flex justify-between items-center mb-5">
            <h2 className="heading text-2xl flex items-center gap-3">
              <span>🏛️</span> Popular Yojanas
            </h2>
            <Link href="/yojana" className="text-base text-accent font-medium">
              View all {schemes.length} →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {schemes.slice(0, 6).map((s) => (
              <Link
                key={s.slug}
                href={`/yojana/${s.slug}`}
                className="flex items-center gap-4 p-5 card hover:border-accent/30 transition-colors"
              >
                <span className="text-3xl">{s.hero.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-text">{s.title}</div>
                  <div className="text-sm text-text-muted mt-1 line-clamp-1">{s.hero.one_liner}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-accent">{s.hero.stats[0]?.value}</div>
                  <Badge status={s.hero.status as any}>Active</Badge>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Exams */}
        <section className="mt-14">
          <div className="flex justify-between items-center mb-5">
            <h2 className="heading text-2xl flex items-center gap-3">
              <span>📝</span> Exam Guides
            </h2>
            <Link href="/exam" className="text-base text-accent font-medium">
              View all {exams.length} →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {exams.slice(0, 5).map((e) => (
              <Link
                key={e.slug}
                href={`/exam/${e.slug}`}
                className="p-5 card hover:border-accent/30 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-lg font-semibold text-text">{e.title}</div>
                  <Badge status={e.hero.status as any}>
                    {e.hero.status === "upcoming" ? "Upcoming" : "Active"}
                  </Badge>
                </div>
                <div className="text-sm text-text-secondary mb-3">{e.hero.one_liner}</div>
                <div className="flex gap-6 flex-wrap text-sm text-text-muted">
                  {e.hero.stats.map((s) => (
                    <span key={s.label}>
                      <span className="font-semibold text-accent">{s.value}</span>{" "}
                      <span>{s.label}</span>
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Paisa Guide */}
        <section className="mt-14">
          <div className="flex justify-between items-center mb-5">
            <h2 className="heading text-2xl flex items-center gap-3">
              <span>💰</span> Paisa Guide
            </h2>
            <Link href="/paisa" className="text-base text-accent font-medium">
              View all {articles.length} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {articles.slice(0, 6).map((p) => (
              <Link
                key={p.slug}
                href={`/paisa/${p.slug}`}
                className="p-5 card hover:border-accent/30 transition-colors"
              >
                <div className="flex gap-2 mb-3">
                  {p.hero.tags.map((t) => (
                    <Tag key={t} className="bg-orange-light">{t}</Tag>
                  ))}
                </div>
                <div className="text-base font-semibold text-text mb-1.5">{p.title}</div>
                <div className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                  {p.hero.one_liner}
                </div>
                <div className="text-sm text-text-muted mt-3">📖 {p.hero.read_time} read</div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Repeat */}
        <section className="mt-14 bg-gradient-to-r from-accent to-accent-dark rounded-2xl p-8 text-white text-center">
          <h2 className="heading text-2xl mb-3">Not sure which schemes apply to you?</h2>
          <p className="text-base opacity-85 mb-6 max-w-lg mx-auto">
            Our eligibility checker matches your profile against all {schemes.length} government schemes in 30 seconds. Free, no signup required.
          </p>
          <Link
            href="/check-eligibility"
            className="inline-block px-8 py-3.5 rounded-xl bg-white text-accent text-base font-semibold hover:bg-white/90 transition-colors"
          >
            Check My Eligibility →
          </Link>
        </section>

        {/* Trust Signal */}
        <section className="mt-14 p-6 bg-card-alt rounded-xl text-center">
          <div className="text-base text-text-secondary leading-relaxed">
            📋 All information on JaankariHub is sourced from official government portals including
            pmkisan.gov.in, ssc.gov.in, upsc.gov.in, and others. We update our content regularly
            and link directly to official application pages. No clickbait, no spam — just clarity.
          </div>
        </section>
      </div>
    </>
  );
}
