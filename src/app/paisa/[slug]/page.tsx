import { AuthorBox } from "@/components/author-box";
import { notFound } from "next/navigation";
import { getPaisaBySlug, getAllPaisaSlugs } from "@/lib/content";
import {
  Breadcrumb, HeroBanner, SectionHeading, Card, InfoRow, StepCard, FAQ, Tag,
} from "@/components/ui";
import { JsonLd, faqSchema, breadcrumbSchema, articleSchema } from "@/components/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPaisaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getPaisaBySlug(slug);
  if (!article) return {};
  const url = `https://knowledgekendra.com/paisa/${slug}`;
  return {
    title: article.title,
    description: article.meta_description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.meta_description,
      url,
      type: "article",
      images: [{
        url: `/api/og?title=${encodeURIComponent(article.title)}&icon=${encodeURIComponent((article as any).hero?.icon || '💰')}&cat=paisa`,
        width: 1200,
        height: 630,
        alt: article.title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.meta_description,
    },
  };
}

export default async function PaisaDetailPage({ params }: Props) {
  const { slug } = await params;
  const p = getPaisaBySlug(slug);
  if (!p) notFound();

  return (
    <div className="max-w-[860px] mx-auto px-5 py-6">
      <article itemScope itemType="https://schema.org/Article">
        <meta itemProp="headline" content={p.title} />
        <meta itemProp="description" content={(p as any).meta_description || p.hero.one_liner} />
        <meta itemProp="dateModified" content={new Date().toISOString().split('T')[0]} />
        <div className="sr-only" itemProp="abstract">
          {p.title}: {p.hero.one_liner}.
          {p.hero.stats?.map((st: any) => `${st.label}: ${st.value}`).join('. ')}.
        </div>
      </article>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://knowledgekendra.com" },
        { name: "Paisa Guide", url: "https://knowledgekendra.com/paisa" },
        { name: p.title, url: `https://knowledgekendra.com/paisa/${slug}` },
      ])} />
      {p.faqs?.length > 0 && <JsonLd data={faqSchema(p.faqs)} />}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Paisa Guide", href: "/paisa" },
          { label: p.title },
        ]}
      />

      <HeroBanner
        title={p.title}
        subtitle={p.hero.one_liner}
        icon={p.hero.icon}
        gradient="linear-gradient(135deg, #D4760A 0%, #A85D08 100%)"
        stats={p.hero.stats}
        updatedDate={p.hero.updated_date}
      />

      {/* Dynamic sections */}
      {p.sections.map((section: any, idx: number) => (
        <div key={idx}>
          <SectionHeading icon={section.icon}>{section.heading}</SectionHeading>

          {section.type === "text" &&
            section.content.map((para: string, i: number) => (
              <p
                key={i}
                className="text-[15px] text-text-secondary leading-[1.75] mb-5"
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}

          {section.type === "steps" && (
            <Card>
              {section.steps.map((step: any) => (
                <StepCard
                  key={step.step}
                  number={step.step}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </Card>
          )}

          {section.type === "info_rows" && (
            <Card>
              {section.rows.map((row: any) => (
                <InfoRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  highlight={row.highlight}
                />
              ))}
            </Card>
          )}

          {section.type === "comparison_table" && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm card overflow-hidden">
                  <thead>
                    <tr className="bg-card-alt">
                      {section.columns.map((col: string) => (
                        <th
                          key={col}
                          className="px-3 py-2.5 text-left font-semibold text-text text-xs border-b border-border"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row: string[]) => (
                      <tr key={row[0]}>
                        {row.map((cell: string, i: number) => (
                          <td
                            key={i}
                            className={`px-3 py-2 border-b border-border ${
                              i === 0
                                ? "text-text-secondary"
                                : "text-text font-medium"
                            }`}
                            dangerouslySetInnerHTML={{ __html: cell }}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {section.footnote && (
                <p className="text-xs text-text-muted mt-1.5">
                  {section.footnote}
                </p>
              )}
            </>
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

      {/* FAQs */}
      <SectionHeading icon="❓">Common Questions</SectionHeading>
      <Card>
        {p.faqs.map((f: any) => (
          <FAQ key={f.question} question={f.question} answer={f.answer} />
        ))}
      </Card>

      {/* Related */}
      <SectionHeading icon="🔗">Related Topics</SectionHeading>
      <div className="flex gap-2.5 overflow-x-auto pb-2">
        {p.related_pages.map((r: any) => (
          <a
            key={r.slug}
            href={r.url || `/paisa/${r.slug}`}
            className="card px-4 py-3.5 min-w-[180px] shrink-0"
          >
            <Tag className="bg-orange-light">{r.tag}</Tag>
            <div className="text-sm font-medium text-text mt-2">
              {r.title}
            </div>
          </a>
        ))}
      </div>

      {/* Disclaimer */}
      {p.disclaimer && (
        <div className="mt-6 p-4 bg-card-alt rounded-xl text-xs text-text-muted leading-relaxed">
          <strong>Disclaimer:</strong> {p.disclaimer}
        
      <AuthorBox updatedDate="March 2026" />
    </div>
      )}
    </div>
  );
}
