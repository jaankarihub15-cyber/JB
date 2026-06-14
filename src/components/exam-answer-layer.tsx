"use client";
import { Wallet, Users, Calendar, TrendingUp, FileText } from "lucide-react";

const ICONS: Record<string, any> = {
  cash: Wallet, book: FileText, "user-check": Users, chart: TrendingUp,
  calendar: Calendar, file: FileText, clipboard: FileText, list: FileText,
};
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  form_open: { label: "Form open", cls: "bg-white/15 border border-white/25 text-white" },
  upcoming: { label: "Upcoming", cls: "bg-white/10 border border-white/20 text-[#DFF3E8]" },
  notification_out: { label: "Notification out", cls: "bg-[#E6F1FB] text-[#185FA5]" },
  exam_soon: { label: "Exam soon", cls: "bg-[#FAEEDA] text-[#854F0B]" },
  result_out: { label: "Result out", cls: "bg-[#1B6B4A] text-white" },
};

export function StatusPill({ status }: { status?: string }) {
  if (!status || !STATUS_MAP[status]) return null;
  const s = STATUS_MAP[status];
  return <span className={`inline-block text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full ${s.cls}`}>{s.label}</span>;
}

export function AnswerRouter({ items }: { items?: { icon: string; title: string; sub: string; anchor: string }[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-6 mb-2">
      <p className="text-[13px] font-semibold text-text-muted mb-2.5">What do you need?</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {items.slice(0, 4).map((it) => {
          const Ic = ICONS[it.icon] || FileText;
          return (
            <a key={it.anchor} href={`#${it.anchor}`} className="block card p-3.5 hover:border-accent/40 transition-colors no-underline">
              <Ic className="w-5 h-5 text-accent" />
              <div className="text-[14px] font-semibold mt-1.5 text-text">{it.title}</div>
              <div className="text-[11.5px] text-text-muted mt-0.5">{it.sub}</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function FactTiles({ facts }: { facts?: { label: string; value: string }[] }) {
  if (!facts || facts.length === 0) return null;
  return (
    <div className="mt-4 mb-2">
      <p className="text-[13px] font-semibold text-text-muted mb-2.5">Key facts</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {facts.slice(0, 4).map((f) => (
          <div key={f.label} className="bg-[#F4F3EF] rounded-xl px-3.5 py-3">
            <div className="text-[11px] text-text-muted">{f.label}</div>
            <div className="text-[17px] font-extrabold text-accent leading-tight mt-0.5">{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SalaryLead({ salary, posts }: {
  salary?: { intro?: string; rows?: { post: string; amount: string }[] };
  posts?: { post: string; in_hand_salary: string }[];
}) {
  const rows = salary?.rows?.length ? salary.rows : (posts || []).map(p => ({ post: p.post, amount: p.in_hand_salary }));
  if (!rows.length) return null;
  return (
    <div id="salary" className="card px-5 py-5 mt-5 scroll-mt-14">
      <h2 className="text-[17px] font-semibold mb-2.5 text-text">Salary (most asked)</h2>
      {salary?.intro && <p className="text-[13.5px] text-text-secondary leading-[1.75] mb-3">{salary.intro}</p>}
      {rows.slice(0, 8).map((r, i) => (
        <div key={i} className="flex justify-between gap-3 py-2.5 border-t border-border text-[13px]">
          <span className="text-text-secondary" dangerouslySetInnerHTML={{ __html: r.post }} />
          <span className="font-semibold text-text whitespace-nowrap" dangerouslySetInnerHTML={{ __html: r.amount }} />
        </div>
      ))}
    </div>
  );
}
