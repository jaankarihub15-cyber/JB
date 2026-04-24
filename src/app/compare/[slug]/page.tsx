import { AuthorBox } from "@/components/author-box";
import { notFound } from "next/navigation";
import { getCompareBySlug, getAllCompareSlugs } from "@/lib/content";
import { Breadcrumb, HeroBanner, SectionHeading, Card, InfoRow, StepCard, FAQ, Tag } from "@/components/ui";
import { JsonLd, faqSchema, breadcrumbSchema } from "@/components/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllCompareSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getCompareBySlug(slug);
  if (!item) return {};
  const url = `https://knowledgekendra.com/compare/${slug}`;
  return {
    title: item.title,
    description: item.meta_description,
    alternates: { canonical: url },
    openGraph: { title: item.title, description: item.meta_description, url, type: "article",
      images: [{ url: `/api/og?title=${encodeURIComponent(item.title)}&icon=⚖️&cat=paisa`, width: 1200, height: 630, alt: item.title }],
    },
    twitter: { card: "summary_large_image", title: item.title, description: item.meta_description },
  };
}

export default async function CompareDetailPage({ params }: Props) {
  const { slug } = await params;
  const c = getCompareBySlug(slug);
  if (!c) notFound();

  return (
    <div className="max-w-[860px] mx-auto px-5 py-6">
      <article itemScope itemType="https://schema.org/Article">
        <meta itemProp="headline" content={c.title} />
        <meta itemProp="description" content={(c as any).meta_description || c.hero.one_liner} />
      </article>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://knowledgekendra.com" },
        { name: "Compare", url: "https://knowledgekendra.com/compare" },
        { name: c.title, url: `https://knowledgekendra.com/compare/${slug}` },
      ])} />
      {c.faqs?.length > 0 && <JsonLd data={faqSchema(c.faqs)} />}
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Compare", href: "/compare" }, { label: c.title }]} />
      <HeroBanner title={c.title} subtitle={c.hero.one_liner} icon={c.hero.icon} gradient="linear-gradient(135deg, #1959A8 0%, #0D3B7A 100%)" stats={c.hero.stats} updatedDate={c.hero.updated_date} />

      {c.sections.map((section: any, idx: number) => (
        <div key={idx}>
          <SectionHeading icon={section.icon}>{section.heading}</SectionHeading>
          {section.type === "text" && section.content.map((para: string, i: number) => (
            <p key={i} className="text-[15px] text-text-secondary leading-[1.75] mb-5" dangerouslySetInnerHTML={{ __html: para }} />
          ))}
          {section.type === "steps" && (
            <div className="flex flex-col gap-2">
              {section.steps.map((step: any) => (<StepCard key={step.step} number={step.step} title={step.title} description={step.description} />))}
            </div>
          )}
          {section.type === "info_rows" && (<Card>{section.rows.map((row: any) => (<InfoRow key={row.label} label={row.label} value={row.value} highlight={row.highlight} />))}</Card>)}
          {section.type === "table" && (
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                <thead><tr className="bg-card-alt">{section.columns.map((col: string) => (<th key={col} className="px-4 py-2.5 text-left font-semibold text-text border-b border-border">{col}</th>))}</tr></thead>
                <tbody>{section.rows.map((row: string[], ri: number) => (<tr key={ri} className="border-b border-border last:border-b-0">{row.map((cell: string, ci: number) => (<td key={ci} className={`px-4 py-2.5 text-text-secondary ${ci === 0 ? "font-medium text-text" : ""}`} dangerouslySetInnerHTML={{ __html: cell }} />))}</tr>))}</tbody>
              </table>
            </div>
          )}
          {section.type === "svg_block" && (
            <div className="my-6">
              {section.caption && (
                <p className="text-xs text-text-muted mb-2 text-center italic">{section.caption}</p>
              )}
              <div 
                className="card p-4 flex justify-center overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: section.svg }}
              />
              {section.description && (
                <p className="text-sm text-text-secondary mt-3" dangerouslySetInnerHTML={{ __html: section.description }} />
              )}
            </div>
          )}
          {section.type === "callout" && (
            <div className="my-5 rounded-r-lg p-4" style={{
              borderLeft: `4px solid ${section.variant === "warning" ? "#DC2626" : section.variant === "tip" ? "#EA580C" : section.variant === "info" ? "#2563EB" : "#1B6B4A"}`,
              backgroundColor: section.variant === "warning" ? "#FEE2E2" : section.variant === "tip" ? "#FFF7ED" : section.variant === "info" ? "#DBEAFE" : "#DCFCE7"
            }}>
              {section.heading && (
                <p className="text-sm font-bold mb-1.5 text-text flex items-center gap-2">
                  <span>{section.icon || "💡"}</span>
                  <span>{section.heading}</span>
                </p>
              )}
              <p className="text-sm text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          )}

          {section.type === "pullquote" && (
            <blockquote className="my-6 border-l-4 border-accent pl-5 py-2">
              <p className="text-lg font-semibold text-text leading-snug italic" dangerouslySetInnerHTML={{ __html: section.text }} />
              {section.attribution && (
                <footer className="text-xs text-text-muted mt-2 not-italic">— {section.attribution}</footer>
              )}
            </blockquote>
          )}

          {section.type === "stat_cards" && (
            <div className="my-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              {section.cards.map((card: any, i: number) => (
                <div key={i} className={`card p-4 text-center ${
                  card.variant === "accent" ? "bg-accent-light border-accent" : ""
                }`}>
                  <p className={`text-2xl font-bold ${card.variant === "accent" ? "text-accent" : "text-text"}`}>{card.value}</p>
                  <p className="text-xs text-text-muted mt-1">{card.label}</p>
                </div>
              ))}
            </div>
          )}

          {section.type === "divider" && (
            <div className="my-8 flex items-center gap-3">
              <div className="flex-1 h-px bg-border"></div>
              {section.label && <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">{section.label}</span>}
              <div className="flex-1 h-px bg-border"></div>
            </div>
          )}
        </div>
      ))}

      {c.faqs?.length > 0 && (<><SectionHeading icon="❓">Frequently Asked Questions</SectionHeading>{c.faqs.map((f: any) => (<FAQ key={f.question} question={f.question} answer={f.answer} />))}</>)}
      {c.related_pages?.length > 0 && (<div className="mt-10 flex flex-wrap gap-2">{c.related_pages.map((r: any) => (<a key={r.slug} href={r.url || `/compare/${r.slug}`} className="px-4 py-2 rounded-lg text-sm bg-card border border-border hover:border-accent/40 text-text-secondary transition-colors">{r.title} →</a>))}</div>)}
      {c.disclaimer && (<div className="mt-8 p-4 bg-card-alt rounded-xl text-sm text-text-muted leading-relaxed">{c.disclaimer}
      <AuthorBox updatedDate="March 2026" />
    </div>)}
    </div>
  );
}
