import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllExams } from "@/lib/content";
import { examCategories, type ExamCategoryKey } from "@/lib/categories";
import { JsonLd } from "@/components/json-ld";
import { ExamDashboard } from "@/components/exam-dashboard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(examCategories).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = examCategories[slug as ExamCategoryKey];
  if (!cat) return {};
  const exams = getAllExams().filter((e: any) => e.category === slug);
  return {
    title: `${cat.label} 2026: ${exams.length} Exams Compared - Salary, Eligibility`,
    description: `All ${exams.length} ${cat.label.toLowerCase()} in India 2026. ${cat.description} Compare salary, eligibility, exam pattern.`,
    alternates: { canonical: `https://knowledgekendra.com/exam-categories/${slug}` },
  };
}

export default async function ExamCategoryHub({ params }: PageProps) {
  const { slug } = await params;
  const cat = examCategories[slug as ExamCategoryKey];
  if (!cat) notFound();

  const allExams = getAllExams();
  const exams = allExams.filter((e: any) => e.category === slug);

  if (exams.length === 0) notFound();

  const otherCategories = Object.values(examCategories).filter(c => c.slug !== slug);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://knowledgekendra.com" },
          { "@type": "ListItem", position: 2, name: "Exams", item: "https://knowledgekendra.com/exam" },
          { "@type": "ListItem", position: 3, name: cat.label, item: `https://knowledgekendra.com/exam-categories/${slug}` },
        ]
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: cat.label,
        description: cat.description,
        url: `https://knowledgekendra.com/exam-categories/${slug}`,
        hasPart: exams.map((e: any) => ({
          "@type": "WebPage",
          name: e.title,
          url: `https://knowledgekendra.com/exam/${e.slug}`,
        })),
      }} />

      <div className="max-w-[1100px] mx-auto px-4 md:px-6">

        <nav className="pt-5 pb-3 text-xs text-text-muted flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span>/</span>
          <Link href="/exam" className="hover:text-accent">Exams</Link>
          <span>/</span>
          <span className="text-text font-semibold">{cat.label}</span>
        </nav>

        <section className="mb-6 bg-card border border-border rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text leading-tight">{cat.label} 2026</h1>
          <p className="text-sm md:text-base text-text-secondary mt-2 leading-relaxed max-w-2xl">{cat.description}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5 pt-5 border-t border-border">
            <div>
              <div className="text-xl md:text-2xl font-extrabold text-accent font-mono">{exams.length}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-0.5">Total Exams</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-extrabold text-accent font-mono">2026</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-0.5">Updated</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-extrabold text-accent font-mono">{cat.examples.split(",").length}+</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-0.5">{cat.examples}</div>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <section className="mb-10">
          <ExamDashboard exams={exams as any} showCategoryFilter={false} />
        </section>

        {/* Quick comparison helper */}
        <section className="mb-10 bg-gradient-to-br from-accent-light to-card-alt rounded-2xl p-6 md:p-8 border border-border">
          <h2 className="text-lg md:text-xl font-extrabold tracking-tight mb-3">Not sure which exam to pick?</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Compare {cat.short.toLowerCase()} exams by salary, difficulty, and selection ratio.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/compare/bank-po-vs-ssc-cgl-vs-state-psc" className="px-4 py-2 rounded-xl bg-card border border-border text-text text-xs font-bold hover:border-accent transition-colors">
              Bank PO vs SSC CGL vs State PSC →
            </Link>
            <Link href="/guide/age-relaxation" className="px-4 py-2 rounded-xl bg-card border border-border text-text text-xs font-bold hover:border-accent transition-colors">
              Age relaxation rules →
            </Link>
            <Link href="/check-eligibility" className="px-4 py-2 rounded-xl bg-card border border-border text-text text-xs font-bold hover:border-accent transition-colors">
              Check eligibility →
            </Link>
          </div>
        </section>

        {/* Other exam categories */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-5">
            <h2 className="text-lg md:text-xl font-extrabold tracking-tight">Other exam categories</h2>
            <Link href="/exam" className="text-xs font-bold text-accent hover:underline">View all 40 exams →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {otherCategories.map((c) => {
              const count = allExams.filter((e: any) => e.category === c.slug).length;
              return (
                <Link
                  key={c.slug}
                  href={`/exam-categories/${c.slug}`}
                  className="group bg-card border border-border rounded-xl p-3.5 hover:border-accent transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center text-sm mb-2">{c.icon}</div>
                  <div className="text-xs font-bold text-text group-hover:text-accent">{c.short}</div>
                  <div className="text-[10px] text-text-muted">{count} exams</div>
                </Link>
              );
            })}
          </div>
        </section>

      </div>
    </>
  );
}
