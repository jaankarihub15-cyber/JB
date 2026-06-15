"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Article = {
  slug: string;
  title: string;
  one_liner: string;
  tags: string[];
  read_time: string;
  category: string;
};

const FILTERS = [
  { key: "all", icon: "📊", label: "All" },
  { key: "investing", icon: "💰", label: "Investing" },
  { key: "tax", icon: "🧾", label: "Tax Saving" },
  { key: "insurance", icon: "🛡️", label: "Insurance" },
  { key: "savings", icon: "🏦", label: "Savings" },
  { key: "loans", icon: "🏠", label: "Loans" },
  { key: "banking", icon: "💳", label: "Banking" },
];

const TAG_TO_CATEGORY: Record<string, string> = {
  "SIP": "investing", "Mutual Funds": "investing", "Demat Account": "investing",
  "Stock Investing": "investing", "Gold Investment": "investing", "Gold ETF": "investing",
  "ELSS": "investing", "FD": "investing", "Fixed Deposit": "investing",
  "Investing Basics": "investing",
  "Tax Saving": "tax", "80C": "tax", "Income Tax": "tax", "ITR": "tax",
  "Section 80D": "tax", "HRA Exemption": "tax", "House Rent Allowance": "tax",
  "advance tax calculator 2026": "tax", "advance tax due dates india": "tax",
  "Health Insurance": "insurance", "Mediclaim": "insurance",
  "Term Insurance": "insurance", "Life Insurance": "insurance",
  "PPF": "savings", "NPS": "savings", "EPF": "savings",
  "Provident Fund": "savings", "Savings": "savings",
  "Gratuity": "savings", "Payment of Gratuity Act": "savings",
  "Home Loan": "loans", "Mortgage": "loans", "Education Loan": "loans",
  "Student Loan": "loans", "Personal Loan": "loans", "Unsecured Debt": "loans",
  "PMAY CLSS subsidy scheme": "loans", "affordable housing guide India 2026": "loans",
  "CIBIL": "banking", "Credit Score": "banking",
  "UPI": "banking", "Digital Payment": "banking",
};

const POPULAR_SLUGS = new Set(["what-is-sip", "how-to-file-itr", "section-80c-guide", "health-insurance-guide", "ppf-guide", "what-is-mutual-fund"]);

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "investing": { bg: "#EAF4EE", text: "#1B6B4A" },
  "tax": { bg: "#FBF3E7", text: "#A8742E" },
  "insurance": { bg: "#EEF1FB", text: "#3D55B8" },
  "savings": { bg: "#F0EEFB", text: "#5B44C0" },
  "loans": { bg: "#FBF0EC", text: "#B5512E" },
  "banking": { bg: "#F4ECF8", text: "#7A3DA8" },
};

function getCategoryLabel(key: string) {
  return FILTERS.find((f) => f.key === key)?.label || key;
}

function getTagColor(tag: string) {
  const cat = TAG_TO_CATEGORY[tag];
  return CATEGORY_COLORS[cat] || { bg: "#F3F4F6", text: "#4B5563" };
}

