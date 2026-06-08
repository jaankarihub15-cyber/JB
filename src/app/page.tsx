import Link from "next/link";
import { getAllSchemes, getAllExams, getAllPaisaArticles, getAllGuides, getAllCompare } from "@/lib/content";
import { JsonLd } from "@/components/json-ld";
import { SavedPagesList } from "@/components/save-for-later";
import { examCategories, schemeCategories } from "@/lib/categories";
import { HeroSearch } from "@/components/hero-search";

export default function HomePage() {
  const schemes = getAllSchemes();
  const exams = getAllExams();
  const articles = getAllPaisaArticles();
  const guides = getAllGuides();
  const compares = getAllCompare();

  // Count exams per category
  const examCounts = Object.values(examCategories).map(cat => ({
    ...cat,
    count: exams.filter((e: any) => e.category === cat.slug).length,
  }));

  // Count schemes per category
  const schemeCounts = Object.values(schemeCategories).map(cat => ({
    ...cat,
    count: schemes.filter((s: any) => s.category === cat.slug).length,
  }));

  // Trending exams (high-priority ones)
  const trendingExams = [
    "ssc-cgl-2026",
    "appsc",
    "bpsc",
    "rbi-grade-b",
    "uppsc-pcs",
    "ibps-po",
  ];
  const trendingExamData = trendingExams
    .map(slug => exams.find((e: any) => e.slug === slug))
    .filter(Boolean);

  // Popular schemes
  const popularSchemes = [
    "pm-kisan",
    "ayushman-bharat",
    "majhi-ladki-bahin",
    "ladli-behna-yojana",
    "pm-mudra-yojana",
    "rythu-bandhu",
  ];
  const popularSchemeData = popularSchemes
    .map(slug => schemes.find((s: any) => s.slug === slug))
    .filter(Boolean);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "KnowledgeKendra",
        url: "https://knowledgekendra.com",
        description: "Find government schemes you're eligible for, prepare for exams, and learn personal finance.",
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: "https://knowledgekendra.com/search?q={search_term_string}" },
          "query-input": "required name=search_term_string",
        },
        publisher: {
          "@type": "Organization",
          name: "KnowledgeKendra",
          url: "https://knowledgekendra.com",
          logo: { "@type": "ImageObject", url: "https://knowledgekendra.com/favicon.ico" },
        },
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Ash K.",
        url: "https://knowledgekendra.com/about",
        sameAs: [
          "https://medium.com/@jaankarihub15",
          "https://www.linkedin.com/in/knowledgekendra",
        ],
        knowsAbout: ["Government Schemes", "Competitive Exams", "Financial Literacy", "Indian Government Policies"],
        worksFor: { "@type": "Organization", name: "KnowledgeKendra", url: "https://knowledgekendra.com" },
      }} />

      <div className="max-w-[1100px] mx-auto px-4 md:px-6">

        <SavedPagesList />

        {/* HERO with category-tabbed search */}
        <HeroSearch
          totalSchemes={schemes.length}
          totalExams={exams.length}
          totalCalculators={13}
        />

        {/* EXAM CATEGORIES GRID */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Competitive Exams</h2>
              <p className="text-sm text-text-muted mt-1">{exams.length} exams across 10 categories</p>
            </div>
            <Link href="/exam" className="text-xs font-bold text-accent hover:underline shrink-0">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {examCounts.map((cat) => (
              <Link
                key={cat.slug}
                href={`/exam-categories/${cat.slug}`}
                className="group bg-card border border-border rounded-2xl p-4 hover:border-accent hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-lg mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div className="text-sm font-bold text-text mb-0.5 group-hover:text-accent">{cat.short}</div>
                <div className="text-[11px] text-text-muted">{cat.count} exams</div>
              </Link>
            ))}
          </div>
        </section>

        {/* SCHEME CATEGORIES GRID */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Government Schemes</h2>
              <p className="text-sm text-text-muted mt-1">{schemes.length} schemes across 10 categories</p>
            </div>
            <Link href="/yojana" className="text-xs font-bold text-accent hover:underline shrink-0">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {schemeCounts.map((cat) => (
              <Link
                key={cat.slug}
                href={`/yojana-categories/${cat.slug}`}
                className="group bg-card border border-border rounded-2xl p-4 hover:border-accent hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-lg mb-3 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <div className="text-sm font-bold text-text mb-0.5 group-hover:text-accent">{cat.short}</div>
                <div className="text-[11px] text-text-muted">{cat.count} schemes</div>
              </Link>
            ))}
          </div>
        </section>

        {/* TRENDING EXAMS */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Trending exams 2026</h2>
              <p className="text-sm text-text-muted mt-1">Notifications open or expected this quarter</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trendingExamData.map((e: any) => (
              <Link key={e.slug} href={`/exam/${e.slug}`} className="bg-card border border-border rounded-2xl p-5 hover:border-accent hover:shadow-sm transition-all group">
                <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
                  {examCategories[e.category as keyof typeof examCategories]?.short || "Exam"}
                </div>
                <div className="text-base font-bold text-text mb-2 group-hover:text-accent leading-snug">{e.title.split(":")[0]}</div>
                {e.hero?.stats?.[0] && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {e.hero.stats.slice(0, 2).map((st: any) => (
                      <span key={st.label} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-accent-light text-accent">
                        {st.value}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* POPULAR SCHEMES */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Most-searched schemes</h2>
              <p className="text-sm text-text-muted mt-1">Schemes with the most applicants right now</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularSchemeData.map((s: any) => (
              <Link key={s.slug} href={`/yojana/${s.slug}`} className="bg-card border border-border rounded-2xl p-5 hover:border-accent hover:shadow-sm transition-all group">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-accent-light flex items-center justify-center text-xl shrink-0">
                    {s.hero?.icon || "📋"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-text mb-1 group-hover:text-accent line-clamp-2 leading-snug">{s.title.split(":")[0]}</div>
                    <div className="text-[11px] text-text-muted line-clamp-1">{s.hero?.one_liner}</div>
                  </div>
                </div>
                {s.hero?.stats?.[0] && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pl-14">
                    {s.hero.stats.slice(0, 2).map((st: any) => (
                      <span key={st.label} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-accent-light text-accent">
                        {st.value}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {/* FREE TOOLS */}
        <section className="mb-10">
          <div className="bg-gradient-to-br from-accent-light to-card-alt rounded-3xl p-6 md:p-8 border border-border">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mb-2">Free calculators &amp; tools</h2>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Plan your taxes, retirement, EMI, SIP, and more. No signup, no ads. Results in seconds.
                </p>
                <Link href="/calculator" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border text-text text-sm font-bold hover:border-accent transition-colors">
                  Browse all 13 calculators →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:max-w-md">
                {[
                  { href: "/calculator/emi-calculator", label: "EMI", icon: "💳" },
                  { href: "/calculator/sip-calculator", label: "SIP", icon: "📈" },
                  { href: "/calculator/income-tax-calculator", label: "Income Tax", icon: "📊" },
                  { href: "/calculator/epf-calculator", label: "EPF", icon: "🏦" },
                  { href: "/calculator/ppf-calculator", label: "PPF", icon: "💼" },
                  { href: "/calculator/hra-calculator", label: "HRA", icon: "🏠" },
                  { href: "/calculator/gratuity-calculator", label: "Gratuity", icon: "💼" },
                  { href: "/calculator/cgpa-calculator", label: "CGPA", icon: "🎓" },
                ].map(t => (
                  <Link key={t.href} href={t.href} className="bg-card rounded-xl px-3 py-2.5 text-center hover:border-accent border border-border transition-colors">
                    <div className="text-lg">{t.icon}</div>
                    <div className="text-[11px] font-bold text-text mt-0.5">{t.label}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOR FIRST-TIME APPLICANTS */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Helpful guides</h2>
              <p className="text-sm text-text-muted mt-1">Documents, applications, and what gets rejected</p>
            </div>
            <Link href="/guide" className="text-xs font-bold text-accent hover:underline shrink-0">All guides →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {guides.slice(0, 8).map((g: any) => (
              <Link key={g.slug} href={`/guide/${g.slug}`} className="bg-card border border-border rounded-xl p-4 hover:border-accent transition-colors">
                <div className="text-xl mb-2">{g.hero?.icon || "📋"}</div>
                <div className="text-xs font-bold text-text leading-snug line-clamp-2">
                  {g.title.replace(/^How to /, "").replace(/ -.*/, "").replace(/ Online.*/, "")}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* TRUST SIGNAL */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-2xl font-extrabold text-accent mb-1">100% verified</div>
                <div className="text-xs font-bold text-text mb-1">From official sources</div>
                <div className="text-xs text-text-muted leading-relaxed">Every fact cross-checked with PIB, gov.in portals, or official notifications.</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-accent mb-1">Written by Ash K.</div>
                <div className="text-xs font-bold text-text mb-1">Researched, not copied</div>
                <div className="text-xs text-text-muted leading-relaxed">Each guide is written and checked by a real person. <Link href="/about" className="text-accent font-semibold hover:underline">About →</Link></div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
