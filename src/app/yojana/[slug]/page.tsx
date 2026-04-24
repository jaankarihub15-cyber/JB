import { AuthorBox } from "@/components/author-box";
import { notFound } from "next/navigation";
import { getSchemeBySlug, getAllSchemeSlugs } from "@/lib/content";
import {
  Breadcrumb, HeroBanner, SectionHeading, Card, InfoRow, StepCard, FAQ, AlertBox, Tag,
} from "@/components/ui";
import { JsonLd, faqSchema, breadcrumbSchema, governmentServiceSchema } from "@/components/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSchemeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const scheme = getSchemeBySlug(slug);
  if (!scheme) return {};
  const url = `https://knowledgekendra.com/yojana/${slug}`;
  return {
    title: `${scheme.title} — Eligibility, Benefits & How to Apply`,
    description: scheme.meta_description,
    alternates: { canonical: url },
    openGraph: {
      title: `${scheme.title} — Eligibility, Benefits & How to Apply`,
      description: scheme.meta_description,
      url,
      type: "article",
      images: [{
        url: `/api/og?title=${encodeURIComponent(scheme.title)}&icon=${encodeURIComponent((scheme as any).hero?.icon || '📋')}&cat=yojana`,
        width: 1200,
        height: 630,
        alt: scheme.title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: scheme.title,
      description: scheme.meta_description,
    },
  };
}

export default async function SchemeDetailPage({ params }: Props) {
  const { slug } = await params;
  const s = getSchemeBySlug(slug) as any;
  if (!s) notFound();

  return (
    <div className="max-w-[860px] mx-auto px-6 py-8">
      {/* LLM-friendly structured summary — visible to crawlers, sr-only for screen readers */}
      <article itemScope itemType="https://schema.org/Article">
        <meta itemProp="headline" content={s.title} />
        <meta itemProp="description" content={s.meta_description || s.hero.one_liner} />
        <meta itemProp="dateModified" content={new Date().toISOString().split('T')[0]} />
        <div className="sr-only" itemProp="abstract">
          {s.title}: {s.hero.one_liner}. 
          {s.hero.stats?.map((st: any) => `${st.label}: ${st.value}`).join('. ')}.
          {s.what_is_it?.[0] || ''}
        </div>
      </article>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://knowledgekendra.com" },
        { name: "Yojana", url: "https://knowledgekendra.com/yojana" },
        { name: s.title, url: `https://knowledgekendra.com/yojana/${slug}` },
      ])} />
      {s.faqs?.length > 0 && <JsonLd data={faqSchema(s.faqs)} />}
      <JsonLd data={governmentServiceSchema({
        name: s.title,
        description: s.meta_description || s.hero.one_liner,
        url: `https://knowledgekendra.com/yojana/${slug}`,
        provider: s.ministry || "Government of India",
        serviceType: "Government Scheme",
      })} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Yojana", href: "/yojana" },
          { label: s.title },
        ]}
      />

      <HeroBanner
        title={s.title}
        subtitle={s.hero.one_liner}
        icon={s.hero.icon}
        gradient="linear-gradient(135deg, #1B6B4A 0%, #145236 100%)"
        badge="Active Scheme"
        badgeStatus={s.hero.status as any}
        stats={s.hero.stats}
        updatedDate={s.hero.updated_date}
      />

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {s.quick_actions.map((a: any) => (
          <a
            key={a.label}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card text-sm font-medium text-text hover:border-accent/40 transition-colors"
          >
            <span>{a.icon}</span>
            {a.label}
          </a>
        ))}
      </div>

      {/* What is it */}
      <SectionHeading icon="📖">What is {s.title}?</SectionHeading>
      {s.what_is_it.map((p: string, i: number) => (
        <p key={i} className="text-[15px] text-text-secondary leading-[1.75] mb-5" dangerouslySetInnerHTML={{ __html: p }} />
      ))}

      {/* Eligibility */}
      <SectionHeading icon="✅">Eligibility</SectionHeading>
      <Card>
        {s.eligibility.map((e: any) => (
          <InfoRow key={e.label} label={e.label} value={e.value} highlight={e.highlight} />
        ))}
      </Card>

      {/* Extra Sections — renders deep content dynamically */}
      {s.extra_sections && s.extra_sections.map((section: any, idx: number) => (
        <div key={idx}>
          <SectionHeading icon={section.icon}>{section.heading}</SectionHeading>

          {section.type === "text" && section.content.map((para: string, i: number) => (
            <p key={i} className="text-[15px] text-text-secondary leading-[1.75] mb-5" dangerouslySetInnerHTML={{ __html: para }} />
          ))}

          {section.type === "steps" && (
            <Card>
              {section.steps.map((step: any) => (
                <StepCard key={step.step} number={step.step} title={step.title} description={step.description} />
              ))}
            </Card>
          )}

          {section.type === "table" && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse card overflow-hidden text-sm">
                <thead>
                  <tr className="bg-card-alt">
                    {section.columns.map((col: string) => (
                      <th key={col} className="px-4 py-3 text-left font-semibold text-text border-b border-border">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row: string[], ri: number) => (
                    <tr key={ri}>
                      {row.map((cell: string, ci: number) => (
                        <td key={ci} className={`px-4 py-3 border-b border-border ${ci === 0 ? "font-medium text-text" : "text-text-secondary"}`} dangerouslySetInnerHTML={{ __html: cell }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {section.type === "info_rows" && (
            <Card>
              {section.rows.map((row: any) => (
                <InfoRow key={row.label} label={row.label} value={row.value} highlight={row.highlight} />
              ))}
            </Card>
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

      {/* How to Apply */}
      <SectionHeading icon="📝">How to Apply</SectionHeading>
      <Card>
        {s.how_to_apply.map((step: any) => (
          <StepCard key={step.step} number={step.step} title={step.title} description={step.description} />
        ))}
      </Card>

      {/* Alert */}
      {s.important_alert && (
        <AlertBox text={s.important_alert.text} type={s.important_alert.type as any} />
      )}

      {/* Important Dates */}
      <SectionHeading icon="📅">Important Dates & Schedule</SectionHeading>
      <Card>
        {s.important_dates.map((d: any) => (
          <InfoRow key={d.label} label={d.label} value={d.value} highlight={d.highlight} />
        ))}
      </Card>

      {/* FAQs */}
      <SectionHeading icon="❓">Frequently Asked Questions</SectionHeading>
      <Card>
        {s.faqs.map((f: any) => (
          <FAQ key={f.question} question={f.question} answer={f.answer} />
        ))}
      </Card>

      {/* Related */}
      <SectionHeading icon="🔗">Related Schemes</SectionHeading>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {s.related_pages.map((r: any) => (
          <a key={r.slug} href={r.url || `/yojana/${r.slug}`} className="card px-5 py-4 min-w-[200px] shrink-0 hover:border-accent/30 transition-colors">
            <Tag>{r.tag}</Tag>
            <div className="text-base font-medium text-text mt-2">{r.title}</div>
          </a>
        ))}
      </div>

      {/* Official Portal */}
      <div className="mt-8 p-5 bg-blue-light rounded-xl flex justify-between items-center">
        <div>
          <div className="text-base font-semibold text-blue">{s.official_portal.name}</div>
          <div className="font-mono text-sm text-blue/70">{s.official_portal.url.replace("https://", "")}</div>
        </div>
        <a href={s.official_portal.url} target="_blank" rel="noopener noreferrer" className="text-base text-blue font-medium">Visit →</a>
      
      <AuthorBox updatedDate="March 2026" />
    </div>
    </div>
  );
}
