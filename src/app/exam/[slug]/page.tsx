import { AuthorBox } from "@/components/author-box";
import { ResizerCTA } from "@/components/resizer-cta";
import { FormKitCTA } from "@/components/form-kit-cta";
import { Fragment } from "react";
import { SchemeBlock } from "@/components/scheme-blocks";
import { SaveForLater } from "@/components/save-for-later";
import { SourceCitations } from "@/components/source-citations";
import { PdfSummary } from "@/components/pdf-summary";
import { HeroV2 } from "@/components/hero-v2";
import { TocSidebarV2 } from "@/components/toc-sidebar-v2";
import { SalaryLead, ExamChipNav, DashboardStrip } from "@/components/exam-answer-layer";
import { ExamEligibilityChecker } from "@/components/exam-eligibility-checker";
import { ExamScoreCalculator } from "@/components/exam-score-calculator";
import { ExamPostSorter } from "@/components/exam-post-sorter";
import { notFound } from "next/navigation";
import { getExamBySlug, getAllExamSlugs } from "@/lib/content";
import {
  Breadcrumb, SectionHeading, Card, InfoRow, StepCard, FAQ, Tag,
} from "@/components/ui";
import { JsonLd, faqSchema, breadcrumbSchema } from "@/components/json-ld";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

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

  // Build nav items for sticky chips + TOC sidebar
  const navItems: { id: string; text: string }[] = [
    ...(hasSalary ? [{ id: "salary", text: "💰 Salary" }] : []),
    ...(e.key_details?.length > 0 ? [{ id: "eligibility", text: "✅ Eligibility" }] : []),
    ...(e.exam_pattern?.length > 0 ? [{ id: "syllabus", text: "📘 Syllabus" }] : []),
    ...(e.important_dates?.length > 0 ? [{ id: "dates", text: "📅 Dates" }] : []),
    ...(e.preparation_tips?.length > 0 ? [{ id: "prep", text: "📚 Prep" }] : []),
    ...(e.exam_prep?.books?.length > 0 ? [{ id: "books", text: "📖 Books" }] : []),
    ...(e.faqs?.length > 0 ? [{ id: "faqs", text: "❓ FAQs" }] : []),
  ];

  // Badge text (longer, as Ash requested)
  const badge = e.hero?.badge || `${e.hero?.icon || "🎯"} ${e.category || e.title.split(":")[0]} ${new Date().getFullYear()}`;

  return (
    <div className="theme-v2 py-0">
      <article itemScope itemType="https://schema.org/Article" className="sr-only">
        <meta itemProp="headline" content={e.title} />
        <meta itemProp="description" content={e.meta_description || e.hero.one_liner} />
        <meta itemProp="dateModified" content={new Date().toISOString().split('T')[0]} />
        <div itemProp="abstract">
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

      {/* V2 HERO BAND */}
      <div className="hero-band-v2">
        <div className="max-w-[1140px] mx-auto px-5 md:px-6">
          <div className="pt-6 flex justify-between items-start">
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Exam", href: "/exam" }, { label: e.title }]} />
            <SaveForLater slug={slug} title={e.title} url={`/exam/${slug}`} />
          </div>
          <div className="-mb-10 md:-mb-16">
          <HeroV2
            title={e.title}
            subtitle={e.hero?.one_liner || e.meta_description}
            badge={badge}
            updatedDate={e.hero?.updated_date}
          />
          <DashboardStrip facts={e.quick_facts} />
          </div>
        </div>
      </div>

      {/* STICKY CHIP NAV (client component with active tracking) */}
      <ExamChipNav items={navItems} />

      {/* CONTENT + TOC SIDEBAR */}
      <div className="max-w-[1140px] mx-auto px-5 md:px-6 pb-6 relative z-10">
        <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)_180px] lg:gap-10 lg:items-start mt-4">
          <TocSidebarV2 items={navItems} />
          <div className="min-w-0">

            {/* SALARY FIRST */}
            <SalaryLead salary={e.salary_table} posts={e.major_posts} />

            {/* WHAT'S CHANGED (optional callout, hides when absent) */}
            {e.changes_2026 && e.changes_2026.length > 0 && (
              <div className="mt-6 p-4 rounded-xl bg-[#FEFCE8] border border-[#FDE68A]">
                <div className="text-[13px] font-bold text-[#92400E] mb-2">⚡ What's different in 2026?</div>
                {(e.changes_2026 || []).map((c: string, i: number) => (
                  <p key={i} className="text-sm text-[#78350F] leading-relaxed mb-1" dangerouslySetInnerHTML={{ __html: c }} />
                ))}
              </div>
            )}

            {/* ELIGIBILITY */}
            {e.key_details && e.key_details.length > 0 && (
              <div id="eligibility" className="mt-6 scroll-mt-40">
                <SectionHeading icon="✅">Eligibility &amp; Key Details</SectionHeading>
                <ExamEligibilityChecker data={e.eligibility_data} />
                <Card>{(e.key_details || []).map((d: any) => (<InfoRow key={d.label} label={d.label} value={d.value} highlight={d.highlight} />))}</Card>
              </div>
            )}

            {/* SYLLABUS & EXAM PATTERN */}
            {e.exam_pattern && e.exam_pattern.length > 0 && (
              <div id="syllabus" className="mt-6 scroll-mt-40">
                <SectionHeading icon="📘">Syllabus &amp; Exam Pattern</SectionHeading>
                <div className="rounded-xl p-4 bg-[#FEF2F2] border border-[#FECACA] mb-4 text-sm font-semibold text-[#991B1B] flex items-start gap-2">⚠️ Negative marking applies in all tiers. Guessing costs you marks.</div>
                {(e.exam_pattern || []).map((tier: any, ti: number) => (
                  <div key={tier.tier_name} className={ti > 0 ? "mt-4" : ""}>
                    <SectionHeading icon="📝">{tier.tier_name}</SectionHeading>
                <Card className="px-6 py-5">
                  {tier.description && (<p className="text-sm text-text-secondary leading-relaxed mb-4">{tier.description}</p>)}
                  {(tier.subjects || []).map((sub: any) => (
                    <div key={sub.name} className="border-t border-border py-3">
                      <div className="flex justify-between text-base">
                        <span className="text-text font-semibold" dangerouslySetInnerHTML={{ __html: sub.name }} />
                        <span className="text-text-muted whitespace-nowrap">{sub.questions} Qs · {sub.marks} marks</span>
                      </div>
                      {sub.topics && sub.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {sub.topics.map((t: any) => (
                            <span key={t.name} className={`text-[10.5px] font-medium px-2.5 py-1 rounded-lg ${t.high ? "bg-[#FEF3C7] text-[#92400E] font-semibold" : "bg-[#F7F7F5] text-text-muted"}`}>{t.name}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {(tier.total_marks || tier.total_questions) && (
                    <div className="flex justify-between pt-4 text-lg font-semibold text-accent"><span>Total</span><span>{tier.total_questions} Qs · {tier.total_marks} marks{tier.duration ? ` · ${tier.duration}` : ""}</span></div>
                  )}
                  {tier.negative_marking && (
                    <div className="text-sm text-[#991B1B] mt-3">⚠️ {tier.negative_marking}</div>
                  )}
                </Card>
              </div>
            ))}
                {e.exam_pattern[0]?.subjects?.[0]?.topics && (
                  <div className="p-3 rounded-xl bg-[#F7F7F5] text-[12px] text-text-muted leading-relaxed mt-2">
                    <b className="text-text">💡</b> Topics marked in <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">amber</span> appear most frequently in previous year papers. Start your prep there.
                  </div>
                )}
              </div>
            )}

            {/* SCORE CALCULATOR (hides when cutoff_data absent) */}
            <ExamScoreCalculator data={e.cutoff_data} />

            {/* POST PREFERENCE SORTER (hides when post_preferences absent) */}
            <ExamPostSorter data={e.post_preferences} />

            {/* POSTS FULL DETAIL (only if salary_table exists, avoiding duplicate) */}
            {e.salary_table?.rows?.length > 0 && e.major_posts && e.major_posts.length > 0 && (
              <>
                <SectionHeading icon="💰">Posts & Salary (Full Detail)</SectionHeading>
                <Card className="px-6 py-5">
                  {(e.major_posts || []).map((p: any) => (
                    <div key={p.post} className="flex justify-between items-center py-3 border-b border-border text-base">
                      <div><span className="text-text font-medium" dangerouslySetInnerHTML={{ __html: p.post }} /><span className="text-text-muted ml-2 text-sm" dangerouslySetInnerHTML={{ __html: `(${p.department})` }} /></div>
                      <span className="text-accent font-semibold">{p.in_hand_salary}</span>
                    </div>
                  ))}
                </Card>
              </>
            )}

            {/* EXTRA SECTIONS (unchanged rendering) */}
            {e.extra_sections && e.extra_sections.map((section: any, idx: number) => {
              const sectionId = section.heading && section.type !== "svg_block"
                ? `section-${e.extra_sections.filter((s: any, i: number) => i < idx && s.heading && s.type !== "svg_block").length}` : undefined;
              return (
              <Fragment key={idx}>
              <div id={sectionId}>
                {!["svg_block","stat_grid","process_flow","icon_list","timeline","comparison_card","bar_chart","number_highlight","modern_callout","quick_action_grid","eligibility_check"].includes(section.type) && <SectionHeading icon={section.icon}>{section.heading}</SectionHeading>}
                {section.type === "text" && (section.content || []).map((para: string, i: number) => (<p key={i} className="text-base text-text-secondary leading-[1.75] mb-5" dangerouslySetInnerHTML={{ __html: para }} />))}
                {section.type === "steps" && (<Card>{(section.steps || []).map((step: any) => (<StepCard key={step.step} number={step.step} title={step.title} description={step.description} />))}</Card>)}
                {section.type === "table" && (
                  <div className="overflow-x-auto"><table className="w-full border-collapse card overflow-hidden text-sm"><thead><tr className="bg-card-alt">{(section.columns || []).map((col: string) => (<th key={col} className="px-4 py-3 text-left font-semibold text-text border-b border-border">{col}</th>))}</tr></thead><tbody>{(section.rows || []).map((row: string[], ri: number) => (<tr key={ri}>{(row || []).map((cell: string, ci: number) => (<td key={ci} className={`px-4 py-3 border-b border-border ${ci === 0 ? "font-medium text-text" : "text-text-secondary"}`} dangerouslySetInnerHTML={{ __html: cell }} />))}</tr>))}</tbody></table></div>
                )}
                {section.type === "info_rows" && (<Card>{(section.rows || []).map((row: any) => (<InfoRow key={row.label} label={row.label} value={row.value} highlight={row.highlight} />))}</Card>)}
                {section.type === "svg_block" && (<div className="my-6">{section.caption && (<p className="text-xs text-text-muted mb-2 text-center italic">{section.caption}</p>)}<div className="card p-4 flex justify-center overflow-x-auto" dangerouslySetInnerHTML={{ __html: section.svg }} />{section.description && (<p className="text-sm text-text-secondary mt-3" dangerouslySetInnerHTML={{ __html: section.description }} />)}</div>)}
                {section.type === "callout" && (
                  <div className="my-5 rounded-r-lg p-4" style={{ borderLeft: `4px solid ${section.variant === "warning" ? "#DC2626" : section.variant === "tip" ? "#EA580C" : section.variant === "info" ? "#2563EB" : "#1B6B4A"}`, backgroundColor: section.variant === "warning" ? "#FEE2E2" : section.variant === "tip" ? "#FFF7ED" : section.variant === "info" ? "#DBEAFE" : "#DCFCE7" }}>
                    {section.heading && (<p className="text-sm font-bold mb-1.5 text-text flex items-center gap-2"><span>{section.icon || "💡"}</span><span>{section.heading}</span></p>)}
                    <p className="text-sm text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
                  </div>
                )}
                <SchemeBlock section={section} />
                {section.type === "pullquote" && (<blockquote className="my-6 border-l-4 border-accent pl-5 py-2"><p className="text-lg font-semibold text-text leading-snug italic" dangerouslySetInnerHTML={{ __html: section.text }} />{section.attribution && (<footer className="text-xs text-text-muted mt-2 not-italic">— {section.attribution}</footer>)}</blockquote>)}
                {section.type === "stat_cards" && (<div className="my-5 grid grid-cols-2 md:grid-cols-4 gap-3">{(section.cards || []).map((card: any, i: number) => (<div key={i} className={`card p-4 text-center ${card.variant === "accent" ? "bg-accent-light border-accent" : ""}`}><p className={`text-2xl font-bold ${card.variant === "accent" ? "text-accent" : "text-text"}`}>{card.value}</p><p className="text-xs text-text-muted mt-1">{card.label}</p></div>))}</div>)}
                {section.type === "divider" && (<div className="my-8 flex items-center gap-3"><div className="flex-1 h-px bg-border"></div>{section.label && <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">{section.label}</span>}<div className="flex-1 h-px bg-border"></div></div>)}
              </div>
              {idx === 0 && <ResizerCTA />}
              </Fragment>
            );})}

            {/* IMPORTANT DATES */}
            {e.important_dates && e.important_dates.length > 0 && (
              <div id="dates" className="mt-6 scroll-mt-40">
                <SectionHeading icon="📅">Important Dates</SectionHeading>
                <Card>{(e.important_dates || []).map((d: any) => (<InfoRow key={d.label} label={d.label} value={d.value} highlight={d.highlight} />))}</Card>
              </div>
            )}

            {/* PREPARATION */}
            {e.preparation_tips && e.preparation_tips.length > 0 && (
              <div id="prep" className="mt-6 scroll-mt-40">
                <SectionHeading icon="📚">Preparation Strategy</SectionHeading>
                <Card className="px-6 py-5">{(e.preparation_tips || []).map((tip: string, i: number) => (<div key={i} className={`py-3 text-base text-text-secondary leading-relaxed flex gap-3 ${i < e.preparation_tips.length - 1 ? "border-b border-border" : ""}`}><span className="text-accent font-bold shrink-0">{i + 1}.</span><span dangerouslySetInnerHTML={{ __html: tip }} /></div>))}</Card>
              </div>
            )}

            {/* BOOKS */}
            {e.exam_prep?.books && e.exam_prep.books.length > 0 && (
              <div id="books" className="mt-6 scroll-mt-40">
                <div className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold tracking-[0.07em] uppercase px-3 py-1.5 rounded-[10px] bg-[#FEF3C7] text-[#92400E] mb-3">📖 Books</div>
                <SectionHeading icon="📖">Recommended Books</SectionHeading>
                <Card className="px-6 py-5">
                  {(e.exam_prep?.books || []).map((book: any, i: number) => (
                    <div key={i} className={`py-3 text-base text-text-secondary leading-relaxed ${i < e.exam_prep.books.length - 1 ? "border-b border-border" : ""}`}>
                      {typeof book === "string" ? <span dangerouslySetInnerHTML={{ __html: book }} /> : <><span className="font-semibold text-text">{book.title}</span>{book.author && <span className="text-text-muted"> — {book.author}</span>}{book.note && <div className="text-sm text-text-muted mt-1">{book.note}</div>}</>}
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* FAQS */}
            <div id="faqs" className="mt-6 scroll-mt-40">
              <SectionHeading icon="❓">Frequently Asked Questions</SectionHeading>
            </div>
            <Card>{(e.faqs || []).map((f: any) => (<FAQ key={f.question} question={f.question} answer={f.answer} />))}</Card>

            {/* FORM KIT BANNER */}
            <FormKitCTA slug={slug} />

            {/* OFFICIAL PORTAL */}
            {e.official_portal?.url && e.official_portal.url !== "#" && (
              <div className="mt-8 p-5 bg-blue-light rounded-xl flex justify-between items-center">
                <div><div className="text-base font-semibold text-blue">{e.official_portal.name}</div><div className="font-mono text-sm text-blue/70">{e.official_portal.url.replace("https://", "")}</div></div>
                <a href={e.official_portal.url} target="_blank" rel="noopener noreferrer" className="text-base text-blue font-medium">Visit →</a>
              </div>
            )}

            {/* RELATED */}
            {e.related_pages && e.related_pages.length > 0 && (
              <><SectionHeading icon="🔗">Related Exams</SectionHeading>
              <div className="flex gap-3 overflow-x-auto pb-2">{(e.related_pages || []).map((r: any) => (<a key={r.slug} href={r.url || `/exam/${r.slug}`} className="card px-5 py-4 min-w-[200px] shrink-0 hover:border-accent/30 no-underline"><Tag className="bg-blue-light">{r.tag}</Tag><div className="text-base font-medium text-text mt-2">{r.title}</div></a>))}</div></>
            )}

            {/* FOOTER */}
            <div className="mt-8 border-t border-border pt-6"><PdfSummary title={e.title} stats={e.hero?.stats} faqs={e.faqs} /><SourceCitations /></div>
            <AuthorBox updatedDate={e.last_reviewed || e.hero?.updated_date || "May 2026"} />
          </div>
        </div>
      </div>
    </div>
  );
}
