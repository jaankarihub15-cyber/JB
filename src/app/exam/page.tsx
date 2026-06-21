import { getAllExams } from "@/lib/content";
import { ExamHubClient } from "@/components/exam-hub-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitive Exams — Pattern, Syllabus, Salary & Dates",
  description: "Guides to Indian competitive exams. SSC, banking, UPSC, state PSC, railway, teaching, defence and entrance — eligibility, pattern, syllabus, salary and dates.",
  alternates: { canonical: "https://knowledgekendra.com/exam" },
};

const STATE_PSC = new Set([
  "appsc", "bpsc", "cgpsc", "hpsc", "jpsc", "kpsc", "mppsc",
  "rpsc-ras", "tnpsc", "ukpsc", "uppsc-pcs", "wbpsc",
]);
const DEFENCE = new Set(["nda", "cds", "afcat"]);
const TEACHING = new Set(["ctet", "uptet", "reet", "ugc-net"]);
const RAILWAY = new Set(["rrb-group-d", "rrb-ntpc"]);
const BANKING = new Set(["ibps-clerk", "ibps-po", "sbi-po", "rbi-grade-b", "lic-aao"]);
const ENTRANCE = new Set([
  "neet-ug", "jee-main", "gate", "cat-2026", "clat-2026",
  "cuet-ug", "aiims-ini-cet", "aiims-nursing",
]);

function classify(slug: string, tags: string[]): string {
  if (slug.startsWith("ssc-")) return "ssc";
  if (BANKING.has(slug)) return "banking";
  if (RAILWAY.has(slug)) return "railway";
  if (TEACHING.has(slug)) return "teaching";
  if (DEFENCE.has(slug)) return "defence";
  if (slug === "upsc-cse") return "upsc";
  if (STATE_PSC.has(slug)) return "statepsc";
  if (ENTRANCE.has(slug)) return "entrance";
  // tag fallback
  const t = tags.map((x) => x.toLowerCase());
  if (t.some((x) => x.includes("ssc"))) return "ssc";
  if (t.some((x) => ["banking", "ibps", "rbi", "sbi", "insurance"].some((k) => x.includes(k)))) return "banking";
  if (t.some((x) => x.includes("railway") || x.includes("rrb"))) return "railway";
  if (t.some((x) => x.includes("teach") || x.includes("ugc net"))) return "teaching";
  if (t.some((x) => ["defence", "air force", "afcat", "navy", "army"].some((k) => x.includes(k)))) return "defence";
  if (t.some((x) => x.includes("state psc"))) return "statepsc";
  if (t.some((x) => ["medical", "engineering", "jee", "neet", "gate", "law", "management", "university", "mba", "iim"].some((k) => x.includes(k)))) return "entrance";
  if (t.some((x) => x.includes("upsc"))) return "upsc";
  return "statepsc";
}

export default function ExamHubPage() {
  const raw = getAllExams();

  const exams = raw.map((e: any) => {
    const tags: string[] = e.tags || [];
    const qf = e.quick_facts?.[0];
    let stat = qf ? String(qf.value) : "Full guide";
    if (stat.length > 26) stat = stat.slice(0, 24).trim() + "…";
    return {
      slug: e.slug,
      title: e.title,
      one_liner: e.hero?.one_liner || "",
      tags: tags.slice(0, 2),
      stat,
      category: classify(e.slug, tags),
      icon: e.hero?.icon || "📝",
    };
  });

  return <ExamHubClient exams={exams} />;
}
