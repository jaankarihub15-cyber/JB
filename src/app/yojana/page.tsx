import Link from "next/link";
import { getAllSchemes } from "@/lib/content";
import { Badge, Tag } from "@/components/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government Schemes — Eligibility, Benefits & How to Apply",
  description:
    "Complete list of Indian government schemes explained simply. Check eligibility, benefits, documents needed, and how to apply for each scheme.",
};

export default function YojanaHubPage() {
  const schemes = getAllSchemes();

  return (
    <div className="max-w-[860px] mx-auto px-5 py-6">
      <div className="mb-6">
        <h1 className="heading text-3xl font-normal text-text mb-1.5">
          🏛️ Government Yojanas
        </h1>
        <p className="text-base text-text-secondary">
          {schemes.length} schemes explained simply — eligibility, benefits, how
          to apply
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {schemes.map((s) => (
          <Link
            key={s.slug}
            href={`/yojana/${s.slug}`}
            className="p-4 card hover:border-accent/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-2 gap-2">
              <div className="flex gap-1.5 flex-wrap">
                {s.tags.slice(0, 2).map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <Badge status={s.hero.status as any}>
                {s.hero.status === "active" ? "Active" : "Closed"}
              </Badge>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{s.hero.icon}</span>
              <div className="flex-1">
                <div className="text-base font-semibold text-text mb-1">
                  {s.title}
                </div>
                <div className="text-sm text-text-secondary leading-relaxed">
                  {s.hero.one_liner}
                </div>
                <div className="flex gap-4 mt-2.5">
                  {s.hero.stats.slice(0, 2).map((stat) => (
                    <div key={stat.label}>
                      <span className="text-xs text-text-muted">
                        {stat.label}:{" "}
                      </span>
                      <span className="text-sm font-semibold text-accent">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {schemes.length === 0 && (
        <p className="text-center py-10 text-text-muted">
          No schemes available yet. Check back soon!
        </p>
      )}
    </div>
  );
}
