import Link from "next/link";
import { getAllExams } from "@/lib/content";
import { Badge, Tag } from "@/components/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government Exams — Pattern, Syllabus, Dates & Salary",
  description:
    "Complete guide to Indian government exams. SSC, UPSC, Banking, Railway — exam pattern, syllabus, important dates, salary, and preparation tips.",
};

export default function ExamHubPage() {
  const exams = getAllExams();

  return (
    <div className="max-w-[800px] mx-auto px-5 py-6">
      <div className="mb-6">
        <h1 className="heading text-3xl font-normal text-text mb-1.5">
          📝 Government Exams
        </h1>
        <p className="text-base text-text-secondary">
          {exams.length} exams — syllabus, pattern, dates, salary, and
          preparation tips
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {exams.map((e) => (
          <Link
            key={e.slug}
            href={`/exam/${e.slug}`}
            className="p-4 card hover:border-accent/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-1.5">
                {e.tags.slice(0, 2).map((t) => (
                  <Tag key={t} className="bg-blue-light">
                    {t}
                  </Tag>
                ))}
              </div>
              <Badge status={e.hero.status as any}>
                {e.hero.status === "upcoming" ? "Upcoming" : "Active"}
              </Badge>
            </div>
            <div className="text-lg font-semibold text-text mb-1">
              {e.title}
            </div>
            <div className="text-sm text-text-secondary leading-relaxed mb-2.5">
              {e.hero.one_liner}
            </div>
            <div className="flex gap-4 flex-wrap text-sm text-text-muted">
              {e.hero.stats.map((s) => (
                <span key={s.label} className="flex items-center gap-1">
                  <span className="text-accent font-semibold">{s.value}</span>
                  <span className="text-text-muted text-xs">
                    {s.label}
                  </span>
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {exams.length === 0 && (
        <p className="text-center py-10 text-text-muted">
          No exams available yet. Check back soon!
        </p>
      )}
    </div>
  );
}
