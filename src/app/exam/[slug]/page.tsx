import { notFound } from "next/navigation";
import { getExamBySlug, getAllExamSlugs } from "@/lib/content";
import {
  Breadcrumb, HeroBanner, SectionHeading, Card, InfoRow, StepCard, FAQ, Tag,
} from "@/components/ui";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllExamSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exam = getExamBySlug(slug);
  if (!exam) return {};
  return {
    title: `${exam.title} — Pattern, Syllabus, Dates & Salary`,
    description: exam.meta_description,
  };
}

export default async function ExamDetailPage({ params }: Props) {
  const { slug } = await params;
  const e = getExamBySlug(slug) as any;
  if (!e) notFound();

  return (
    <div className="max-w-[860px] mx-auto px-6 py-8">
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
              <p className="text-base text-text-secondary leading-relaxed mb-4">{tier.description}</p>
            )}
            {tier.subjects.map((sub: any) => (
              <div key={sub.name} className="flex justify-between py-3 border-b border-border text-base">
                <span className="text-text">{sub.name}</span>
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
                  <span className="text-text font-medium">{p.post}</span>
                  <span className="text-text-muted ml-2 text-sm">({p.department})</span>
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
            <p key={i} className="text-base text-text-secondary leading-relaxed mb-4">{para}</p>
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
                        <td key={ci} className={`px-4 py-3 border-b border-border ${ci === 0 ? "font-medium text-text" : "text-text-secondary"}`}>{cell}</td>
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
                <span>{tip}</span>
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
          <a key={r.slug} href={`/exam/${r.slug}`} className="card px-5 py-4 min-w-[200px] shrink-0 hover:border-accent/30">
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
      </div>
    </div>
  );
}
