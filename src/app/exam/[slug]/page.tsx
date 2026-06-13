import { AuthorBox } from "@/components/author-box";
import { ResizerCTA } from "@/components/resizer-cta";
import { Fragment } from "react";
import { SchemeBlock } from "@/components/scheme-blocks";
import { SaveForLater } from "@/components/save-for-later";
import { SourceCitations } from "@/components/source-citations";
import { PdfSummary } from "@/components/pdf-summary";
import {
  StatusPill, ExamStickyNav, AnswerRouter, FactTiles, SalaryLead,
} from "@/components/exam-answer-layer";
import { notFound } from "next/navigation";
import { getExamBySlug, getAllExamSlugs } from "@/lib/content";
import {
  SectionHeading, Card, InfoRow, StepCard, FAQ, Tag,
} from "@/components/ui";
import { ExamTabs } from "@/components/exam-tabs";
import { JsonLd, faqSchema, breadcrumbSchema } from "@/components/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllExamSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exam = getExamBySlug(slug) as any;
  if (!exam) return {};
  const url = `https://knowledgekendra.com/exam/${slug}`;
  return {
    title: `${exam.title} — Pattern, Syllabus, Dates & Salary`,
    description: exam.meta_description,
    alternates: { canonical: url },
    openGraph: {
      title: `${exam.title} — Pattern, Syllabus, Dates & Salary`,
      description: exam.meta_description,
      url, type: "article",
      images: [{ url: `/api/og?title=${encodeURIComponent(exam.title)}&icon=${encodeURIComponent(exam.hero?.icon || '📝')}&cat=exam`, width: 1200, height: 630, alt: exam.title }],
    },
    twitter: { card: "summary_large_image", title: exam.title, description: exam.meta_description },
  };
}

