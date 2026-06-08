"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { examCategories } from "@/lib/categories";

interface Exam {
  slug: string;
  title: string;
  category?: string;
  hero?: {
    icon?: string;
    one_liner?: string;
    stats?: Array<{ label: string; value: string }>;
  };
}

interface Props {
  exams: Exam[];
  showCategoryFilter?: boolean;
  defaultSort?: "salary" | "vacancies" | "name";
}

// Parse vacancies/posts number for sorting (e.g., "12,256" -> 12256)
function parseVacancyNumber(value: string): number {
  if (!value) return 0;
  const v = value.toLowerCase().replace(/[,\s]/g, "");
  const num = parseFloat(v.replace(/[^\d.]/g, ""));
  if (isNaN(num)) return 0;
  if (v.includes("crore") || v.includes("cr")) return num * 10000000;
  if (v.includes("lakh") || v.includes("l")) return num * 100000;
  if (v.includes("k")) return num * 1000;
  return num;
}

// Parse salary - prefers higher number in range
function parseSalaryNumber(value: string): number {
  if (!value) return 0;
  const matches = value.match(/[\d,.]+/g);
  if (!matches) return 0;
  const lower = value.toLowerCase();
  let max = 0;
  matches.forEach(m => {
    let n = parseFloat(m.replace(/,/g, ""));
    if (lower.includes("lakh") || lower.includes(" l") || /[\dl]l\b/i.test(value)) {
      // Heuristic: if number > 10 and lakh present, assume lakhs
      if (n > 10) n = n * 1000;
      else n = n * 100000;
    } else if (lower.includes("k")) {
      n = n * 1000;
    }
    if (n > max) max = n;
  });
  return max;
}

// Find vacancies/posts stat
function findVacancyStat(stats?: Array<{ label: string; value: string }>) {
  if (!stats) return null;
  const keywords = ["vacanc", "post", "seat"];
  for (const s of stats) {
    if (keywords.some(k => (s.label || "").toLowerCase().includes(k))) return s;
  }
  return null;
}

// Find salary stat
function findSalaryStat(stats?: Array<{ label: string; value: string }>) {
  if (!stats) return null;
  const keywords = ["salary", "pay", "stipend"];
  for (const s of stats) {
    if (keywords.some(k => (s.label || "").toLowerCase().includes(k))) return s;
  }
  return null;
}

// Find a date stat (notification, exam, prelims)
function findDateStat(stats?: Array<{ label: string; value: string }>) {
  if (!stats) return null;
  const keywords = ["notification", "prelims", "exam", "tier 1", "date"];
  for (const s of stats) {
    if (keywords.some(k => (s.label || "").toLowerCase().includes(k))) return s;
  }
  return null;
}

const categoryColors: Record<string, string> = {
  "banking": "bg-blue-light text-blue",
  "ssc": "bg-accent-light text-accent",
  "upsc": "bg-orange-light text-orange",
  "state-psc": "bg-purple-light text-purple",
  "railway": "bg-blue-light text-blue",
  "teaching": "bg-accent-light text-accent",
  "medical": "bg-orange-light text-orange",
  "engineering": "bg-purple-light text-purple",
  "defense": "bg-orange-light text-orange",
  "other": "bg-card-alt text-text-muted",
};

