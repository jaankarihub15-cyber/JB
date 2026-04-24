import Link from "next/link";
import { getAllSchemes, getAllExams, getAllPaisaArticles, getAllGuides, getAllCompare } from "@/lib/content";
import { JsonLd } from "@/components/json-ld";

export default function HomePage() {
  const schemes = getAllSchemes();
  const exams = getAllExams();
  const articles = getAllPaisaArticles();
  const guides = getAllGuides();
  const compares = getAllCompare();

  const cats = [
    { num: schemes.length, label: "Schemes", color: "bg-accent", lightColor: "bg-accent-light", textColor: "text-accent", href: "/yojana", icon: "🏛️", desc: "Central & state government welfare programs" },
    { num: exams.length, label: "Exams", color: "bg-blue", lightColor: "bg-blue-light", textColor: "text-blue", href: "/exam", icon: "📝", desc: "Pattern, syllabus, salary & preparation" },
    { num: articles.length, label: "Finance", color: "bg-orange", lightColor: "bg-orange-light", textColor: "text-orange", href: "/paisa", icon: "💰", desc: "SIP, tax, insurance & savings guides" },
    { num: guides.length, label: "Guides", color: "bg-purple", lightColor: "bg-purple-light", textColor: "text-purple", href: "/guide", icon: "📋", desc: "Aadhaar, PAN, passport & certificates" },
    { num: compares.length, label: "Compare", color: "bg-blue", lightColor: "bg-blue-light", textColor: "text-blue", href: "/compare", icon: "⚖️", desc: "Side-by-side investment & career picks" },
  ];

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebSite", name: "KnowledgeKendra",
        url: "https://knowledgekendra.com",
        description: "Find government schemes you're eligible for, prepare for exams, and learn personal finance.",
        publisher: { "@type": "Organization", name: "KnowledgeKendra", url: "https://knowledgekendra.com" },
      }} />

      <div className="max-w-[1100px] mx-auto px-6">

        {/* HERO — full width, no empty space */}
        <section className="mt-8 mb-6">
          <div className="bg-card border border-border rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_380px]">
              {/* Left */}
              <div className="p-6 md:p-10">
                <span className="inline-flex px-4 py-1.5 bg-accent-light text-accent rounded-full text-xs font-bold mb-5">
                  150+ pages of verified content
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text leading-tight mb-3">
                  Every scheme, exam &amp; money guide you need
                </h1>
                <p className="text-sm text-text-secondary max-w-md leading-relaxed mb-6">
                  Clear, jargon-free information on government schemes, competitive exams, and personal finance for India.
                </p>
                <div className="flex gap-3">
                  <Link href="/check-eligibility" className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-dark transition-colors">
                    Check Eligibility
                  </Link>
                  <Link href="/yojana" className="px-5 py-2.5 rounded-xl bg-card-alt text-text border border-border text-sm font-semibold hover:bg-border/30 transition-colors">
                    Browse Schemes
                  </Link>
                </div>
              </div>
              {/* Right — category cards filling space */}
              <div className="bg-card-alt p-6 flex flex-col gap-2.5 justify-center border-l border-border">
                {cats.map((c) => (
                  <Link key={c.label} href={c.href} className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border hover:border-accent/30 hover:-translate-y-px transition-all">
                    <div className={`w-10 h-10 rounded-xl ${c.lightColor} flex items-center justify-center text-base`}>{c.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-text">{c.label} <span className={`text-xs font-semibold ${c.textColor}`}>({c.num})</span></div>
                      <div className="text-[11px] text-text-muted truncate">{c.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SCHEMES */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-extrabold tracking-tight">Government Schemes</h2>
            <Link href="/yojana" className="text-xs font-bold text-accent bg-accent-light px-3.5 py-1.5 rounded-lg">View all {schemes.length} →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {schemes.slice(0, 6).map((s: any) => (
              <Link key={s.slug} href={`/yojana/${s.slug}`} className="bg-card border border-border rounded-2xl p-4 grid grid-cols-[44px_1fr] gap-3 hover:border-accent/40 hover:shadow-sm hover:-translate-y-px transition-all">
                <div className="w-11 h-11 rounded-xl bg-accent-light flex items-center justify-center text-lg">{s.hero?.icon || "📋"}</div>
                <div>
                  <div className="text-sm font-bold text-text">{s.title}</div>
                  <div className="text-xs text-text-secondary mt-0.5 line-clamp-2 leading-relaxed">{s.hero?.one_liner}</div>
                  <div className="flex gap-1.5 mt-2">
                    {s.hero?.stats?.slice(0, 2).map((st: any) => (
                      <span key={st.label} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent-light text-accent">{st.value}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* EXAMS */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-extrabold tracking-tight">Competitive Exams</h2>
            <Link href="/exam" className="text-xs font-bold text-blue bg-blue-light px-3.5 py-1.5 rounded-lg">View all {exams.length} →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {exams.slice(0, 8).map((e: any) => (
              <Link key={e.slug} href={`/exam/${e.slug}`} className="bg-card border border-border rounded-2xl p-4 hover:border-blue/40 hover:shadow-sm hover:-translate-y-px transition-all">
                <div className="text-sm font-bold text-text mb-1">{e.title}</div>
                <div className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">{e.hero?.one_liner?.slice(0, 55)}...</div>
                {e.hero?.stats?.[0] && (
                  <div className="mt-2 inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent-light text-accent">{e.hero.stats[0].value}</div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* PAISA */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-extrabold tracking-tight">Paisa Guides</h2>
            <Link href="/paisa" className="text-xs font-bold text-orange bg-orange-light px-3.5 py-1.5 rounded-lg">View all {articles.length} →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {articles.slice(0, 4).map((a: any) => (
              <Link key={a.slug} href={`/paisa/${a.slug}`} className="bg-card border border-border rounded-2xl p-4 hover:border-orange/40 hover:shadow-sm hover:-translate-y-px transition-all">
                <div className="text-sm font-bold text-text mb-1">{a.title}</div>
                <div className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">{a.hero?.one_liner?.slice(0, 65)}...</div>
              </Link>
            ))}
          </div>
        </section>

        {/* GUIDES as pills */}
        <section className="mb-8">
          <h2 className="text-lg font-extrabold tracking-tight mb-4">Quick Guides</h2>
          <div className="flex flex-wrap gap-2 overflow-hidden">
            {guides.slice(0, 12).map((g: any) => (
              <Link key={g.slug} href={`/guide/${g.slug}`} className="px-3.5 py-2 bg-card border border-border rounded-xl text-xs font-semibold text-text-secondary hover:border-accent hover:bg-accent-light hover:text-accent transition-all">
                {g.hero?.icon} {g.title.replace(/^How to /, "").replace(/ —.*/, "").replace(/ Online.*/, "")}
              </Link>
            ))}
            <Link href="/guide" className="px-3.5 py-2 bg-accent-light rounded-xl text-xs font-bold text-accent">All {guides.length} guides →</Link>
          </div>
        </section>

        {/* COMPARISONS */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-extrabold tracking-tight">Comparisons</h2>
            <Link href="/compare" className="text-xs font-bold text-purple bg-purple-light px-3.5 py-1.5 rounded-lg">View all {compares.length} →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {compares.slice(0, 6).map((c: any) => (
              <Link key={c.slug} href={`/compare/${c.slug}`} className="bg-card border border-border rounded-2xl p-4 hover:border-purple/40 hover:shadow-sm hover:-translate-y-px transition-all">
                <div className="text-sm font-bold text-text mb-1">{c.title}</div>
                <div className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">{c.hero?.one_liner?.slice(0, 75)}...</div>
              </Link>
            ))}
          </div>
        </section>

        {/* POPULAR STATE SCHEMES — extra content */}
        <section className="mb-12">
          <h2 className="text-lg font-extrabold tracking-tight mb-4">Popular State Schemes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {schemes.filter((s: any) => ['ladli-behna-yojana','kanya-sumangala-yojana','majhi-ladki-bahin','chiranjeevi-yojana','gruha-lakshmi','rythu-bandhu','bihar-student-credit-card','sikho-kamao-yojana'].includes(s.slug)).slice(0, 8).map((s: any) => (
              <Link key={s.slug} href={`/yojana/${s.slug}`} className="bg-card border border-border rounded-2xl p-4 hover:border-accent/40 hover:shadow-sm hover:-translate-y-px transition-all">
                <div className="text-lg mb-1">{s.hero?.icon}</div>
                <div className="text-sm font-bold text-text mb-0.5">{s.title}</div>
                <div className="text-[11px] text-text-muted">{s.tags?.[0]}</div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
