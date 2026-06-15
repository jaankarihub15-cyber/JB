"use client";

import { useState } from "react";

type PostAttrs = {
  salary: number;
  metro: number;
  desk: number;
  promo: number;
  power: number;
  stable: number;
};

type PostEntry = {
  post: string;
  dept: string;
  salary_range: string;
  level: number;
  attrs: PostAttrs;
  tags: string[];
};

type PostPreferenceData = {
  posts: PostEntry[];
};

const PRIORITIES: { key: keyof PostAttrs; icon: string; label: string }[] = [
  { key: "salary", icon: "💰", label: "High Salary" },
  { key: "metro", icon: "🏙️", label: "Metro Posting" },
  { key: "desk", icon: "🖥️", label: "Desk Job" },
  { key: "promo", icon: "📈", label: "Fast Promotion" },
  { key: "power", icon: "⚡", label: "Authority" },
  { key: "stable", icon: "🏠", label: "Less Transfers" },
];

export function ExamPostSorter({ data }: { data?: PostPreferenceData }) {
  const [active, setActive] = useState<Set<keyof PostAttrs>>(new Set());

  if (!data || !data.posts?.length) return null;

  const toggle = (key: keyof PostAttrs) => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const scored = data.posts.map((p) => {
    let score = 0;
    active.forEach((k) => { score += p.attrs[k] || 0; });
    return { ...p, score };
  });
  if (active.size > 0) scored.sort((a, b) => b.score - a.score);

  const matchedKeys = (attrs: PostAttrs) => {
    const m: string[] = [];
    active.forEach((k) => { if (attrs[k] >= 2) m.push(k); });
    return m;
  };

  const labelMap: Record<string, string> = {
    salary: "High salary", metro: "Metro likely", desk: "Desk job",
    promo: "Fast promo", power: "Authority", stable: "Less transfers",
  };

  return (
    <div className="card px-5 md:px-6 py-5 mt-4 scroll-mt-40">
      <div className="text-[10.5px] font-extrabold tracking-[0.07em] uppercase text-accent mb-1">🎯 Find Your Best Post</div>
      <p className="text-sm text-text-secondary mb-4">What matters most to you? Tap to toggle, posts re-sort instantly.</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {PRIORITIES.map((p) => (
          <button
            key={p.key}
            onClick={() => toggle(p.key)}
            className={`text-[12px] font-semibold px-3.5 py-2 rounded-xl border-[1.5px] transition-colors flex items-center gap-1.5 ${
              active.has(p.key)
                ? "bg-accent-light border-accent text-accent"
                : "border-border text-text hover:border-accent/40"
            }`}
          >
            <span>{p.icon}</span> {p.label}
          </button>
        ))}
      </div>

      <div>
        {scored.map((p, i) => {
          const isTop = active.size > 0 && i === 0;
          const matches = matchedKeys(p.attrs);
          return (
            <div
              key={p.post}
              className={`relative border rounded-[14px] p-4 mb-2.5 transition-colors ${
                isTop ? "border-accent bg-[#FAFFF8]" : "border-border"
              }`}
            >
              {isTop && (
                <div className="absolute -top-2 left-3 text-[10px] font-extrabold bg-accent text-white px-2.5 py-0.5 rounded-md">Best match</div>
              )}
              <div className="text-[14px] font-bold text-text">{p.post}</div>
              <div className="text-[12px] text-text-muted">{p.dept}</div>
              <div className="text-[13px] font-bold text-accent mt-1.5">{p.salary_range} · Level {p.level}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {p.tags.map((t) => (
                  <span key={t} className="text-[10px] font-semibold px-2 py-1 rounded-md bg-[#F5F5F2] text-text-muted">{t}</span>
                ))}
                {matches.map((k) => (
                  <span key={k} className="text-[10px] font-semibold px-2 py-1 rounded-md bg-accent-light text-accent">✓ {labelMap[k]}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 p-3 rounded-xl bg-[#F7F7F5] text-[11.5px] text-text-muted leading-relaxed">
        <b className="text-text">ℹ️</b> Pay level and department are from the official notification. Metro likelihood, promotion speed, and transfer frequency are approximate, based on officer experience and public forums. Actual posting depends on vacancy and cadre allocation.
      </div>
    </div>
  );
}