export default async function ExamDetailPage({ params }: Props) {
  const { slug } = await params;
  const e = getExamBySlug(slug) as any;
  if (!e) notFound();

  const hasSalary = (e.salary_table?.rows?.length > 0) || (e.major_posts?.length > 0);
  const hasSyllabus = (e.exam_pattern?.length > 0) || (e.exam_prep?.syllabus?.length > 0);
  const navItems: { id: string; label: string }[] = [
    { id: "overview", label: "Overview" },
    ...(hasSalary ? [{ id: "salary", label: "Salary" }] : []),
    ...(hasSyllabus ? [{ id: "syllabus", label: "Syllabus" }] : []),
    ...(e.key_details?.length > 0 ? [{ id: "eligibility", label: "Eligibility" }] : []),
    ...(e.important_dates?.length > 0 ? [{ id: "dates", label: "Dates" }] : []),
    ...(e.faqs?.length > 0 ? [{ id: "faqs", label: "FAQs" }] : []),
  ];

  return (
    <div className="theme-v2 py-0">
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://knowledgekendra.com" },
        { name: "Exams", url: "https://knowledgekendra.com/exam" },
        { name: e.title, url: `https://knowledgekendra.com/exam/${slug}` },
      ])} />
      {e.faqs?.length > 0 && <JsonLd data={faqSchema(e.faqs)} />}

      <article itemScope itemType="https://schema.org/Article" className="sr-only">
        <meta itemProp="headline" content={e.title} />
        <meta itemProp="description" content={e.meta_description || e.hero?.one_liner} />
        <meta itemProp="dateModified" content={new Date().toISOString().split('T')[0]} />
      </article>

      {/* V2 HERO BAND */}
      <div className="hero-band-v2">
        <div className="max-w-[1040px] mx-auto px-5 md:px-6 pt-6 pb-16">
          <div className="text-[12px] font-semibold text-[#8FB8A2]">
            <a href="/" className="hover:text-white transition-colors no-underline text-[#8FB8A2]">Home</a>
            <span className="mx-1.5 opacity-60">/</span>
            <a href="/exam" className="hover:text-white transition-colors no-underline text-[#8FB8A2]">Exam</a>
            <span className="mx-1.5 opacity-60">/</span>
            <b className="text-[#DFF3E8]">{e.title.split(":")[0]}</b>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-[11px] font-semibold tracking-wide text-[#8FB8A2] uppercase">{e.category || "Government Exam"}</span>
            <StatusPill status={e.status} />
            {e.hero?.updated_date && (
              <span className="text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-[#E8A33D] text-[#3D2A07] uppercase">Updated {e.hero.updated_date}</span>
            )}
          </div>
          <h1 className="text-[26px] md:text-[33px] font-extrabold leading-[1.2] tracking-[-0.5px] text-white mt-3.5 mb-2.5">{e.title}</h1>
          <p className="hero-sub text-[14.5px] leading-relaxed max-w-[600px] mb-5">{e.hero?.one_liner || e.meta_description}</p>
          <div className="flex items-center gap-3">
            <img src="/authors/ash-k.jpg" alt="Ash K." width={32} height={32} className="w-8 h-8 rounded-full object-cover border border-white/20" />
            <div className="text-[12.5px] leading-tight">
              <b className="text-white">Ash K.</b><br />
              <span className="text-[#8FB8A2]">{e.hero?.updated_date ? `Updated ${e.hero.updated_date}` : "Government exam guide"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHITE CONTENT, overlapping up into the band */}
      <div className="max-w-[1040px] mx-auto px-5 md:px-6 -mt-9 relative">
        <div className="bg-white rounded-[18px] border border-border shadow-[0_10px_28px_rgba(20,45,33,0.10)] overflow-hidden">
          <ExamStickyNav items={navItems} />
          <div className="px-5 md:px-6 pb-6">
            <div className="flex justify-end pt-3">
              <SaveForLater slug={slug} title={e.title} url={`/exam/${slug}`} />
            </div>

            <AnswerRouter items={e.answer_router} />
            <FactTiles facts={e.quick_facts} />
            <SalaryLead salary={e.salary_table} posts={e.major_posts} />
          </div>
        </div>

        {/* BODY */}
        <div className="mt-6">
          <ExamTabs data={{
            syllabus: e.exam_prep?.syllabus, books: e.exam_prep?.books,
            study_plan: e.exam_prep?.study_plan, quiz: e.exam_prep?.quiz,
          }} />

          {e.key_details && e.key_details.length > 0 && (
            <div id="overview">
              <SectionHeading icon="📋">Key Details</SectionHeading>
              <Card>{e.key_details.map((d: any) => (<InfoRow key={d.label} label={d.label} value={d.value} highlight={d.highlight} />))}</Card>
            </div>
          )}

          {e.exam_pattern && e.exam_pattern.length > 0 && e.exam_pattern.map((tier: any, ti: number) => (
            <div key={tier.tier_name} id={ti === 0 ? "syllabus" : undefined}>
              <SectionHeading icon="📝">{tier.tier_name}</SectionHeading>
              <Card className="px-6 py-5">
                {tier.description && (<p className="text-base text-text-secondary leading-[1.75] mb-5" dangerouslySetInnerHTML={{ __html: tier.description }} />)}
                {tier.subjects.map((sub: any) => (
                  <div key={sub.name} className="flex justify-between py-3 border-b border-border text-base">
                    <span className="text-text" dangerouslySetInnerHTML={{ __html: sub.name }} />
                    <span className="text-text-muted whitespace-nowrap">{sub.questions} Qs · {sub.marks} marks</span>
                  </div>
                ))}
                <div className="flex justify-between pt-4 text-lg font-semibold text-accent"><span>Total</span><span>{tier.total_questions} Qs · {tier.total_marks} marks · {tier.duration}</span></div>
                <div className="text-base text-orange mt-3">⚠️ Negative marking: {tier.negative_marking}</div>
              </Card>
            </div>
          ))}

          {e.major_posts && e.major_posts.length > 0 && (
            <div id="eligibility">
              <SectionHeading icon="💰">Posts & Salary (Full Detail)</SectionHeading>
              <Card className="px-6 py-5">
                {e.major_posts.map((p: any) => (
                  <div key={p.post} className="flex justify-between items-center py-3 border-b border-border text-base">
                    <div><span className="text-text font-medium" dangerouslySetInnerHTML={{ __html: p.post }} /><span className="text-text-muted ml-2 text-sm" dangerouslySetInnerHTML={{ __html: `(${p.department})` }} /></div>
                    <span className="text-accent font-semibold">{p.in_hand_salary}</span>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {e.extra_sections && e.extra_sections.map((section: any, idx: number) => {
            const sectionId = section.heading && section.type !== "svg_block"
              ? `section-${e.extra_sections.filter((s: any, i: number) => i < idx && s.heading && s.type !== "svg_block").length}` : undefined;
            return (
            <Fragment key={idx}>
            <div id={sectionId}>
              {!["svg_block","stat_grid","process_flow","icon_list","timeline","comparison_card","bar_chart","number_highlight","modern_callout","quick_action_grid","eligibility_check"].includes(section.type) && <SectionHeading icon={section.icon}>{section.heading}</SectionHeading>}
              {section.type === "text" && section.content.map((para: string, i: number) => (<p key={i} className="text-base text-text-secondary leading-[1.75] mb-5" dangerouslySetInnerHTML={{ __html: para }} />))}
              {section.type === "steps" && (<Card>{section.steps.map((step: any) => (<StepCard key={step.step} number={step.step} title={step.title} description={step.description} />))}</Card>)}
              {section.type === "table" && (
                <div className="overflow-x-auto"><table className="w-full border-collapse card overflow-hidden text-sm"><thead><tr className="bg-card-alt">{section.columns.map((col: string) => (<th key={col} className="px-4 py-3 text-left font-semibold text-text border-b border-border">{col}</th>))}</tr></thead><tbody>{section.rows.map((row: string[], ri: number) => (<tr key={ri}>{row.map((cell: string, ci: number) => (<td key={ci} className={`px-4 py-3 border-b border-border ${ci === 0 ? "font-medium text-text" : "text-text-secondary"}`} dangerouslySetInnerHTML={{ __html: cell }} />))}</tr>))}</tbody></table></div>
              )}
              {section.type === "info_rows" && (<Card>{section.rows.map((row: any) => (<InfoRow key={row.label} label={row.label} value={row.value} highlight={row.highlight} />))}</Card>)}
              {section.type === "svg_block" && (<div className="my-6">{section.caption && (<p className="text-xs text-text-muted mb-2 text-center italic">{section.caption}</p>)}<div className="card p-4 flex justify-center overflow-x-auto" dangerouslySetInnerHTML={{ __html: section.svg }} />{section.description && (<p className="text-sm text-text-secondary mt-3" dangerouslySetInnerHTML={{ __html: section.description }} />)}</div>)}
              {section.type === "callout" && (
                <div className="my-5 rounded-r-lg p-4" style={{ borderLeft: `4px solid ${section.variant === "warning" ? "#DC2626" : section.variant === "tip" ? "#EA580C" : section.variant === "info" ? "#2563EB" : "#1B6B4A"}`, backgroundColor: section.variant === "warning" ? "#FEE2E2" : section.variant === "tip" ? "#FFF7ED" : section.variant === "info" ? "#DBEAFE" : "#DCFCE7" }}>
                  {section.heading && (<p className="text-sm font-bold mb-1.5 text-text flex items-center gap-2"><span>{section.icon || "💡"}</span><span>{section.heading}</span></p>)}
                  <p className="text-sm text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
              )}
              <SchemeBlock section={section} />
              {section.type === "pullquote" && (<blockquote className="my-6 border-l-4 border-accent pl-5 py-2"><p className="text-lg font-semibold text-text leading-snug italic" dangerouslySetInnerHTML={{ __html: section.text }} />{section.attribution && (<footer className="text-xs text-text-muted mt-2 not-italic">— {section.attribution}</footer>)}</blockquote>)}
              {section.type === "stat_cards" && (<div className="my-5 grid grid-cols-2 md:grid-cols-4 gap-3">{section.cards.map((card: any, i: number) => (<div key={i} className={`card p-4 text-center ${card.variant === "accent" ? "bg-accent-light border-accent" : ""}`}><p className={`text-2xl font-bold ${card.variant === "accent" ? "text-accent" : "text-text"}`}>{card.value}</p><p className="text-xs text-text-muted mt-1">{card.label}</p></div>))}</div>)}
              {section.type === "divider" && (<div className="my-8 flex items-center gap-3"><div className="flex-1 h-px bg-border"></div>{section.label && <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">{section.label}</span>}<div className="flex-1 h-px bg-border"></div></div>)}
            </div>
            {idx === 0 && <ResizerCTA />}
            </Fragment>
          );})}

          {e.important_dates && e.important_dates.length > 0 && (
            <div id="dates">
              <SectionHeading icon="📅">Important Dates</SectionHeading>
              <Card>{e.important_dates.map((d: any) => (<InfoRow key={d.label} label={d.label} value={d.value} highlight={d.highlight} />))}</Card>
            </div>
          )}

          {e.preparation_tips && e.preparation_tips.length > 0 && (
            <>
              <SectionHeading icon="📚">Preparation Strategy</SectionHeading>
              <Card className="px-6 py-5">{e.preparation_tips.map((tip: string, i: number) => (<div key={i} className={`py-3 text-base text-text-secondary leading-relaxed flex gap-3 ${i < e.preparation_tips.length - 1 ? "border-b border-border" : ""}`}><span className="text-accent font-bold shrink-0">{i + 1}.</span><span dangerouslySetInnerHTML={{ __html: tip }} /></div>))}</Card>
            </>
          )}

          <div id="faqs"><SectionHeading icon="❓">Frequently Asked Questions</SectionHeading></div>
          <Card>{e.faqs.map((f: any) => (<FAQ key={f.question} question={f.question} answer={f.answer} />))}</Card>

          {e.official_portal?.url && e.official_portal.url !== "#" && (
            <div className="mt-8 p-5 bg-blue-light rounded-xl flex justify-between items-center"><div><div className="text-base font-semibold text-blue">{e.official_portal.name}</div><div className="font-mono text-sm text-blue/70">{e.official_portal.url.replace("https://", "")}</div></div><a href={e.official_portal.url} target="_blank" rel="noopener noreferrer" className="text-base text-blue font-medium">Visit →</a></div>
          )}

          {e.related_pages && e.related_pages.length > 0 && (
            <>
              <SectionHeading icon="🔗">Related Exams</SectionHeading>
              <div className="flex gap-3 overflow-x-auto pb-2">{e.related_pages.map((r: any) => (<a key={r.slug} href={r.url || `/exam/${r.slug}`} className="card px-5 py-4 min-w-[200px] shrink-0 hover:border-accent/30"><Tag className="bg-blue-light">{r.tag}</Tag><div className="text-base font-medium text-text mt-2">{r.title}</div></a>))}</div>
            </>
          )}

          <div className="mt-8 border-t border-border pt-6"><PdfSummary title={e.title} stats={e.hero?.stats} faqs={e.faqs} /><SourceCitations /></div>
          <AuthorBox updatedDate={e.last_reviewed || e.hero?.updated_date || "May 2026"} />
        </div>
      </div>
    </div>
  );
}