export function PaisaHubClient({ articles }: { articles: Article[] }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = articles;
    if (filter !== "all") list = list.filter((a) => a.category === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.one_liner.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    // Sort: popular first, then alphabetical
    return list.sort((a, b) => {
      const ap = POPULAR_SLUGS.has(a.slug) ? 0 : 1;
      const bp = POPULAR_SLUGS.has(b.slug) ? 0 : 1;
      return ap - bp || a.title.localeCompare(b.title);
    });
  }, [articles, filter, query]);

  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? filtered : filtered.slice(0, 9);
  const remaining = filtered.length - 9;

  return (
    <>
      {/* HERO */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(150deg, #0E2418, #0F3D2A 70%, #1B6B4A)" }}>
        <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, transparent 0 31px, rgba(255,255,255,.03) 31px 32px)" }} />
        <div className="max-w-[1140px] mx-auto px-6 pt-[52px] pb-[96px] relative">
          <div className="text-[12.5px] font-semibold mb-4" style={{ color: "#8FB8A2" }}>
            Home / <span style={{ color: "#DFF3E8" }}>Paisa Guide</span>
          </div>
          <h1 className="text-white font-extrabold tracking-tight mb-3" style={{ fontSize: "clamp(30px, 4vw, 42px)", letterSpacing: "-.8px" }}>
            {articles.length} money guides. <span style={{ color: "#9FE2BE" }}>Plain language.</span>
          </h1>
          <p className="max-w-[560px] leading-relaxed mb-6" style={{ color: "#BFDCCB", fontSize: "15.5px" }}>
            Tax saving, investing, insurance, loans. Every article explains the rules, the math, and the catch. No jargon, no fluff.
          </p>
          <div className="flex items-center bg-white rounded-2xl p-[7px] pl-[18px] max-w-[540px]" style={{ boxShadow: "0 16px 40px rgba(0,0,0,.25)" }}>
            <span className="text-[16px] mr-2.5">🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search... e.g. PPF, health insurance, SIP, 80C"
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
            <span className="text-[11px] font-extrabold tracking-[.08em] uppercase mr-1 min-w-[64px]" style={{ color: "#8a978d" }}>Topic</span>
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
            Showing <span className="text-accent">{filtered.length} articles</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {visible.map((a) => {
            const isPopular = POPULAR_SLUGS.has(a.slug);
            return (
              <Link
                key={a.slug}
                href={`/paisa/${a.slug}`}
                className={`relative bg-card border border-border rounded-[18px] p-[22px] transition-all hover:shadow-lg hover:-translate-y-[3px] ${isPopular ? "ring-0" : ""}`}
              >
                {isPopular && (
                  <div className="absolute -top-[11px] left-[18px] text-[9.5px] font-extrabold tracking-[.08em] px-[11px] py-[5px] rounded-full" style={{ background: "#E8A33D", color: "#3D2A07" }}>
                    🔥 POPULAR
                  </div>
                )}
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  {a.tags.slice(0, 2).map((t) => {
                    const c = getTagColor(t);
                    return (
                      <span key={t} className="text-[10.5px] font-extrabold tracking-[.06em] px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.text }}>
                        {t}
                      </span>
                    );
                  })}
                </div>
                <h3 className="text-[16px] font-bold leading-snug mb-2">{a.title}</h3>
                <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: "#67786D" }}>{a.one_liner}</p>
                <div className="flex items-center justify-between border-t border-dashed pt-3" style={{ borderColor: "#DDE5DC" }}>
                  <span className="text-[11px] font-semibold" style={{ color: "#8a978d" }}>📖 {a.read_time} read</span>
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
            Load {remaining} more articles ↓
          </button>
        )}

        {/* CALCULATOR STRIP */}
        <div className="mt-14 rounded-[22px] p-[34px_38px] flex items-center justify-between gap-6 flex-col md:flex-row" style={{ background: "linear-gradient(120deg, #0E2418, #1B6B4A)" }}>
          <div>
            <h2 className="text-white text-[21px] font-extrabold mb-1.5">Run the numbers before you decide.</h2>
            <p className="text-[13.5px] max-w-[480px] leading-relaxed" style={{ color: "#BFE0CE" }}>Free SIP, EMI, tax, and gratuity calculators. Built for Indian rules, updated for 2026.</p>
          </div>
          <Link href="/calculator" className="bg-white font-extrabold text-sm px-6 py-3.5 rounded-xl whitespace-nowrap" style={{ color: "#0F3D2A" }}>
            Open Calculators →
          </Link>
        </div>
      </div>

      {/* BROWSE BY TOPIC */}
      <div className="max-w-[1140px] mx-auto px-6 pt-14 pb-3">
        <h2 className="text-[22px] font-extrabold tracking-tight mb-1.5">Browse by topic</h2>
        <p className="text-[13.5px] mb-5" style={{ color: "#67786D" }}>Each topic groups all related guides so you get the full picture.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {FILTERS.filter((f) => f.key !== "all").map((f) => {
            const count = articles.filter((a) => a.category === f.key).length;
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
