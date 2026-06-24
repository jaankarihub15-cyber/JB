import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSchemes } from "@/lib/content";
import { states, type StateKey } from "@/lib/categories";
import { JsonLd } from "@/components/json-ld";
import { SchemeDashboard } from "@/components/scheme-dashboard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(states).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const state = states[slug as StateKey];
  if (!state) return {};
  const allSchemes = getAllSchemes();
  const stateSchemes = allSchemes.filter((s: any) => s.state === slug);
  const centralCount = allSchemes.filter((s: any) => s.isCentral).length;
  return {
    title: `${state.label} Government Schemes 2026: ${stateSchemes.length} State + ${centralCount} Central`,
    description: `All government schemes for ${state.label} residents 2026. ${stateSchemes.length} state-specific + ${centralCount} central schemes. Eligibility, benefits, documents.`,
    alternates: { canonical: `https://knowledgekendra.com/yojana-by-state/${slug}` },
  };
}

export default async function StateHub({ params }: PageProps) {
  const { slug } = await params;
  const state = states[slug as StateKey];
  if (!state) notFound();

  const allSchemes = getAllSchemes();
  const stateSchemes = allSchemes.filter((s: any) => s.state === slug);
  const centralSchemes = allSchemes.filter((s: any) => s.isCentral);
  const combined = [...stateSchemes, ...centralSchemes];

  const otherStates = Object.values(states).filter(s => s.slug !== slug);

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://knowledgekendra.com" },
          { "@type": "ListItem", position: 2, name: "Schemes", item: "https://knowledgekendra.com/yojana" },
          { "@type": "ListItem", position: 3, name: `${state.label} Schemes`, item: `https://knowledgekendra.com/yojana-by-state/${slug}` },
        ]
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${state.label} Government Schemes`,
        description: `Government schemes available in ${state.label}`,
        url: `https://knowledgekendra.com/yojana-by-state/${slug}`,
        hasPart: combined.map((s: any) => ({
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
          <span className="text-text font-semibold">{state.label} Schemes</span>
        </nav>

        <section className="mb-6 bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-accent-light flex items-center justify-center text-xl font-extrabold text-accent shrink-0">{state.short}</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text leading-tight">{state.label} Government Schemes 2026</h1>
              <p className="text-sm md:text-base text-text-secondary mt-1 leading-relaxed">
                {state.label}-specific schemes plus central schemes available to all residents.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5 pt-5 border-t border-border">
            <div>
              <div className="text-xl md:text-2xl font-extrabold text-accent font-mono">{stateSchemes.length + centralSchemes.length}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-0.5">Total Available</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-extrabold text-accent font-mono">{stateSchemes.length}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-0.5">{state.label} Only</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-extrabold text-accent font-mono">{centralSchemes.length}</div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mt-0.5">Central (All India)</div>
            </div>
          </div>
        </section>

        {/* Dashboard - all schemes available to this state */}
        <section className="mb-10">
          <SchemeDashboard schemes={combined as any} showStateFilter={false} showCategoryFilter={true} defaultSort="state" />
        </section>

        {/* Other states */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-5">
            <h2 className="text-lg md:text-xl font-extrabold tracking-tight">Schemes in Other States</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {otherStates.map((s) => {
              const count = allSchemes.filter((sch: any) => sch.state === s.slug).length;
              return (
                <Link
                  key={s.slug}
                  href={`/yojana-by-state/${s.slug}`}
                  className="group bg-card border border-border rounded-xl p-3.5 hover:border-accent transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center text-xs font-extrabold text-accent mb-2">{s.short}</div>
                  <div className="text-xs font-bold text-text group-hover:text-accent">{s.label}</div>
                  <div className="text-[10px] text-text-muted">{count} state schemes</div>
                </Link>
              );
            })}
          </div>
        </section>

      </div>
    </>
  );
}
