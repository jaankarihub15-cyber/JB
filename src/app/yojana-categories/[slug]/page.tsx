import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSchemes } from "@/lib/content";
import { schemeCategories, type SchemeCategoryKey } from "@/lib/categories";
import { JsonLd } from "@/components/json-ld";
import { SchemeDashboard } from "@/components/scheme-dashboard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(schemeCategories).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = schemeCategories[slug as SchemeCategoryKey];
  if (!cat) return {};
  const schemes = getAllSchemes().filter((s: any) => s.category === slug);
  return {
    title: `${cat.label} 2026: ${schemes.length} Government Schemes Compared`,
    description: `All ${schemes.length} ${cat.label.toLowerCase()} in India 2026. ${cat.description}`,
    alternates: { canonical: `https://knowledgekendra.com/yojana-categories/${slug}` },
  };
}

export default async function SchemeCategoryHub({ params }: PageProps) {
  const { slug } = await params;
  const cat = schemeCategories[slug as SchemeCategoryKey];
  if (!cat) notFound();

  const allSchemes = getAllSchemes();
  const schemes = allSchemes.filter((s: any) => s.category === slug);

  if (schemes.length === 0) notFound();

  const centralCount = schemes.filter((s: any) => s.isCentral).length;
  const stateCount = schemes.filter((s: any) => !s.isCentral && s.state).length;
  const otherCategories = Object.values(schemeCategories).filter(c => c.slug !== slug);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://knowledgekendra.com" },
          { "@type": "ListItem", position: 2, name: "Schemes", item: "https://knowledgekendra.com/yojana" },
          { "@type": "ListItem", position: 3, name: cat.label, item: `https://knowledgekendra.com/yojana-categories/${slug}` },
        ]
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: cat.label,
        description: cat.description,
        url: `https://knowledgekendra.com/yojana-categories/${slug}`,
        hasPart: schemes.map((s: any) => ({
          "@type": "WebPage",
          name: s.title,
          url: `https://knowledgekendra.com/yojana/${s.slug}`,
        })),
      }} />

      <div className="max-w-[1100px] mx-auto px-4 md:px-6">

        <nav className="pt-5 pb-3 text-xs text-text-muted flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span>/</span>
          <Link href="/yojana" className="hover:text-accent">Schemes</Link>
          <span>/</span>
          <span className="text-text font-semibold">{cat.label}</span>
        </nav>

        <section className="mb-6 bg-card border border-border rounded-2xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text leading-tight">{cat.label} 2026</h1>
          <p className="text-sm md:text-base text-text-secondary mt-2 leading-relaxed max-w-2xl">{cat.description}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5 pt-5 border-t border-border">
            <div>
              <div className="text-xl md:text-2xl font-extrabold text-accent font-mono">{schemes.length}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-0.5">Total Schemes</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-extrabold text-accent font-mono">{centralCount}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-0.5">Central</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-extrabold text-accent font-mono">{stateCount}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-0.5">State-Specific</div>
            </div>
          </div>
        </section>

        {/* Dashboard with filters */}
        <section className="mb-10">
          <SchemeDashboard schemes={schemes as any} showStateFilter={stateCount > 0} />
        </section>

        {/* Eligibility CTA */}
        <section className="mb-10 bg-gradient-to-br from-accent-light to-card-alt rounded-2xl p-6 md:p-8 border border-border">
          <h2 className="text-lg md:text-xl font-extrabold tracking-tight mb-3">Not sure if you qualify?</h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Check which {cat.short.toLowerCase()} schemes you qualify for based on your age, income, and state in under a minute.
          </p>
          <Link href="/check-eligibility" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-dark transition-colors">
            Check your eligibility →
          </Link>
        </section>

        {/* Other scheme categories */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-5">
            <h2 className="text-lg md:text-xl font-extrabold tracking-tight">Other scheme categories</h2>
            <Link href="/yojana" className="text-xs font-bold text-accent hover:underline">View all 55 schemes →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {otherCategories.map((c) => {
              const count = allSchemes.filter((s: any) => s.category === c.slug).length;
              return (
                <Link
                  key={c.slug}
                  href={`/yojana-categories/${c.slug}`}
                  className="group bg-card border border-border rounded-xl p-3.5 hover:border-accent transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-light flex items-center justify-center text-sm mb-2">{c.icon}</div>
                  <div className="text-xs font-bold text-text group-hover:text-accent">{c.short}</div>
                  <div className="text-[10px] text-text-muted">{count} schemes</div>
                </Link>
              );
            })}
          </div>
        </section>

      </div>
    </>
  );
}
