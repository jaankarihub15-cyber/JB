"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { states, schemeCategories, type StateKey } from "@/lib/categories";

interface Scheme {
  slug: string;
  title: string;
  category?: string;
  state?: string;
  isCentral?: boolean;
  hero?: {
    icon?: string;
    one_liner?: string;
    stats?: Array<{ label: string; value: string }>;
  };
}

interface Props {
  schemes: Scheme[];
  showStateFilter?: boolean;
  showCategoryFilter?: boolean;
  defaultSort?: "reach" | "name" | "state";
}

// Extract numeric value from stat string for sorting (e.g., "2.4 crore" -> 2400000)
function parseReachNumber(value: string): number {
  if (!value) return 0;
  const v = value.toLowerCase().replace(/[,₹rs\s]/g, "");
  const num = parseFloat(v.replace(/[^\d.]/g, ""));
  if (isNaN(num)) return 0;
  if (v.includes("crore") || v.includes("cr")) return num * 10000000;
  if (v.includes("lakh") || v.includes("l")) return num * 100000;
  if (v.includes("k")) return num * 1000;
  return num;
}

// Find the "reach" stat (beneficiaries, count, etc.) from stats array
function findReachStat(stats?: Array<{ label: string; value: string }>) {
  if (!stats || stats.length === 0) return null;
  const reachKeywords = ["beneficiar", "achieved", "reach", "current", "target"];
  for (const s of stats) {
    const labelLower = (s.label || "").toLowerCase();
    if (reachKeywords.some(k => labelLower.includes(k))) return s;
  }
  // Fall back to second stat if available
  return stats[1] || null;
}

// Find the "amount" stat (monthly, annual, benefit)
function findAmountStat(stats?: Array<{ label: string; value: string }>) {
  if (!stats || stats.length === 0) return null;
  // First stat is usually the primary amount/benefit
  return stats[0];
}

