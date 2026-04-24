import { AuthorBox } from "@/components/author-box";
import { notFound } from "next/navigation";
import { getExamBySlug, getAllExamSlugs } from "@/lib/content";
import {
  Breadcrumb, HeroBanner, SectionHeading, Card, InfoRow, StepCard, FAQ, Tag,
} from "@/components/ui";
import { ExamTabs } from "@/components/exam-tabs";
import { JsonLd, faqSchema, breadcrumbSchema, articleSchema } from "@/components/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllExamSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exam = getExamBySlug(slug);
  if (!exam) return {};
  const url = `https://knowledgekendra.com/exam/${slug}`;
  return {
    title: `${exam.title} — Pattern, Syllabus, Dates & Salary`,
    description: exam.meta_description,
    alternates: { canonical: url },
    openGraph: {
      title: `${exam.title} — Pattern, Syllabus, Dates & Salary`,
      description: exam.meta_description,
      url,
      type: "article",
      images: [{
        url: `/api/og?title=${encodeURIComponent(exam.title)}&icon=${encodeURIComponent((exam as any).hero?.icon || '📝')}&cat=exam`,
        width: 1200,
        height: 630,
        alt: exam.title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: exam.title,
      description: exam.meta_description,
    },
  };
}

export default async function ExamDetailPage({ params }: Props) {
  const { slug } = await params;
  const e = getExamBySlug(slug) as any;
  if (!e) notFound();

  return (
    <div className="max-w-[860px] mx-auto px-6 py-8">
      <article itemScope itemType="https://schema.org/Article">
        <meta itemProp="headline" content={e.title} />
        <meta itemProp="description" content={e.meta_description || e.hero.one_liner} />
        <meta itemProp="dateModified" content={new Date().toISOString().split('T')[0]} />
        <div className="sr-only" itemProp="abstract">
          {e.title}: {e.hero.one_liner}.
          {e.hero.stats?.map((st: any) => `${st.label}: ${st.value}`).join('. ')}.
          {e.what_is_it?.[0] || ''}
        </div>
      </article>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://knowledgekendra.com" },
        { name: "Exams", url: "https://knowledgekendra.com/exam" },
        { name: e.title, url: `https://knowledgekendra.com/exam/${slug}` },
      ])} />
      {e.faqs?.length > 0 && <JsonLd data={faqSchema(e.faqs)} />}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Exam", href: "/exam" },
          { label: e.title },
        ]}
      />

      <HeroBanner
        title={e.title}
        subtitle={e.hero.one_liner}
        icon={e.hero.icon}
        gradient="linear-gradient(135deg, #1959A8 0%, #0D3B7A 100%)"
        badge={e.hero.status === "upcoming" ? "Registration Open" : "Active"}
        badgeStatus={e.hero.status as any}
        stats={e.hero.stats}
        updatedDate={e.hero.updated_date}
      />

      {/* Exam Prep Tabs — Syllabus, Books, Study Plan, Quiz */}
      <ExamTabs data={{
        syllabus: e.exam_prep?.syllabus,
        books: e.exam_prep?.books,
        study_plan: e.exam_prep?.study_plan,
        quiz: e.exam_prep?.quiz,
      }} />

      <SectionHeading icon="📋">Key Details</SectionHeading>
      <Card>
        {e.key_details.map((d: any) => (
          <InfoRow key={d.label} label={d.label} value={d.value} highlight={d.highlight} />
        ))}
      </Card>

      {/* Exam Pattern */}
      {e.exam_pattern.map((tier: any) => (
        <div key={tier.tier_name}>
          <SectionHeading icon="📝">{tier.tier_name}</SectionHeading>
          <Card className="px-6 py-5">
            {tier.description && (
              <p className="text-[15px] text-text-secondary leading-[1.75] mb-5" dangerouslySetInnerHTML={{ __html: tier.description }} />
            )}
            {tier.subjects.map((sub: any) => (
              <div key={sub.name} className="flex justify-between py-3 border-b border-border text-base">
                <span className="text-text" dangerouslySetInnerHTML={{ __html: sub.name }} />
                <span className="text-text-muted whitespace-nowrap">{sub.questions} Qs · {sub.marks} marks</span>
              </div>
            ))}
            <div className="flex justify-between pt-4 text-lg font-semibold text-accent">
              <span>Total</span>
              <span>{tier.total_questions} Qs · {tier.total_marks} marks · {tier.duration}</span>
            </div>
            <div className="text-base text-orange mt-3">⚠️ Negative marking: {tier.negative_marking}</div>
          </Card>
        </div>
      ))}

      {/* Posts & Salary */}
      {e.major_posts && e.major_posts.length > 0 && (
        <>
          <SectionHeading icon="💰">Posts & Salary</SectionHeading>
          <Card className="px-6 py-5">
            {e.major_posts.map((p: any) => (
              <div key={p.post} className="flex justify-between items-center py-3 border-b border-border text-base">
                <div>
                  <span className="text-text font-medium" dangerouslySetInnerHTML={{ __html: p.post }} />
                  <span className="text-text-muted ml-2 text-sm" dangerouslySetInnerHTML={{ __html: `(${p.department})` }} />
                </div>
                <span className="text-accent font-semibold">{p.in_hand_salary}</span>
              </div>
            ))}
          </Card>
        </>
      )}

      {/* Extra Sections — deep content */}
      {e.extra_sections && e.extra_sections.map((section: any, idx: number) => (
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

      <SectionHeading icon="📅">Important Dates</SectionHeading>
      <Card>
        {e.important_dates.map((d: any) => (
          <InfoRow key={d.label} label={d.label} value={d.value} highlight={d.highlight} />
        ))}
      </Card>

      {/* Preparation Tips */}
      {e.preparation_tips && e.preparation_tips.length > 0 && (
        <>
          <SectionHeading icon="📚">Preparation Strategy</SectionHeading>
          <Card className="px-6 py-5">
            {e.preparation_tips.map((tip: string, i: number) => (
              <div key={i} className={`py-3 text-base text-text-secondary leading-relaxed flex gap-3 ${i < e.preparation_tips.length - 1 ? "border-b border-border" : ""}`}>
                <span className="text-accent font-bold shrink-0">{i + 1}.</span>
                <span dangerouslySetInnerHTML={{ __html: tip }} />
              </div>
            ))}
          </Card>
        </>
      )}

      <SectionHeading icon="❓">Frequently Asked Questions</SectionHeading>
      <Card>
        {e.faqs.map((f: any) => (
          <FAQ key={f.question} question={f.question} answer={f.answer} />
        ))}
      </Card>

      <SectionHeading icon="🔗">Related Exams</SectionHeading>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {e.related_pages.map((r: any) => (
          <a key={r.slug} href={r.url || `/exam/${r.slug}`} className="card px-5 py-4 min-w-[200px] shrink-0 hover:border-accent/30">
            <Tag className="bg-blue-light">{r.tag}</Tag>
            <div className="text-base font-medium text-text mt-2">{r.title}</div>
          </a>
        ))}
      </div>

      <div className="mt-8 p-5 bg-blue-light rounded-xl flex justify-between items-center">
        <div>
          <div className="text-base font-semibold text-blue">{e.official_portal.name}</div>
          <div className="font-mono text-sm text-blue/70">{e.official_portal.url.replace("https://", "")}</div>
        </div>
        <a href={e.official_portal.url} target="_blank" rel="noopener noreferrer" className="text-base text-blue font-medium">Visit →</a>
      
      <AuthorBox updatedDate="March 2026" />
    </div>
    </div>
  );
}
