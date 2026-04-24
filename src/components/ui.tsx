"use client";

import { useState } from "react";

export function Badge({ status, children }: { status: "active" | "upcoming" | "closed"; children: React.ReactNode }) {
  const colors = { active: "bg-accent-light text-accent", upcoming: "bg-orange-light text-orange", closed: "bg-red-light text-red" };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold ${colors[status]}`}>
      {children}
    </span>
  );
}

export function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold text-text-secondary bg-tag-bg ${className}`}>{children}</span>;
}

export function SectionHeading({ icon, children }: { icon: string; children: React.ReactNode }) {
  return <h2 className="text-xl font-extrabold text-text flex items-center gap-2.5 mt-10 mb-4 tracking-tight"><span className="text-xl">{icon}</span>{children}</h2>;
}

export function InfoRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start py-3.5 border-b border-border gap-4">
      <span className="text-sm text-text-muted shrink-0">{label}</span>
      <span className={`text-sm text-right ${highlight ? "font-bold text-accent" : "text-text font-medium"}`} dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
}

export function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-3.5 py-4">
      <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center text-sm font-bold shrink-0">{number}</div>
      <div>
        <div className="text-sm font-bold text-text mb-1" dangerouslySetInnerHTML={{ __html: title }} />
        <div className="text-sm text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
  );
}

export function FAQ({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-4 text-left text-sm font-bold text-text gap-3 cursor-pointer">
        <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: question }} />
        <span className={`text-lg text-text-muted shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <div className="pb-4 text-sm text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: answer }} />}
    </div>
  );
}

export function HeroBanner({ title, subtitle, icon, gradient, stats, badge, badgeStatus = "active", updatedDate = "Mar 2026" }: { title: string; subtitle: string; icon: string; gradient: string; stats?: { label: string; value: string }[]; badge?: string; badgeStatus?: "active" | "upcoming" | "closed"; updatedDate?: string }) {
  return (
    <div className="rounded-2xl md:rounded-3xl p-5 md:p-7 text-white mb-6 relative overflow-hidden" style={{ background: gradient }}>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          {badge && <Badge status={badgeStatus}>{badge}</Badge>}
          <span className="text-xs opacity-60 font-medium">Updated: {updatedDate}</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl">{icon}</div>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight">{title}</h1>
        </div>
        <p className="text-sm opacity-85 leading-relaxed max-w-2xl" dangerouslySetInnerHTML={{ __html: subtitle }} />
        {stats && (
          <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-4 mt-5 pt-4 border-t border-white/15">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl px-4 py-2.5">
                <div className="text-[11px] opacity-60">{s.label}</div>
                <div className="text-base font-extrabold">{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 mb-5 flex-wrap text-sm text-text-muted">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-border">/</span>}
          {item.href ? (
            <a href={item.href} className="hover:text-text transition-colors">{item.label}</a>
          ) : (
            <span className="text-text-secondary font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card px-5 py-2.5 ${className}`}>{children}</div>;
}

export function AlertBox({ text, type = "warning" }: { text: string; type?: "warning" | "info" }) {
  const styles = { warning: "bg-orange-light text-orange", info: "bg-blue-light text-blue" };
  const icons = { warning: "⚠️", info: "ℹ️" };
  return (
    <div className={`mt-4 p-4 rounded-2xl flex gap-3 items-start ${styles[type]}`}>
      <span className="text-base">{icons[type]}</span>
      <span className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}
