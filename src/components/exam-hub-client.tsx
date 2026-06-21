"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Exam = {
  slug: string;
  title: string;
  one_liner: string;
  tags: string[];
  stat: string;
  category: string;
  icon: string;
};

const FILTERS = [
  { key: "all", icon: "📋", label: "All" },
  { key: "ssc", icon: "📄", label: "SSC" },
  { key: "banking", icon: "🏦", label: "Banking" },
  { key: "upsc", icon: "🏆", label: "UPSC" },
  { key: "statepsc", icon: "🗺️", label: "State PSC" },
  { key: "railway", icon: "🚂", label: "Railway" },
  { key: "teaching", icon: "📚", label: "Teaching" },
  { key: "defence", icon: "🎖️", label: "Defence" },
  { key: "entrance", icon: "🎓", label: "Entrance" },
];

const POPULAR_SLUGS = new Set([
  "upsc-cse", "ssc-cgl-2026", "ssc-gd-constable", "neet-ug",
  "ctet", "rrb-ntpc", "ibps-po", "uppsc-pcs",
]);

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "ssc": { bg: "#EAF4EE", text: "#1B6B4A" },
  "banking": { bg: "#EEF1FB", text: "#3D55B8" },
  "upsc": { bg: "#FBF3E7", text: "#A8742E" },
  "statepsc": { bg: "#F0EEFB", text: "#5B44C0" },
  "railway": { bg: "#FBF0EC", text: "#B5512E" },
  "teaching": { bg: "#F4ECF8", text: "#7A3DA8" },
  "defence": { bg: "#E9F0F5", text: "#2E6C8A" },
  "entrance": { bg: "#FBECEF", text: "#B5384F" },
};

function tagColor(cat: string) {
  return CATEGORY_COLORS[cat] || { bg: "#F3F4F6", text: "#4B5563" };
}

