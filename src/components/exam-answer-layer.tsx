"use client";

import { useState } from "react";

// ── Click-only chip nav ──
export function ExamChipNav({ items }: { items: { id: string; text: string }[] }) {
  const [activeId, setActiveId] = useState("");

  if (!items || items.length < 2) return null;
  return (
    <nav className="lg:hidden sticky top-16 z-20 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-[1140px] mx-auto px-5 md:px-6">
        <div className="flex gap-1.5 flex-wrap py-2.5">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              onClick={() => setActiveId(it.id)}
              className={`text-[12px] font-semibold px-3.5 py-2 rounded-[10px] shrink-0 no-underline transition-colors ${
                activeId === it.id
                  ? "bg-accent-light text-accent"
                  : "text-text-muted hover:bg-card-alt"
              }`}
            >
              {it.text}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ── Dashboard strip (inside hero band, dark glass) ──
export function DashboardStrip({ facts }: { facts?: { label: string; value: string }[] }) {
  if (!facts || facts.length === 0) return null;
  return (
    <div className="grid grid-cols-4 gap-px rounded-[14px] overflow-hidden border border-white/10 mt-4 mb-2 bg-white/[0.06]">
      {facts.slice(0, 4).map((f) => {
        const isDeadline = /deadline|last date|closes/i.test(f.label);
        return (
          <div key={f.label} className="bg-black/15 px-2.5 py-3 md:px-4">
            <div className="text-[9.5px] font-semibold uppercase tracking-wide text-[#8FB8A2]">{f.label}</div>
            <div className={`text-[14px] md:text-[16px] font-extrabold mt-1 leading-tight ${isDeadline ? "text-[#FCA5A5]" : "text-white"}`}>{f.value}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Salary-first lead section ──
export function SalaryLead({ salary, posts }: {
  salary?: { intro?: string; label?: string; icon?: string; rows?: { post: string; amount: string }[] };
  posts?: { post: string; in_hand_salary: string }[];
}) {
  const rows = salary?.rows?.length ? salary.rows : (posts || []).map(p => ({ post: p.post, amount: p.in_hand_salary }));
  if (!rows.length) return null;
  return (
    <section id="salary" className="card px-5 md:px-6 py-5 mt-6 scroll-mt-40">
      <div className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold tracking-[0.07em] uppercase px-3 py-1.5 rounded-[10px] bg-accent-light text-accent mb-3">{salary?.icon || "💰"} {salary?.label || "Salary"}</div>
      <div className="text-[30px] font-extrabold text-accent leading-tight">{rows[0]?.amount || ""}</div>
      {salary?.intro && <p className="text-sm text-text-secondary leading-relaxed mt-1.5 mb-3">{salary.intro}</p>}
      <div className="mt-3">
        {rows.slice(0, 8).map((r, i) => (
          <div key={i} className="flex justify-between gap-3 py-2.5 border-t border-border text-sm">
            <span className="text-text-secondary" dangerouslySetInnerHTML={{ __html: r.post }} />
            <span className="font-semibold text-text whitespace-nowrap" dangerouslySetInnerHTML={{ __html: r.amount }} />
          </div>
        ))}
      </div>
      <div className="mt-3 p-3 rounded-xl bg-accent-light text-accent text-sm leading-relaxed">
        <b>💡</b> {salary?.label ? "These are typical ranges. Actual outcomes vary by branch, college and year." : salary?.intro ? "Check the full post table below for department-wise details." : "Salary varies by post and city HRA. Check the full table below."}
      </div>
    </section>
  );
}