export function SchemeDashboard({
  schemes,
  showStateFilter = true,
  showCategoryFilter = false,
  defaultSort = "reach",
}: Props) {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all"); // all | central | state
  const [sortBy, setSortBy] = useState<"reach" | "name" | "state">(defaultSort);

  const filtered = useMemo(() => {
    let result = [...schemes];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        (s.hero?.one_liner || "").toLowerCase().includes(q)
      );
    }

    // Type filter
    if (typeFilter === "central") result = result.filter(s => s.isCentral);
    if (typeFilter === "state") result = result.filter(s => !s.isCentral && s.state);

    // State filter
    if (stateFilter !== "all") {
      result = result.filter(s => s.state === stateFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(s => s.category === categoryFilter);
    }

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "state") {
      result.sort((a, b) => {
        if (a.isCentral && !b.isCentral) return -1;
        if (!a.isCentral && b.isCentral) return 1;
        return (a.state || "").localeCompare(b.state || "");
      });
    } else {
      // Sort by reach (numeric)
      result.sort((a, b) => {
        const aReach = findReachStat(a.hero?.stats);
        const bReach = findReachStat(b.hero?.stats);
        return parseReachNumber(bReach?.value || "0") - parseReachNumber(aReach?.value || "0");
      });
    }

    return result;
  }, [schemes, search, stateFilter, categoryFilter, typeFilter, sortBy]);

  // Determine which states are present in this dataset
  const availableStates = useMemo(() => {
    const present = new Set<string>();
    schemes.forEach(s => { if (s.state) present.add(s.state); });
    return Object.values(states).filter(st => present.has(st.slug));
  }, [schemes]);

  // Determine which categories are present
  const availableCategories = useMemo(() => {
    const present = new Set<string>();
    schemes.forEach(s => { if (s.category) present.add(s.category); });
    return Object.values(schemeCategories).filter(c => present.has(c.slug));
  }, [schemes]);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-6">

      {/* Controls Bar - Desktop */}
      <div className="hidden md:grid gap-3 mb-4 pb-4 border-b border-border" style={{ gridTemplateColumns: "1fr auto auto auto auto" }}>
        <div className="relative">
          <svg width="14" height="14" viewBox="0 0 14 14" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${schemes.length} schemes...`}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-card-alt border border-border text-sm placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-card border border-border text-xs font-semibold cursor-pointer focus:outline-none focus:border-accent"
        >
          <option value="all">All types</option>
          <option value="central">Central only</option>
          <option value="state">State only</option>
        </select>

        {showStateFilter && availableStates.length > 0 && (
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-card border border-border text-xs font-semibold cursor-pointer focus:outline-none focus:border-accent"
          >
            <option value="all">All states</option>
            {availableStates.map(st => (
              <option key={st.slug} value={st.slug}>{st.label}</option>
            ))}
          </select>
        )}

        {showCategoryFilter && availableCategories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-card border border-border text-xs font-semibold cursor-pointer focus:outline-none focus:border-accent"
          >
            <option value="all">All categories</option>
            {availableCategories.map(c => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
        )}

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 rounded-lg bg-card border border-border text-xs font-semibold cursor-pointer focus:outline-none focus:border-accent"
        >
          <option value="reach">Sort: Reach</option>
          <option value="name">Sort: A-Z</option>
          <option value="state">Sort: State</option>
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

        {showStateFilter && availableStates.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
            <button
              onClick={() => setStateFilter("all")}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors ${
                stateFilter === "all" ? "bg-accent text-white border-accent" : "bg-card-alt text-text-secondary border-border"
              }`}
            >
              All
            </button>
            {availableStates.map(st => (
              <button
                key={st.slug}
                onClick={() => setStateFilter(st.slug)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors ${
                  stateFilter === st.slug ? "bg-accent text-white border-accent" : "bg-card-alt text-text-secondary border-border"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="text-text-muted font-semibold">{filtered.length} results</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-card border border-border text-[11px] font-semibold cursor-pointer focus:outline-none"
          >
            <option value="reach">↓ Reach</option>
            <option value="name">↓ A-Z</option>
            <option value="state">↓ State</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card-alt">
              <th className="text-left px-3 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border" colSpan={2}>Scheme</th>
              <th className="text-left px-3 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border">Type</th>
              <th className="text-left px-3 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border">Benefit</th>
              <th className="text-left px-3 py-3 text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border">Reach</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => {
              const amountStat = findAmountStat(s.hero?.stats);
              const reachStat = findReachStat(s.hero?.stats);
              const stateLabel = s.state ? (states[s.state as StateKey]?.label || s.state) : null;

              return (
                <tr key={s.slug} className="hover:bg-accent-light/30 transition-colors cursor-pointer" onClick={() => window.location.href = `/yojana/${s.slug}`}>
                  <td className="pl-3 py-4 border-b border-border align-top w-12">
                    <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-xl">
                      {s.hero?.icon || "📋"}
                    </div>
                  </td>
                  <td className="pl-2 pr-3 py-4 border-b border-border align-top">
                    <Link href={`/yojana/${s.slug}`} className="block">
                      <div className="font-bold text-text leading-snug text-sm">{s.title}</div>
                      {s.hero?.one_liner && (
                        <div className="text-xs text-text-muted mt-1 line-clamp-2 max-w-md leading-relaxed font-normal">{s.hero.one_liner}</div>
                      )}
                    </Link>
                  </td>
                  <td className="px-3 py-4 border-b border-border align-top whitespace-nowrap">
                    {s.isCentral ? (
                      <span className="inline-block px-2 py-1 text-[10px] font-bold rounded bg-accent-light text-accent">Central</span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-[10px] font-bold rounded bg-orange-light text-orange">{stateLabel}</span>
                    )}
                  </td>
                  <td className="px-3 py-4 border-b border-border align-top whitespace-nowrap">
                    {amountStat && (
                      <div>
                        <div className="text-accent font-extrabold text-base font-mono">{amountStat.value}</div>
                        <div className="text-[10px] text-text-muted mt-0.5">{amountStat.label}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4 border-b border-border align-top">
                    {reachStat && (
                      <div className="min-w-[140px]">
                        <div className="text-xs font-bold text-text">{reachStat.value}</div>
                        <div className="bg-card-alt h-1.5 rounded-full overflow-hidden mt-1.5">
                          <div className="bg-accent h-full rounded-full" style={{ width: `${Math.min(100, Math.log10(parseReachNumber(reachStat.value) + 1) * 12)}%` }}></div>
                        </div>
                        <div className="text-[10px] text-text-muted mt-1">{reachStat.label}</div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted text-sm">
            No schemes match your filters. Try clearing the search or selecting "All".
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2.5">
        {filtered.map(s => {
          const amountStat = findAmountStat(s.hero?.stats);
          const reachStat = findReachStat(s.hero?.stats);
          const stateLabel = s.state ? (states[s.state as StateKey]?.label || s.state) : null;

          return (
            <Link key={s.slug} href={`/yojana/${s.slug}`} className="block bg-card border border-border rounded-xl p-3.5 hover:border-accent transition-colors">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center text-lg shrink-0">
                  {s.hero?.icon || "📋"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-text leading-tight text-sm">{s.title}</div>
                    <div className="flex-shrink-0">
                      {s.isCentral ? (
                        <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded bg-accent-light text-accent">Central</span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded bg-orange-light text-orange">{stateLabel}</span>
                      )}
                    </div>
                  </div>
                  {s.hero?.one_liner && (
                    <div className="text-[11px] text-text-muted mt-1 line-clamp-1">{s.hero.one_liner}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-border">
                {amountStat && (
                  <div>
                    <div className="text-accent font-extrabold text-sm font-mono">{amountStat.value}</div>
                    <div className="text-[9px] text-text-muted mt-0.5">{amountStat.label}</div>
                  </div>
                )}
                {reachStat && (
                  <div className="text-right">
                    <div className="text-xs font-bold text-text">{reachStat.value}</div>
                    <div className="text-[9px] text-text-muted mt-0.5 uppercase tracking-wide">{reachStat.label}</div>
                  </div>
                )}
              </div>
              {reachStat && (
                <div className="bg-card-alt h-1 rounded-full overflow-hidden mt-2">
                  <div className="bg-accent h-full rounded-full" style={{ width: `${Math.min(100, Math.log10(parseReachNumber(reachStat.value) + 1) * 12)}%` }}></div>
                </div>
              )}
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted text-sm">
            No schemes match your filters.
          </div>
        )}
      </div>

    </div>
  );
}