export function ExamHubClient({ exams }: { exams: Exam[] }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    let list = exams;
    if (filter !== "all") list = list.filter((e) => e.category === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((e) =>
        e.title.toLowerCase().includes(q) ||
        e.one_liner.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => {
      const ap = POPULAR_SLUGS.has(a.slug) ? 0 : 1;
      const bp = POPULAR_SLUGS.has(b.slug) ? 0 : 1;
      return ap - bp || a.title.localeCompare(b.title);
    });
  }, [exams, filter, query]);

  const visible = showAll ? filtered : filtered.slice(0, 9);
  const remaining = filtered.length - 9;

  return (
    <>
      {/* HERO */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(150deg, #0E2418, #0F3D2A 70%, #1B6B4A)" }}>
        <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, transparent 0 31px, rgba(255,255,255,.03) 31px 32px)" }} />
        <div className="max-w-[1140px] mx-auto px-6 pt-[52px] pb-[96px] relative">
          <div className="text-[12.5px] font-semibold mb-4" style={{ color: "#8FB8A2" }}>
            Home / <span style={{ color: "#DFF3E8" }}>Exam Guide</span>
          </div>
          <h1 className="text-white font-extrabold tracking-tight mb-3" style={{ fontSize: "clamp(30px, 4vw, 42px)", letterSpacing: "-.8px" }}>
            {exams.length} exam guides. <span style={{ color: "#9FE2BE" }}>Pattern to salary.</span>
          </h1>
          <p className="max-w-[580px] leading-relaxed mb-6" style={{ color: "#BFDCCB", fontSize: "15.5px" }}>
            SSC, banking, UPSC, state PSC, railway, teaching, defence. Every page covers eligibility, pattern, syllabus, salary and the latest dates. No fluff.
          </p>
          <div className="flex items-center bg-white rounded-2xl p-[7px] pl-[18px] max-w-[540px]" style={{ boxShadow: "0 16px 40px rgba(0,0,0,.25)" }}>
            <span className="text-[16px] mr-2.5">🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search... e.g. SSC CGL, UPSC, bank PO, CTET"
              className="flex-1 border-none outline-none text-[15px] bg-transparent"
              style={{ color: "#243b30", fontFamily: "inherit" }}
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-xs font-bold text-text-muted px-3 py-2">Clear</button>
            )}
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="max-w-[1140px] mx-auto px-6">
        <div className="bg-white border border-border rounded-[18px] -mt-12 relative z-[2] p-[18px_20px]" style={{ boxShadow: "0 14px 36px rgba(20,45,33,.10)" }}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-extrabold tracking-[.08em] uppercase mr-1 min-w-[64px]" style={{ color: "#8a978d" }}>Category</span>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => { setFilter(f.key); setShowAll(false); }}
                className={`border-[1.5px] rounded-full px-[15px] py-[7px] text-[12.5px] font-semibold transition-colors cursor-pointer ${
                  filter === f.key
                    ? "bg-accent border-accent text-white"
                    : "border-border bg-white text-text-secondary hover:border-accent"
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div className="max-w-[1140px] mx-auto px-6 pt-9">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[18px] font-extrabold">
            Showing <span className="text-accent">{filtered.length} exams</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {visible.map((e) => {
            const isPopular = POPULAR_SLUGS.has(e.slug);
            const c = tagColor(e.category);
            return (
              <Link
                key={e.slug}
                href={`/exam/${e.slug}`}
                className="relative bg-card border border-border rounded-[18px] p-[22px] transition-all hover:shadow-lg hover:-translate-y-[3px]"
              >
                {isPopular && (
                  <div className="absolute -top-[11px] left-[18px] text-[9.5px] font-extrabold tracking-[.08em] px-[11px] py-[5px] rounded-full" style={{ background: "#E8A33D", color: "#3D2A07" }}>
                    🔥 POPULAR
                  </div>
                )}
                <div className="flex gap-1.5 mb-3 flex-wrap items-center">
                  <span className="text-[18px] mr-0.5">{e.icon}</span>
                  {e.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[10.5px] font-extrabold tracking-[.06em] px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.text }}>
                      {t}
                    </span>
                  ))}
                </div>
                <h3 className="text-[16px] font-bold leading-snug mb-2">{e.title}</h3>
                <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: "#67786D" }}>{e.one_liner}</p>
                <div className="flex items-center justify-between border-t border-dashed pt-3" style={{ borderColor: "#DDE5DC" }}>
                  <span className="text-[11px] font-semibold" style={{ color: "#8a978d" }}>📌 {e.stat}</span>
                  <span className="text-[12px] font-extrabold text-accent">Read →</span>
                </div>
              </Link>
            );
          })}
        </div>

        {!showAll && remaining > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="block mx-auto mt-8 bg-white border-[1.5px] border-accent text-accent font-extrabold text-sm px-8 py-3 rounded-full hover:bg-accent hover:text-white transition-colors cursor-pointer"
          >
            Load {remaining} more exams ↓
          </button>
        )}

        {/* TOOLS STRIP */}
        <div className="mt-14 rounded-[22px] p-[34px_38px] flex items-center justify-between gap-6 flex-col md:flex-row" style={{ background: "linear-gradient(120deg, #0E2418, #1B6B4A)" }}>
          <div>
            <h2 className="text-white text-[21px] font-extrabold mb-1.5">Prep smarter with free exam tools.</h2>
            <p className="text-[13.5px] max-w-[480px] leading-relaxed" style={{ color: "#BFE0CE" }}>Photo and signature resizer, per-exam document checklists, and eligibility checkers. Built for Indian exam forms.</p>
          </div>
          <Link href="/tools" className="bg-white font-extrabold text-sm px-6 py-3.5 rounded-xl whitespace-nowrap" style={{ color: "#0F3D2A" }}>
            Open Exam Tools →
          </Link>
        </div>
      </div>

      {/* BROWSE BY CATEGORY */}
      <div className="max-w-[1140px] mx-auto px-6 pt-14 pb-3">
        <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">Browse by category</h2>
        <p className="text-[13.5px] mb-5" style={{ color: "#67786D" }}>Each category groups all related exams so you can compare at a glance.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {FILTERS.filter((f) => f.key !== "all").map((f) => {
            const count = exams.filter((e) => e.category === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => { setFilter(f.key); setShowAll(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="bg-white border border-border rounded-xl px-3.5 py-3 text-[13px] font-bold flex justify-between items-center hover:border-accent transition-colors cursor-pointer text-left"
              >
                <span>{f.icon} {f.label}</span>
                <span className="text-[11px] text-white bg-accent rounded-full px-2 py-0.5 font-extrabold">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
