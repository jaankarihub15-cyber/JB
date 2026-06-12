"use client";

import { useState } from "react";
import Link from "next/link";
import { FIX_PAGES, DOC_LABELS } from "@/lib/fix-data";

type Filter = "all" | "id" | "epf" | "education";

const TYPE_FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "id", label: "🪪 Aadhaar / PAN" },
  { key: "epf", label: "💼 EPF / PF" },
  { key: "education", label: "🎓 Certificates" },
];

// the "who/where" tag colour per group (mirrors mockup's coloured state tags)
const TAG_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  id: { bg: "#EAF4EE", color: "#1B6B4A", label: "AADHAAR / PAN" },
  epf: { bg: "#FBF0EC", color: "#B5512E", label: "EPF / PF" },
  education: { bg: "#EEF1FB", color: "#3D55B8", label: "CERTIFICATE" },
};

export function FixHubClient({ query }: { query: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState(query || "");

  const shown = FIX_PAGES.filter((p) => {
    if (filter !== "all" && p.group !== filter) return false;
    if (q.trim().length >= 2) {
      const hay = (p.h1 + " " + p.short + " " + p.intro).toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });

  return (
    <>
      {/* Floating filter card with TWO labeled rows - mirrors mockup */}
      <div className="bg-card border border-border rounded-[18px] -mt-12 relative z-10 shadow-[0_14px_36px_rgba(20,45,33,0.10)] px-5 py-4 md:px-6 md:py-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-extrabold tracking-[0.08em] text-[#8a978d] uppercase min-w-[56px]">Type</span>
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={
                "px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors cursor-pointer " +
                (filter === f.key
                  ? "bg-accent border-accent text-white"
                  : "bg-card border-border text-text-secondary hover:border-accent/50")
              }
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-dashed border-[#EAEFE8]">
          <span className="text-[11px] font-extrabold tracking-[0.08em] text-[#8a978d] uppercase min-w-[56px]">Find</span>
          <div className="flex items-center flex-1 min-w-[220px] bg-card-alt border border-border rounded-full px-4 py-2">
            <span className="text-[14px] mr-2">🔍</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Aadhaar, PAN name, EPF rejected, marksheet..."
              className="flex-1 bg-transparent outline-none text-[13.5px] text-text placeholder:text-text-muted"
            />
          </div>
        </div>
      </div>

      {/* Showing X + sort line - mirrors mockup */}
      <div className="flex items-center justify-between mt-8 mb-5">
        <h2 className="text-[18px] font-extrabold">
          Showing <span className="text-accent">{shown.length} fix{shown.length === 1 ? "" : "es"}</span>
        </h2>
        <div className="text-[12.5px] text-text-muted font-semibold">
          Sort: <b className="text-text">Most common</b>
        </div>
      </div>

      {/* 3-column cards mirroring mockup (tag + who + bottom row) */}
      {shown.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-6 text-center text-[14px] text-text-secondary">
          No fix matches that yet. Try a broader word, or{" "}
          <button type="button" onClick={() => { setQ(""); setFilter("all"); }} className="text-accent underline">see all fixes</button>.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map((p) => {
            const tag = TAG_STYLE[p.group];
            return (
              <Link
                key={p.slug}
                href={`/fix/${p.slug}`}
                className={
                  "relative bg-card border rounded-[18px] p-5 transition-all hover:shadow-[0_12px_30px_rgba(27,107,74,0.12)] hover:-translate-y-[3px] " +
                  (p.popular ? "border-accent/30" : "border-border")
                }
              >
                {p.popular && (
                  <span className="absolute -top-2.5 left-4 bg-[#E8A33D] text-[#3D2A07] text-[9.5px] font-extrabold tracking-[0.06em] px-2.5 py-1 rounded-full">
                    🔥 MOST COMMON
                  </span>
                )}
                {/* top row: coloured tag + who/icon */}
                <div className="flex items-center justify-between mb-3.5">
                  <span
                    className="text-[10.5px] font-extrabold tracking-[0.06em] px-2.5 py-1 rounded-full"
                    style={{ background: tag.bg, color: tag.color }}
                  >
                    {tag.label}
                  </span>
                  <span className="text-[18px]">{p.icon}</span>
                </div>
                <h3 className="text-[16px] font-extrabold text-text leading-snug mb-2">{p.h1}</h3>
                <p className="text-[12.5px] text-text-secondary leading-relaxed mb-4">{p.intro}</p>
                {/* bottom row: which doc to fix + Read */}
                <div className="flex items-center justify-between border-t border-dashed border-border pt-3">
                  <div>
                    <div className="text-[10.5px] text-[#8a978d] font-semibold">Fix your</div>
                    <div className="text-[14px] font-extrabold text-accent">{DOC_LABELS[p.wrong]}</div>
                  </div>
                  <span className="text-[12.5px] font-extrabold text-accent">Find fix →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
