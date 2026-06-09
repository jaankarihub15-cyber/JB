import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";
import { Breadcrumb, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Free Tools for Exam & Form Applicants - KnowledgeKendra",
  description:
    "Free, privacy-first tools for Indian exam and job form applicants. Resize photos and signatures, check scheme eligibility, and more. No login, works on mobile.",
  alternates: { canonical: "https://knowledgekendra.com/tools" },
};

const tools = [
  {
    href: "/tools/photo-resizer",
    icon: "🖼️",
    title: "Photo & Signature Resizer",
    desc: "Resize any photo or signature to 50KB, 20KB, or any exact size for exam and job forms. Runs in your browser, never uploaded.",
    tag: "Image",
  },
  {
    href: "/check-eligibility",
    icon: "✅",
    title: "Scheme Eligibility Checker",
    desc: "Answer a few questions to find central and state government schemes you qualify for, across India.",
    tag: "Schemes",
  },
];

export default function ToolsHubPage() {
  return (
    <div className="max-w-[760px] mx-auto px-4 pt-6 pb-12">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://knowledgekendra.com" },
          { name: "Tools", url: "https://knowledgekendra.com/tools" },
        ])}
      />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />

      <div className="mt-4 mb-6">
        <h1 className="heading text-3xl font-normal text-text mb-2">Free Tools</h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Simple, privacy-first tools to help you fill government exam and job forms. No login, no
          fees, and built mobile first.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="card p-5 hover:border-accent/30 transition-colors flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{t.icon}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-accent-light text-accent">
                {t.tag}
              </span>
            </div>
            <div className="text-base font-bold text-text">{t.title}</div>
            <div className="text-sm text-text-secondary leading-relaxed">{t.desc}</div>
            <span className="text-sm font-bold text-accent mt-1">Open tool →</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-accent-light rounded-xl text-center text-sm text-text-secondary leading-relaxed">
        More free tools are on the way. Bookmark KnowledgeKendra and check back.
      </div>
    </div>
  );
}