export function ExamDashboard({
  exams,
  showCategoryFilter = true,
  defaultSort = "salary",
}: Props) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"salary" | "vacancies" | "name">(defaultSort);

  const filtered = useMemo(() => {
    let result = [...exams];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.hero?.one_liner || "").toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(e => e.category === categoryFilter);
    }

    // Year filter - searches stats for "2026" or "notif" keywords
    if (yearFilter !== "all") {
      result = result.filter(e => {
        const allStatsText = (e.hero?.stats || [])
          .map(s => `${s.label} ${s.value}`)
          .join(" ")
          .toLowerCase();
        if (yearFilter === "2026") return allStatsText.includes("2026");
        if (yearFilter === "open") return allStatsText.includes("2026") || allStatsText.includes("notification out");
        return true;
      });
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "vacancies") {
      result.sort((a, b) => {
        const aV = findVacancyStat(a.hero?.stats);
        const bV = findVacancyStat(b.hero?.stats);
        return parseVacancyNumber(bV?.value || "0") - parseVacancyNumber(aV?.value || "0");
      });
    } else {
      result.sort((a, b) => {
        const aS = findSalaryStat(a.hero?.stats);
        const bS = findSalaryStat(b.hero?.stats);
        return parseSalaryNumber(bS?.value || "0") - parseSalaryNumber(aS?.value || "0");
      });
    }

    return result;
  }, [exams, search, categoryFilter, yearFilter, sortBy]);

  // Categories present in current dataset
  const availableCategories = useMemo(() => {
    const present = new Set<string>();
    exams.forEach(e => { if (e.category) present.add(e.category); });
    return Object.values(examCategories).filter(c => present.has(c.slug));
  }, [exams]);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-6">

      {/* Desktop controls */}
      <div className="hidden md:grid gap-3 mb-4 pb-4 border-b border-border" style={{ gridTemplateColumns: "1fr auto auto auto" }}>
        <div className="relative">
          <svg width="14" height="14" viewBox="0 0 14 14" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${exams.length} exams...`}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-card-alt border border-border text-sm placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
        </div>

        {showCategoryFilter && availableCategories.length > 1 && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-card border border-border text-xs font-semibold cursor-pointer focus:outline-none focus:border-accent"
          >
            <option value="all">All categories</option>
            {availableCategories.map(c => (
              <option key={c.slug} value={c.slug}>{c.short}</option>
            ))}
          </select>
        )}

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-card border border-border text-xs font-semibold cursor-pointer focus:outline-none focus:border-accent"
        >
          <option value="all">All years</option>
          <option value="2026">2026 exams</option>
          <option value="open">Open now</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 rounded-lg bg-card border border-border text-xs font-semibold cursor-pointer focus:outline-none focus:border-accent"
        >
          <option value="salary">Sort: Salary</option>
          <option value="vacancies">Sort: Vacancies</option>
          <option value="name">Sort: A-Z</option>
        </select>
      </div>

      {/* Mobile controls */}
      <div className="md:hidden space-y-2.5 mb-3 pb-3 border-b border-border">
        <div className="relative">
          <svg width="14" height="14" viewBox="0 0 14 14" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-card-alt border border-border text-sm placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
        </div>

        {showCategoryFilter && availableCategories.length > 1 && (
          <div>
            <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Category</div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
              <button
                onClick={() => setCategoryFilter("all")}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors ${
                  categoryFilter === "all" ? "bg-accent text-white border-accent" : "bg-card-alt text-text-secondary border-border"
                }`}
              >
                All
              </button>
              {availableCategories.map(c => (
                <button
                  key={c.slug}
                  onClick={() => setCategoryFilter(c.slug)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors ${
                    categoryFilter === c.slug ? "bg-accent text-white border-accent" : "bg-card-alt text-text-secondary border-border"
                  }`}
                >
                  {c.short}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Year</div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setYearFilter("all")}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors ${
                yearFilter === "all" ? "bg-accent text-white border-accent" : "bg-card-alt text-text-secondary border-border"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setYearFilter("2026")}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors ${
                yearFilter === "2026" ? "bg-accent text-white border-accent" : "bg-card-alt text-text-secondary border-border"
              }`}
            >
              2026
            </button>
            <button
              onClick={() => setYearFilter("open")}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors ${
                yearFilter === "open" ? "bg-accent text-white border-accent" : "bg-card-alt text-text-secondary border-border"
              }`}
            >
              Open now
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted font-semibold">{filtered.length} results</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-card border border-border text-[11px] font-semibold cursor-pointer focus:outline-none"
          >
            <option value="salary">↓ Salary</option>
            <option value="vacancies">↓ Vacancies</option>
            <option value="name">↓ A-Z</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card-alt">
              <th className="text-left px-3 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border" colSpan={2}>Exam</th>
              <th className="text-left px-3 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border">Type</th>
              <th className="text-left px-3 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border">Salary</th>
              <th className="text-left px-3 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border">Vacancies</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => {
              const salaryStat = findSalaryStat(e.hero?.stats);
              const vacancyStat = findVacancyStat(e.hero?.stats);
              const dateStat = findDateStat(e.hero?.stats);
              const catColor = e.category ? categoryColors[e.category] || "bg-card-alt text-text-muted" : "bg-card-alt text-text-muted";
              const catShort = e.category ? examCategories[e.category as keyof typeof examCategories]?.short || e.category : "Exam";

              return (
                <tr key={e.slug} className="hover:bg-accent-light/30 transition-colors cursor-pointer" onClick={() => window.location.href = `/exam/${e.slug}`}>
                  <td className="pl-3 py-4 border-b border-border align-top w-12">
                    <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-xl">
                      {e.hero?.icon || "📝"}
                    </div>
                  </td>
                  <td className="pl-2 pr-3 py-4 border-b border-border align-top">
                    <Link href={`/exam/${e.slug}`} className="block">
                      <div className="font-bold text-text leading-snug text-sm">{e.title.split(":")[0]}</div>
                      {e.hero?.one_liner && (
                        <div className="text-xs text-text-muted mt-1 line-clamp-2 max-w-md leading-relaxed font-normal">{e.hero.one_liner}</div>
                      )}
                    </Link>
                  </td>
                  <td className="px-3 py-4 border-b border-border align-top whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 text-[10px] font-bold rounded ${catColor}`}>{catShort}</span>
                  </td>
                  <td className="px-3 py-4 border-b border-border align-top whitespace-nowrap">
                    {salaryStat ? (
                      <div>
                        <div className="text-accent font-extrabold text-base font-mono">{salaryStat.value}</div>
                        <div className="text-[10px] text-text-muted mt-0.5">{salaryStat.label}</div>
                      </div>
                    ) : (
                      <span className="text-text-muted text-xs">-</span>
                    )}
                  </td>
                  <td className="px-3 py-4 border-b border-border align-top">
                    {vacancyStat ? (
                      <div className="min-w-[140px]">
                        <div className="text-sm font-bold text-text">{vacancyStat.value}</div>
                        <div className="text-[10px] text-text-muted mt-0.5">{vacancyStat.label}</div>
                        {dateStat && (
                          <div className="text-[10px] text-text-muted mt-1.5">📅 {dateStat.value}</div>
                        )}
                      </div>
                    ) : dateStat ? (
                      <div className="text-[11px] text-text-muted">📅 {dateStat.label}: {dateStat.value}</div>
                    ) : (
                      <span className="text-text-muted text-xs">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted text-sm">
            No exams match your filters.
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2.5">
        {filtered.map(e => {
          const salaryStat = findSalaryStat(e.hero?.stats);
          const vacancyStat = findVacancyStat(e.hero?.stats);
          const catColor = e.category ? categoryColors[e.category] || "bg-card-alt text-text-muted" : "bg-card-alt text-text-muted";
          const catShort = e.category ? examCategories[e.category as keyof typeof examCategories]?.short || e.category : "Exam";

          return (
            <Link key={e.slug} href={`/exam/${e.slug}`} className="block bg-card border border-border rounded-xl p-3.5 hover:border-accent transition-colors">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-lg shrink-0">
                  {e.hero?.icon || "📝"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-text leading-tight text-sm">{e.title.split(":")[0]}</div>
                    <div className="flex-shrink-0">
                      <span className={`inline-block px-2 py-0.5 text-[9px] font-bold rounded ${catColor}`}>{catShort}</span>
                    </div>
                  </div>
                  {e.hero?.one_liner && (
                    <div className="text-[11px] text-text-muted mt-1 line-clamp-1">{e.hero.one_liner}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-border">
                {salaryStat && (
                  <div>
                    <div className="text-accent font-extrabold text-sm font-mono">{salaryStat.value}</div>
                    <div className="text-[9px] text-text-muted mt-0.5">{salaryStat.label}</div>
                  </div>
                )}
                {vacancyStat && (
                  <div className="text-right">
                    <div className="text-xs font-bold text-text">{vacancyStat.value}</div>
                    <div className="text-[9px] text-text-muted mt-0.5 uppercase tracking-wide">{vacancyStat.label}</div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted text-sm">
            No exams match your filters.
          </div>
        )}
      </div>

    </div>
  );
}
