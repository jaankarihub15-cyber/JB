"use client";

import { useState, useEffect } from "react";

// ── Smart chip nav: tracks which section is at the top of the viewport ──
export function ExamChipNav({ items }: { items: { id: string; text: string }[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const OFFSET = 180; // header (64) + chip bar (~100) + buffer
    const handleScroll = () => {
      let current = "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= OFFSET) current = item.id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  if (!items || items.length < 2) return null;
  return (
    <nav className="lg:hidden sticky top-16 z-20 bg-white/95 backdrop-blur border-b border-border">
      <div className="max-w-[1140px] mx-auto px-5 md:px-6">
        <div className="flex gap-1.5 flex-wrap py-2.5">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
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

// ── Salary-first lead section ──
export function SalaryLead({ salary, posts }: {
  salary?: { intro?: string; rows?: { post: string; amount: string }[] };
  posts?: { post: string; in_hand_salary: string }[];
}) {
  const rows = salary?.rows?.length ? salary.rows : (posts || []).map(p => ({ post: p.post, amount: p.in_hand_salary }));
  if (!rows.length) return null;
  return (
    <section id="salary" className="card px-5 md:px-6 py-5 mt-6 scroll-mt-40">
      <div className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold tracking-[0.07em] uppercase px-3 py-1.5 rounded-[10px] bg-accent-light text-accent mb-3">💰 Salary</div>
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
        <b>💡</b> {salary?.intro ? "Check the full post table below for department-wise details." : "Salary varies by post and city HRA. Check the full table below."}
      </div>
    </section>
  );
}
