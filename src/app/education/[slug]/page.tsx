import { AuthorBox } from "@/components/author-box";
import { SchemeBlock } from "@/components/scheme-blocks";
import { SaveForLater } from "@/components/save-for-later";
import { SourceCitations } from "@/components/source-citations";
import { TableOfContents } from "@/components/table-of-contents";
import { EligibilityCTA } from "@/components/eligibility-cta";
import { notFound } from "next/navigation";
import { getEducationBySlug, getAllEducationSlugs } from "@/lib/content";
import {
  Breadcrumb, HeroBanner, SectionHeading, Card, InfoRow, StepCard, FAQ, Tag,
} from "@/components/ui";
import { JsonLd, faqSchema, breadcrumbSchema, articleSchema } from "@/components/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllEducationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getEducationBySlug(slug);
  if (!item) return {};
  const url = `https://knowledgekendra.com/education/${slug}`;
  return {
    title: `${item.title} — Education Guide`,
    description: item.meta_description,
    alternates: { canonical: url },
    openGraph: {
      title: `${item.title} — Education Guide`,
      description: item.meta_description,
      url,
      type: "article",
      images: [{
        url: `/api/og?title=${encodeURIComponent(item.title)}&icon=${encodeURIComponent(item.hero?.icon || '🎓')}&cat=education`,
        width: 1200, height: 630, alt: item.title,
      }],
    },
    twitter: { card: "summary_large_image", title: item.title, description: item.meta_description },
  };
}

