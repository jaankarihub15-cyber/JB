import { AuthorBox } from "@/components/author-box";
import { HeroV2 } from "@/components/hero-v2";
import { TocSidebarV2 } from "@/components/toc-sidebar-v2";
import { SchemeBlock } from "@/components/scheme-blocks";
import { Infographic } from "@/components/infographic";
import { SaveForLater } from "@/components/save-for-later";
import { SourceCitations } from "@/components/source-citations";
import { PdfSummary } from "@/components/pdf-summary";
import { EligibilityCTA } from "@/components/eligibility-cta";
import { ResizerCTA } from "@/components/resizer-cta";
import { Fragment } from "react";
import { TableOfContents } from "@/components/table-of-contents";
import { notFound } from "next/navigation";
import { getGuideBySlug, getAllGuideSlugs } from "@/lib/content";
import {
  SectionHeading, Card, InfoRow, StepCard, FAQ, Tag,
} from "@/components/ui";
import { JsonLd, faqSchema, breadcrumbSchema, articleSchema, howToSchema } from "@/components/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  const url = `https://knowledgekendra.com/guide/${slug}`;
  return {
    title: guide.title,
    description: guide.meta_description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.meta_description,
      url,
      type: "article",
      images: [{
        url: `/api/og?title=${encodeURIComponent(guide.title)}&icon=${encodeURIComponent(guide.hero?.icon || '📝')}&cat=yojana`,
        width: 1200,
        height: 630,
        alt: guide.title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.meta_description,
    },
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const g = getGuideBySlug(slug);
  if (!g) notFound();

  // Build TOC items from section headings
  const tocItems = g.sections
    .filter((s: any) => s.heading && !["svg_block", "stat_grid", "process_flow", "icon_list", "timeline", "comparison_card", "bar_chart", "number_highlight", "modern_callout", "quick_action_grid", "eligibility_check"].includes(s.type))
    .map((s: any, i: number) => ({
      id: `section-${i}`,
      text: s.heading.replace(/<[^>]+>/g, '').substring(0, 50),
    }));
  if (g.faqs?.length > 0) tocItems.push({ id: "faqs", text: "FAQs" });

  // Build HowTo steps from text sections with step-like headings or steps sections
  const howToSteps = g.sections
    .filter((s: any) => s.type === "steps" || (s.type === "text" && /step|process|how to|procedure/i.test(s.heading || '')))
    .flatMap((s: any) => {
      if (s.type === "steps") {
        return s.steps.map((step: any) => ({ name: step.title, text: step.description }));
      }
      return [{ name: s.heading, text: Array.isArray(s.content) ? s.content.join(' ').substring(0, 200) : String(s.content || '').substring(0, 200) }];
    });

  const primaryStat = g.hero.stats?.[0]
    ? { label: g.hero.stats[0].label, value: g.hero.stats[0].value }
    : undefined;

  return (
    <div className="theme-v2 py-0">
      <div className="lg:hidden"><TableOfContents items={tocItems} /></div>
      <div className="max-w-[1140px] mx-auto px-5 md:px-6">
      <article itemScope itemType="https://schema.org/HowTo">
        <meta itemProp="name" content={g.title} />
        <meta itemProp="description" content={(g as any).meta_description || g.hero.one_liner} />
      </article>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://knowledgekendra.com" },
        { name: "How-To Guides", url: "https://knowledgekendra.com/guide" },
        { name: g.title, url: `https://knowledgekendra.com/guide/${slug}` },
      ])} />
      {g.faqs?.length > 0 && <JsonLd data={faqSchema(g.faqs)} />}
      {howToSteps.length > 0 && <JsonLd data={howToSchema({
        name: g.title,
        description: (g as any).meta_description || g.hero.one_liner,
        steps: howToSteps,
      })} />}
      </div>

      {/* Full-width hero band, content constrained inside */}
      <div className="hero-band-v2">
        <div className="max-w-[1140px] mx-auto px-5 md:px-6 relative">
          <div className="pt-6 pr-24 sm:pr-28 text-[12.5px] font-semibold text-[#8FB8A2]">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="mx-1.5 opacity-60">/</span>
            <a href="/guide" className="hover:text-white transition-colors">Guides</a>
            <span className="mx-1.5 opacity-60">/</span>
            <b className="text-[#DFF3E8]">{g.title.length > 60 ? g.title.slice(0, 57) + "..." : g.title}</b>
          </div>
          <div className="absolute right-5 md:right-6 top-5 z-10"><SaveForLater slug={slug} title={g.title} url={`/guide/${slug}`} onDark /></div>
          <HeroV2
            title={g.title}
            subtitle={g.hero.one_liner}
            badge={g.tags?.[0] ? `\u{1F4D8} ${String(g.tags[0]).toUpperCase()}` : "\u{1F4D8} HOW-TO GUIDE"}
            updatedDate={g.hero.updated_date}
            primaryStat={primaryStat}
            quickActions={
              (g as any).quick_actions?.length
                ? (g as any).quick_actions.map((qa: any) => ({ label: qa.label, href: qa.href || qa.url, primary: qa.primary }))
                : [
                    { label: "\u2702\uFE0F Resize Photo", href: "/tools/photo-resizer", primary: true },
                    { label: "\u{1F4D6} All Guides", href: "/guide" },
                  ]
            }
          />
          {g.hero.stats && g.hero.stats.length > 1 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-2 pb-1">
              {g.hero.stats.slice(1, 5).map((st: any) => (
                <div key={st.label} className="stat-chip-v2 bg-card border border-border rounded-xl px-4 py-3">
                  <div className="text-[10.5px] font-bold text-text-muted uppercase tracking-wide">{st.label}</div>
                  <div className="text-[14px] font-extrabold text-text mt-0.5">{st.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-5 md:px-6 pb-6 relative z-10">
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)_180px] lg:gap-10 lg:items-start mt-8">
      <TocSidebarV2 items={tocItems} />
      <div className="min-w-0">

      {/* Dynamic sections */}
      {g.sections.map((section: any, idx: number) => {
        const sectionId = section.heading && !["svg_block", "stat_grid", "process_flow", "icon_list", "timeline", "comparison_card", "bar_chart", "number_highlight", "modern_callout", "quick_action_grid", "eligibility_check"].includes(section.type) ? `section-${g.sections.filter((s: any, i: number) => i < idx && s.heading && !["svg_block", "stat_grid", "process_flow", "icon_list", "timeline", "comparison_card", "bar_chart", "number_highlight", "modern_callout", "quick_action_grid", "eligibility_check"].includes(s.type)).length}` : undefined;
        return (
        <Fragment key={idx}>
        <div id={sectionId}>
          {section.heading && !["svg_block", "stat_grid", "process_flow", "icon_list", "timeline", "comparison_card", "bar_chart", "number_highlight", "modern_callout", "quick_action_grid", "eligibility_check"].includes(section.type) && <SectionHeading icon={section.icon}>{section.heading}</SectionHeading>}

          {section.type === "text" &&
            section.content.map((para: string, i: number) => (
              <p
                key={i}
                className="text-base text-text-secondary leading-[1.75] mb-5"
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}

          {section.type === "steps" && (
            <div className="flex flex-col gap-2">
              {section.steps.map((step: any) => (
                <StepCard key={step.step} number={step.step} title={step.title} description={step.description} />
              ))}
            </div>
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

          {section.type === "table" && (
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-card-alt">
                    {section.columns.map((col: string) => (
                      <th
                        key={col}
                        className="px-4 py-2.5 text-left font-semibold text-text border-b border-border"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row: string[], ri: number) => (
                    <tr key={ri} className="border-b border-border last:border-b-0">
                      {row.map((cell: string, ci: number) => (
                        <td
                          key={ci}
                          className={`px-4 py-2.5 text-text-secondary ${ci === 0 ? "font-medium text-text" : ""}`}
                         dangerouslySetInnerHTML={{ __html: cell }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
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
              <div className="rounded-2xl overflow-hidden border border-border bg-card-alt">
                <img
                  src={section.src}
                  alt={section.alt}
                  width={section.width}
                  height={section.height}
                  loading="lazy"
                  className="w-full h-auto block"
                  style={{ maxWidth: section.width ? `${section.width}px` : undefined, margin: '0 auto' }}
                />
              </div>
              {(section.caption || section.source) && (
                <figcaption className="mt-2 text-xs text-text-muted text-center">
                  {section.caption}
                  {section.caption && section.source && ' '}
                  {section.source && (
                    <span className="italic">Source: {section.source}</span>
                  )}
                </figcaption>
              )}
            </figure>
          )}
        </div>
        {idx === 0 && <ResizerCTA />}
        </Fragment>
      );})}

      {/* Infographic */}
      {(() => {
        const infographicMap: Record<string, { src: string; alt: string; width: number; height: number }> = {
    "apply-obc-certificate": { src: "/infographics/apply-obc-certificate.png", alt: "OBC Certificate vs OBC-NCL: how to apply guide infographic", width: 3240, height: 4860 },
    "check-epf-balance": { src: "/infographics/check-epf-balance.png", alt: "How to check EPF/PF balance in 30 seconds: 4 methods guide infographic", width: 909, height: 3995 },
    "age-relaxation": { src: "/infographics/age-relaxation.png", alt: "Age relaxation rules: SC/ST +5, OBC +3, PwD +10 years in government jobs infographic", width: 1355, height: 8000 },
    "apply-ews-certificate": { src: "/infographics/apply-ews-certificate.png", alt: "EWS Certificate 2026 complete guide: 10% reservation, Rs 8 lakh income limit, eligibility, property limits, step-by-step application, documents, EWS vs OBC infographic", width: 1200, height: 7070 },
    "aadhaar-update": { src: "/infographics/aadhaar-update.jpg", alt: "Aadhaar Update 2026 complete guide: free online document update till June 2027, Rs 75 demographic, Rs 125 biometric, online vs centre, documents, children MBU, security features infographic", width: 2380, height: 16000 }
  };
        const info = infographicMap[slug];
        if (!info) return null;
        return <Infographic src={info.src} alt={info.alt} pageUrl={`/guide/${slug}`} pageTitle={g.title} width={info.width} height={info.height} />;
      })()}

      {/* mid-page-related */}
      {g.related_pages?.length > 0 && (
        <div className="my-6 p-4 bg-accent-light/50 rounded-xl border border-accent/10">
          <p className="text-sm font-bold text-accent mb-2">📌 You might also need</p>
          <div className="flex flex-wrap gap-2">
            {g.related_pages.slice(0, 3).map((r: any) => (
              <a key={r.slug || r.title} href={r.url || `/guide/${r.slug}`} className="text-sm px-3 py-1.5 rounded-lg bg-white border border-border hover:border-accent/40 text-text-secondary transition-colors">
                {r.title} →
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Eligibility CTA */}
      <EligibilityCTA />

      {g.faqs?.length > 0 && (
        <div id="faqs">
          <SectionHeading icon="❓">Frequently Asked Questions</SectionHeading>
          {g.faqs.map((f: any) => (
            <FAQ key={f.question} question={f.question} answer={f.answer} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      {g.disclaimer && (
        <div className="mt-8 p-4 bg-card-alt rounded-xl text-sm text-text-muted leading-relaxed">
          {g.disclaimer}
        </div>
      )}

      {/* Related Pages */}
      {g.related_pages?.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {g.related_pages.map((r: any) => (
            <a
              key={r.slug}
              href={r.url || (r.slug.startsWith("http") ? r.slug : `/guide/${r.slug}`)}
              className="px-4 py-2 rounded-lg text-sm bg-card border border-border hover:border-accent/40 text-text-secondary transition-colors"
            >
              {r.title} →
            </a>
          ))}
        </div>
      )}

      <div className="mt-8 border-t border-border pt-6">
        <PdfSummary title={g.title} stats={g.hero?.stats} faqs={g.faqs} />
        <SourceCitations />
      </div>
      <AuthorBox updatedDate={g.last_reviewed || g.hero.updated_date || "May 2026"} />

      </div>
      {/* Reserved right rail for future second sidebar */}
      <aside className="hidden lg:block" aria-hidden="true"></aside>
      </div>
      </div>
    </div>
  );
}
