import { AuthorBox } from "@/components/author-box";
import { HeroV2 } from "@/components/hero-v2";
import { TocSidebarV2 } from "@/components/toc-sidebar-v2";
import { Infographic } from "@/components/infographic";
import { SchemeBlock } from "@/components/scheme-blocks";
import { SaveForLater } from "@/components/save-for-later";
import { SourceCitations } from "@/components/source-citations";
import { TableOfContents } from "@/components/table-of-contents";
import { notFound } from "next/navigation";
import { getPaisaBySlug, getAllPaisaSlugs } from "@/lib/content";
import {
  Breadcrumb, SectionHeading, Card, InfoRow, StepCard, FAQ, Tag,
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
  // Build TOC items
  const tocItems = (p.sections || [])
    .filter((s: any) => s.heading && !["svg_block", "stat_grid", "process_flow", "icon_list", "timeline", "comparison_card", "bar_chart", "number_highlight", "modern_callout", "quick_action_grid", "eligibility_check"].includes(s.type))
    .map((s: any, i: number) => ({
      id: `section-${i}`,
      text: s.heading.replace(/<[^>]+>/g, '').substring(0, 50),
    }));
  if (p.faqs?.length > 0) tocItems.push({ id: "faqs", text: "FAQs" });


  // v2 hero: primary stat = first hero stat; remaining stats render as chips below hero
  const primaryStat = p.hero.stats?.[0]
    ? { label: p.hero.stats[0].label, value: p.hero.stats[0].value }
    : undefined;

  return (
    <div className="theme-v2 py-0">
      <div className="lg:hidden"><TableOfContents items={tocItems} /></div>
      <div className="max-w-[1140px] mx-auto px-5 md:px-6 pt-3 pb-2">
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

      </div>

      {/* Full-width hero band, content constrained inside (preview style) */}
      <div className="hero-band-v2">
        <div className="max-w-[1140px] mx-auto px-5 md:px-6 relative">
          <div className="absolute right-5 md:right-6 top-5 z-10"><SaveForLater slug={slug} title={p.title} url={`/paisa/${slug}`} /></div>
          <HeroV2
        title={p.title}
        subtitle={p.hero.one_liner}
        badge={p.tags?.[0] ? `\u{1F4B0} ${String(p.tags[0]).toUpperCase()}` : "\u{1F4B0} PAISA GUIDE"}
        updatedDate={p.hero.updated_date}
        primaryStat={primaryStat}
        quickActions={[
          { label: "\u{1F9EE} Calculators", href: "/calculator", primary: true },
          { label: "\u2705 Check Eligibility", href: "/check-eligibility" },
        ]}
      />
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-5 md:px-6 pb-6 -mt-16 relative z-10">

      {/* remaining hero stats as chips below the band */}
      {p.hero.stats && p.hero.stats.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-5 mb-2">
          {p.hero.stats.slice(1, 5).map((st: any) => (
            <div key={st.label} className="stat-chip-v2 bg-card border border-border rounded-xl px-4 py-3">
              <div className="text-[10.5px] font-bold text-text-muted uppercase tracking-wide">{st.label}</div>
              <div className="text-[14px] font-extrabold text-text mt-0.5">{st.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10 lg:items-start mt-6">
      <TocSidebarV2 items={tocItems} />
      <div className="min-w-0">

      {/* Dynamic sections */}
      {p.sections.map((section: any, idx: number) => {
        const sectionId = section.heading && !["svg_block", "stat_grid", "process_flow", "icon_list", "timeline", "comparison_card", "bar_chart", "number_highlight", "modern_callout", "quick_action_grid", "eligibility_check"].includes(section.type)
          ? `section-${p.sections.filter((s: any, i: number) => i < idx && s.heading && !["svg_block", "stat_grid", "process_flow", "icon_list", "timeline", "comparison_card", "bar_chart", "number_highlight", "modern_callout", "quick_action_grid", "eligibility_check"].includes(s.type)).length}`
          : undefined;
        return (
        <div key={idx} id={sectionId}>
          {!["svg_block","stat_grid","process_flow","icon_list","timeline","comparison_card","bar_chart","number_highlight","modern_callout","quick_action_grid","eligibility_check","image"].includes(section.type) && <SectionHeading icon={section.icon}>{section.heading}</SectionHeading>}

          {section.type === "text" &&
            section.content.map((para: string, i: number) => (
              <p
                key={i}
                className="text-base text-text-secondary leading-[1.75] mb-5"
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

          <SchemeBlock section={section} />
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

          {section.type === "image" && (
            <figure className="my-6">
              {section.heading && (
                <SectionHeading icon={section.icon || "📸"}>{section.heading}</SectionHeading>
              )}
              <div className="rounded-2xl border border-border overflow-hidden bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={section.src}
                  alt={section.alt || ""}
                  width={section.width}
                  height={section.height}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              {(section.caption || section.source) && (
                <figcaption className="text-xs text-text-muted mt-2">
                  {section.caption}
                  {section.source && (
                    <span className="italic"> Source: {section.source}</span>
                  )}
                </figcaption>
              )}
            </figure>
          )}

        </div>
      );})}

      {/* Infographic (bottom, with share buttons) */}
      {(() => {
        const infographicMap: Record<string, { src: string; alt: string; width: number; height: number }> = {
          "demat-account-guide": { src: "/infographics/demat-account-guide.jpg", alt: "Demat account 2026 complete guide infographic: zero opening fee, AMC, account types, charges, BSDA slabs, top 10 brokers compared, T+1 settlement, taxes", width: 2244, height: 16000 }
        };
        const info = infographicMap[slug];
        if (!info) return null;
        return <Infographic src={info.src} alt={info.alt} pageUrl={`/paisa/${slug}`} pageTitle={p.title} width={info.width} height={info.height} />;
      })()}

      {/* FAQs */}
      <div id="faqs">
        <SectionHeading icon="❓">Common Questions</SectionHeading>
      </div>
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
        </div>
      )}
      <SourceCitations />
      <AuthorBox updatedDate={p.last_reviewed || p.hero.updated_date || "May 2026"} />

      </div>
      </div>
      </div>
    </div>
  );
}
