import Link from "next/link";
import { getAllExams } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitive Exams — Pattern, Syllabus, Salary & Dates",
  description: "Complete guide to Indian competitive exams. SSC, Banking, UPSC, State PSC, JEE, NEET — pattern, syllabus, salary, and preparation tips.",
  alternates: { canonical: "https://knowledgekendra.com/exam" },
};

export default function ExamHubPage() {
  const exams = getAllExams();

  return (
    <div className="max-w-[1100px] mx-auto px-6">
      <div className="mt-8 mb-8 bg-card border border-border rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-light flex items-center justify-center text-3xl">📝</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">Competitive Exams</h1>
            <p className="text-sm text-text-secondary">{exams.length} exams — pattern, syllabus, salary & preparation tips</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {["SSC", "Banking", "UPSC", "State PSC", "Engineering", "Medical", "Teaching"].map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-lg bg-card-alt text-xs font-semibold text-text-muted border border-border">{t}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
        {exams.map((e: any) => (
          <Link key={e.slug} href={`/exam/${e.slug}`} className="bg-card border border-border rounded-2xl p-4 hover:border-blue/40 hover:shadow-sm hover:-translate-y-px transition-all">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-light flex items-center justify-center text-lg shrink-0">{e.hero?.icon || "📝"}</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-text">{e.title}</div>
                <div className="text-xs text-text-secondary mt-0.5 line-clamp-2 leading-relaxed">{e.hero?.one_liner}</div>
                <div className="flex gap-1.5 mt-2">
                  {e.hero?.stats?.slice(0, 2).map((st: any) => (
                    <span key={st.label} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-light text-blue">{st.value}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
