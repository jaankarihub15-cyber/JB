import { notFound } from "next/navigation";
import { getExamBySlug, getAllExamSlugs } from "@/lib/content";
import {
  Breadcrumb, HeroBanner, SectionHeading, Card, InfoRow, FAQ, Tag,
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
  const e = getExamBySlug(slug);
  if (!e) notFound();

  return (
    <div className="max-w-[800px] mx-auto px-5 py-6">
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
        badge="Registration Open"
        badgeStatus={e.hero.status as any}
        stats={e.hero.stats}
        updatedDate={e.hero.updated_date}
      />

      <SectionHeading icon="📋">Key Details</SectionHeading>
      <Card>
        {e.key_details.map((d) => (
          <InfoRow key={d.label} label={d.label} value={d.value} highlight={d.highlight} />
        ))}
      </Card>

      {/* Exam Pattern */}
      {e.exam_pattern.map((tier) => (
        <div key={tier.tier_name}>
          <SectionHeading icon="📝">{tier.tier_name}</SectionHeading>
          <Card className="px-4 py-3.5">
            {tier.description && (
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                {tier.description}
              </p>
            )}
            {tier.subjects.map((sub) => (
              <div
                key={sub.name}
                className="flex justify-between py-2 border-b border-border text-sm"
              >
                <span className="text-text">{sub.name}</span>
                <span className="text-text-muted whitespace-nowrap">
                  {sub.questions} Qs · {sub.marks} marks
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2.5 text-sm font-semibold text-accent">
              <span>Total</span>
              <span>
                {tier.total_questions} Qs · {tier.total_marks} marks ·{" "}
                {tier.duration}
              </span>
            </div>
            <div className="text-xs text-orange mt-2">
              ⚠️ Negative marking: {tier.negative_marking}
            </div>
          </Card>
        </div>
      ))}

      {/* Posts & Salary */}
      <SectionHeading icon="💰">Posts & Salary</SectionHeading>
      <Card className="px-4 py-3.5">
        {e.major_posts.map((p) => (
          <div
            key={p.post}
            className="flex justify-between items-center py-2 border-b border-border text-sm"
          >
            <div>
              <span className="text-text font-medium">{p.post}</span>
              <span className="text-text-muted ml-1.5 text-xs">
                ({p.department})
              </span>
            </div>
            <span className="text-accent font-semibold">{p.in_hand_salary}</span>
          </div>
        ))}
      </Card>

      <SectionHeading icon="📅">Important Dates</SectionHeading>
      <Card>
        {e.important_dates.map((d) => (
          <InfoRow key={d.label} label={d.label} value={d.value} highlight={d.highlight} />
        ))}
      </Card>

      {/* Preparation Tips */}
      {e.preparation_tips && e.preparation_tips.length > 0 && (
        <>
          <SectionHeading icon="📚">Preparation Tips</SectionHeading>
          <Card className="px-4 py-3.5">
            {e.preparation_tips.map((tip, i) => (
              <div
                key={i}
                className={`py-2 text-sm text-text-secondary leading-relaxed flex gap-2 ${
                  i < e.preparation_tips.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <span className="text-accent font-bold shrink-0">{i + 1}.</span>
                <span>{tip}</span>
              </div>
            ))}
          </Card>
        </>
      )}

      <SectionHeading icon="❓">Common Questions</SectionHeading>
      <Card>
        {e.faqs.map((f) => (
          <FAQ key={f.question} question={f.question} answer={f.answer} />
        ))}
      </Card>

      <SectionHeading icon="🔗">Related Exams</SectionHeading>
      <div className="flex gap-2.5 overflow-x-auto pb-2">
        {e.related_pages.map((r) => (
          <a key={r.slug} href={`/exam/${r.slug}`} className="card px-4 py-3.5 min-w-[180px] shrink-0">
            <Tag className="bg-blue-light">{r.tag}</Tag>
            <div className="text-sm font-medium text-text mt-2">{r.title}</div>
          </a>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-light rounded-xl flex justify-between items-center">
        <div>
          <div className="text-sm font-semibold text-blue">{e.official_portal.name}</div>
          <div className="font-mono text-xs text-blue/70">{e.official_portal.url.replace("https://", "")}</div>
        </div>
        <a href={e.official_portal.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue font-medium">
          Visit →
        </a>
      </div>
    </div>
  );
}
