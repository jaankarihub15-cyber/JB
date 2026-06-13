"use client";

import { Wallet, Users, Calendar, TrendingUp, FileText } from "lucide-react";

// Theme V2 exam "answer-first" layer: status pill, sticky anchor nav, answer
// router, fact tiles, salary-lead. Every block is optional and hides when its
// data is absent, so un-migrated exam pages render as a clean V2 article.
// Icons use lucide-react (the same library the rest of the site uses).

const ICONS: Record<string, any> = {
  cash: Wallet, book: FileText, "user-check": Users, chart: TrendingUp,
  calendar: Calendar, file: FileText, clipboard: FileText, list: FileText,
};

const STATUS: Record<string, { label: string; cls: string }> = {
  form_open: { label: "Form open", cls: "bg-[#1B6B4A] text-white" },
  upcoming: { label: "Upcoming", cls: "bg-white/10 border border-white/20 text-[#DFF3E8]" },
  notification_out: { label: "Notification out", cls: "bg-[#E6F1FB] text-[#185FA5]" },
  exam_soon: { label: "Exam soon", cls: "bg-[#FAEEDA] text-[#854F0B]" },
  result_out: { label: "Result out", cls: "bg-[#1B6B4A] text-white" },
};

export function StatusPill({ status }: { status?: string }) {
  if (!status || !STATUS[status]) return null;
  const s = STATUS[status];
  return (
    <span className={`inline-block text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full ${s.cls}`}>
      {s.label}
    </span>
  );
}

export function ExamStickyNav({ items }: { items: { id: string; label: string }[] }) {
  if (!items || items.length < 2) return null;
  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-border rounded-t-[18px] relative">
      <div className="flex gap-1.5 overflow-x-auto whitespace-nowrap px-5 md:px-6 py-2.5">
        {items.map((it, i) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className={`text-[12.5px] font-semibold px-3 py-1.5 rounded-full transition-colors shrink-0 no-underline ${
              i === 0 ? "bg-[#E1F5EE] text-[#1B6B4A]" : "text-[#5f5e5a] hover:bg-[#F4F3EF]"
            }`}
          >
            {it.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function AnswerRouter({
  items,
}: {
  items?: { icon: string; title: string; sub: string; anchor: string }[];
}) {
  if (!items || items.length === 0) return null;
  return (
    <section className="mt-6">
      <p className="text-[12.5px] font-semibold text-[#5f5e5a] mb-2.5">What do you need?</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
        {items.slice(0, 4).map((it) => {
          const Ic = ICONS[it.icon] || FileText;
          return (
            <a
              key={it.anchor}
              href={`#${it.anchor}`}
              className="block card p-3.5 hover:border-[#1B6B4A]/40 transition-colors no-underline"
            >
              <Ic className="w-[20px] h-[20px] text-[#1B6B4A]" aria-hidden="true" />
              <div className="text-[14px] font-semibold mt-1.5 text-text">{it.title}</div>
              <div className="text-[11.5px] text-[#5f5e5a] mt-0.5">{it.sub}</div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export function FactTiles({ facts }: { facts?: { label: string; value: string }[] }) {
  if (!facts || facts.length === 0) return null;
  return (
    <section className="mt-5">
      <p className="text-[12.5px] font-semibold text-[#5f5e5a] mb-2.5">Key facts</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
        {facts.slice(0, 4).map((f) => (
          <div key={f.label} className="bg-[#F4F3EF] rounded-xl px-3.5 py-3">
            <div className="text-[11px] text-[#5f5e5a]">{f.label}</div>
            <div className="text-[17px] font-extrabold text-[#1B6B4A] leading-tight mt-0.5">{f.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SalaryLead({
  salary,
  posts,
}: {
  salary?: { intro?: string; rows?: { post: string; amount: string }[] };
  posts?: { post: string; in_hand_salary: string }[];
}) {
  const rows =
    salary?.rows && salary.rows.length > 0
      ? salary.rows
      : (posts || []).map((p) => ({ post: p.post, amount: p.in_hand_salary }));
  if (rows.length === 0) return null;
  return (
    <section id="salary" className="card px-5 py-5 mt-6 scroll-mt-16">
      <h2 className="text-[16.5px] font-semibold mb-2.5 text-text">Salary (most asked)</h2>
      {salary?.intro && (
        <p className="text-[13.5px] text-text-secondary leading-[1.75] mb-3">{salary.intro}</p>
      )}
      <div>
        {rows.slice(0, 8).map((r, i) => (
          <div key={i} className="flex justify-between gap-3 py-2.5 border-t border-border text-[13px]">
            <span className="text-text-secondary" dangerouslySetInnerHTML={{ __html: r.post }} />
            <span className="font-semibold text-text whitespace-nowrap" dangerouslySetInnerHTML={{ __html: r.amount }} />
          </div>
        ))}
      </div>
    </section>
  );
}