export default async function EducationDetailPage({ params }: Props) {
  const { slug } = await params;
  const g = getEducationBySlug(slug) as any;
  if (!g) notFound();
  // Build TOC items
  const tocItems = (g.sections || [])
    .filter((s: any) => s.heading && !["svg_block", "stat_grid", "process_flow", "icon_list", "timeline", "comparison_card", "bar_chart", "number_highlight", "modern_callout", "quick_action_grid", "eligibility_check"].includes(s.type))
    .map((s: any, i: number) => ({
      id: `section-${i}`,
      text: s.heading.replace(/<[^>]+>/g, '').substring(0, 50),
    }));
  if (g.faqs?.length > 0) tocItems.push({ id: "faqs", text: "FAQs" });


  return (
    <div className="max-w-[860px] mx-auto px-5 py-6">
      <TableOfContents items={tocItems} />
      <article itemScope itemType="https://schema.org/Article">
        <meta itemProp="headline" content={g.title} />
        <meta itemProp="description" content={g.meta_description || g.hero.one_liner} />
        <meta itemProp="dateModified" content={new Date().toISOString().split('T')[0]} />
      </article>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://knowledgekendra.com" },
        { name: "Education", url: "https://knowledgekendra.com/education" },
        { name: g.title, url: `https://knowledgekendra.com/education/${slug}` },
      ])} />
      {g.faqs?.length > 0 && <JsonLd data={faqSchema(g.faqs)} />}
      <JsonLd data={articleSchema({
        title: g.title,
        description: g.meta_description || g.hero.one_liner,
        url: `https://knowledgekendra.com/education/${slug}`,
        dateModified: new Date().toISOString().split('T')[0],
        breadcrumbs: [
          { name: "Home", url: "https://knowledgekendra.com" },
          { name: "Education", url: "https://knowledgekendra.com/education" },
          { name: g.title, url: `https://knowledgekendra.com/education/${slug}` },
        ],
      })} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Education", href: "/education" },
          { label: g.title },
        ]}
      />

      <div className="flex justify-end mb-2"><SaveForLater slug={slug} title={g.title} url={`/education/${slug}`} /></div>
      <HeroBanner
        title={g.title}
        subtitle={g.hero.one_liner}
        icon={g.hero.icon}
        gradient="linear-gradient(135deg, #92400E 0%, #78350F 100%)"
        stats={g.hero.stats}
        updatedDate={g.hero.updated_date}
      />

      {g.sections.map((section: any, idx: number) => {
        const sectionId = section.heading && !["svg_block", "stat_grid", "process_flow", "icon_list", "timeline", "comparison_card", "bar_chart", "number_highlight", "modern_callout", "quick_action_grid", "eligibility_check"].includes(section.type)
          ? `section-${g.sections.filter((s: any, i: number) => i < idx && s.heading && !["svg_block", "stat_grid", "process_flow", "icon_list", "timeline", "comparison_card", "bar_chart", "number_highlight", "modern_callout", "quick_action_grid", "eligibility_check"].includes(s.type)).length}`
          : undefined;
        return (
        <div key={idx} id={sectionId}>
          {section.heading && !["svg_block", "stat_grid", "process_flow", "icon_list", "timeline", "comparison_card", "bar_chart", "number_highlight", "modern_callout", "quick_action_grid", "eligibility_check"].includes(section.type) && <SectionHeading icon={section.icon}>{section.heading}</SectionHeading>}

          {section.type === "text" &&
            section.content.map((para: string, i: number) => (
              <p key={i} className="text-base text-text-secondary leading-[1.75] mb-5" dangerouslySetInnerHTML={{ __html: para }} />
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
                <InfoRow key={row.label} label={row.label} value={row.value} highlight={row.highlight} />
              ))}
            </Card>
          )}

          {section.type === "table" && (
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
                <thead><tr className="bg-card-alt">
                  {section.columns.map((col: string) => (
                    <th key={col} className="px-4 py-2.5 text-left font-semibold text-text border-b border-border">{col}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {section.rows.map((row: string[], ri: number) => (
                    <tr key={ri} className="border-b border-border last:border-b-0">
                      {row.map((cell: string, ci: number) => (
                        <td key={ci} className={`px-4 py-2.5 text-text-secondary ${ci === 0 ? "font-medium text-text" : ""}`} dangerouslySetInnerHTML={{ __html: cell }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {section.type === "svg_block" && (
            <div className="my-6">
              {section.caption && <p className="text-xs text-text-muted mb-2 text-center italic">{section.caption}</p>}
              <div className="card p-4 flex justify-center overflow-x-auto" dangerouslySetInnerHTML={{ __html: section.svg }} />
              {section.description && <p className="text-sm text-text-secondary mt-3" dangerouslySetInnerHTML={{ __html: section.description }} />}
            </div>
          )}

          {section.type === "callout" && (
            <div className="my-5 rounded-r-lg p-4" style={{
              borderLeft: `4px solid ${section.variant === "warning" ? "#DC2626" : section.variant === "tip" ? "#EA580C" : section.variant === "info" ? "#2563EB" : "#1B6B4A"}`,
              backgroundColor: section.variant === "warning" ? "#FEE2E2" : section.variant === "tip" ? "#FFF7ED" : section.variant === "info" ? "#DBEAFE" : "#DCFCE7"
            }}>
              {section.heading && (
                <p className="text-sm font-bold mb-1.5 text-text flex items-center gap-2">
                  <span>{section.icon || "💡"}</span><span>{section.heading}</span>
                </p>
              )}
              <p className="text-sm text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          )}

          <SchemeBlock section={section} />
          {section.type === "pullquote" && (
            <blockquote className="my-6 border-l-4 border-accent pl-5 py-2">
              <p className="text-lg font-semibold text-text leading-snug italic" dangerouslySetInnerHTML={{ __html: section.text }} />
              {section.attribution && <footer className="text-xs text-text-muted mt-2 not-italic">— {section.attribution}</footer>}
            </blockquote>
          )}
        </div>
      );})}

      {/* Eligibility CTA */}
      <EligibilityCTA />

      {g.faqs?.length > 0 && (
        <>
          <div id="faqs"><SectionHeading icon="❓">Frequently Asked Questions</SectionHeading></div>
          {g.faqs.map((f: any) => <FAQ key={f.question} question={f.question} answer={f.answer} />)}
        </>
      )}

      {g.related_pages?.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {g.related_pages.map((r: any) => (
            <a key={r.slug} href={`/education/${r.slug}`} className="px-4 py-2 rounded-lg text-sm bg-card border border-border hover:border-accent/40 text-text-secondary transition-colors">{r.title} →</a>
          ))}
        </div>
      )}

      {g.disclaimer && (
        <div className="mt-8 p-4 bg-card-alt rounded-xl text-sm text-text-muted leading-relaxed">{g.disclaimer}</div>
      )}
      <SourceCitations />
      <AuthorBox updatedDate={g.last_reviewed || g.hero.updated_date || "May 2026"} />
    </div>
  );
}
