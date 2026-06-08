"use client";

import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { allPages } from "@/lib/search-data";

type TabKey = "all" | "yojana" | "exam" | "calculator";

export function HeroSearch({
  totalSchemes,
  totalExams,
  totalCalculators,
}: {
  totalSchemes: number;
  totalExams: number;
  totalCalculators: number;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Tab filtering
  const tabFilter = (item: any) => {
    if (activeTab === "all") return true;
    if (activeTab === "yojana") return item.cat === "Yojana";
    if (activeTab === "exam") return item.cat === "Exam";
    if (activeTab === "calculator") return item.cat === "Calculator";
    return true;
  };

  // Live search
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return allPages
      .filter(tabFilter)
      .filter(p => p.s.includes(q))
      .slice(0, 8);
  }, [query, activeTab]);

  // Group results
  const grouped = useMemo(() => {
    const g: Record<string, typeof results> = {};
    results.forEach(r => {
      if (!g[r.cat]) g[r.cat] = [];
      g[r.cat].push(r);
    });
    return g;
  }, [results]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setShowResults(true);
  };

  return (
    <section className="pt-10 pb-8 md:pt-16 md:pb-12">
      <div className="text-center max-w-3xl mx-auto px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-light text-accent rounded-full text-xs font-bold mb-5">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          {totalSchemes + totalExams}+ verified guides, updated weekly
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text leading-[1.1] mb-4">
          Find any scheme, exam,<br className="hidden md:inline" /> or guide <span className="text-accent">instantly</span>
        </h1>
        <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mb-7">
          One search across {totalSchemes} schemes, {totalExams} exams, and {totalCalculators} calculators. No jargon, no clickbait.
        </p>

        {/* Tabs */}
        <div className="inline-flex bg-card-alt rounded-full p-1 mb-5 border border-border">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
              activeTab === "all" ? "bg-card text-accent shadow-sm" : "text-text-muted hover:text-text"
            }`}
          >
            All ({totalSchemes + totalExams + totalCalculators})
          </button>
          <button
            onClick={() => setActiveTab("yojana")}
            className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
              activeTab === "yojana" ? "bg-card text-accent shadow-sm" : "text-text-muted hover:text-text"
            }`}
          >
            Schemes ({totalSchemes})
          </button>
          <button
            onClick={() => setActiveTab("exam")}
            className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
              activeTab === "exam" ? "bg-card text-accent shadow-sm" : "text-text-muted hover:text-text"
            }`}
          >
            Exams ({totalExams})
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-bold transition-all ${
              activeTab === "calculator" ? "bg-card text-accent shadow-sm" : "text-text-muted hover:text-text"
            }`}
          >
            Tools ({totalCalculators})
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto" ref={wrapperRef}>
          <form onSubmit={handleSubmit} className="relative">
            <svg width="20" height="20" viewBox="0 0 20 20" className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              placeholder={
                activeTab === "yojana" ? "Search schemes (e.g. PM Kisan, Ayushman)..." :
                activeTab === "exam" ? "Search exams (e.g. APPSC, RBI, SSC)..." :
                activeTab === "calculator" ? "Search calculators (e.g. EMI, SIP, tax)..." :
                "Search schemes, exams, calculators..."
              }
              className="w-full pl-14 pr-32 py-4 md:py-5 rounded-2xl border-2 border-border bg-card text-base font-medium placeholder:text-text-muted focus:outline-none focus:border-accent focus:shadow-lg transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 md:px-6 py-2.5 md:py-3 bg-accent text-white text-sm font-bold rounded-xl hover:bg-accent-dark transition-colors"
            >
              Search
            </button>
          </form>

          {/* Autocomplete dropdown */}
          {showResults && query.length >= 2 && (
            <div className="absolute left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden text-left z-50">
              {results.length > 0 ? (
                <>
                  {Object.entries(grouped).map(([cat, items]) => (
                    <div key={cat}>
                      <div className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider bg-card-alt">
                        {cat}
                      </div>
                      {items.map((r) => (
                        <Link
                          key={r.url}
                          href={r.url}
                          onClick={() => { setShowResults(false); setQuery(""); }}
                          className="flex items-start gap-3 px-4 py-2.5 hover:bg-accent-light transition-colors border-b border-border last:border-b-0"
                        >
                          <div className="w-9 h-9 rounded-lg bg-card-alt flex items-center justify-center text-base shrink-0 mt-0.5">{r.icon}</div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-text line-clamp-1">{r.title}</div>
                            <div className="text-xs text-text-muted line-clamp-1 mt-0.5">{r.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                  <button
                    onClick={handleSubmit}
                    className="w-full px-4 py-3 bg-card-alt border-t border-border text-sm font-bold text-accent flex items-center justify-center gap-1.5 hover:bg-accent-light transition-colors"
                  >
                    View all results for &quot;{query}&quot; →
                  </button>
                </>
              ) : (
                <div className="px-4 py-6 text-center">
                  <div className="text-sm text-text-muted mb-1">No results for &quot;{query}&quot;</div>
                  <div className="text-xs text-text-muted">Try a different keyword or browse categories below</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Popular tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <span className="text-xs text-text-muted font-semibold">Try:</span>
          {["PM Kisan", "APPSC", "Ayushman Bharat", "Majhi Ladki Bahin", "EPF balance", "SSC CGL", "Income tax"].map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1 rounded-full text-[11px] font-semibold bg-card border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
