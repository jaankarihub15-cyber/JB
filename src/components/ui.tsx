"use client";

import { useState } from "react";

export function Badge({ status, children }: { status: "active" | "upcoming" | "closed"; children: React.ReactNode }) {
  const colors = { active: "bg-accent-light text-accent", upcoming: "bg-orange-light text-orange", closed: "bg-red-light text-red" };
  const dotColors = { active: "bg-accent", upcoming: "bg-orange", closed: "bg-red" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${colors[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
      {children}
    </span>
  );
}

export function Tag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium text-text-secondary bg-tag-bg ${className}`}>{children}</span>;
}

export function SectionHeading({ icon, children }: { icon: string; children: React.ReactNode }) {
  return <h2 className="heading text-2xl font-normal text-text flex items-center gap-3 mt-10 mb-4"><span className="text-xl">{icon}</span>{children}</h2>;
}

export function InfoRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start py-3 border-b border-border gap-4">
      <span className="text-sm text-text-secondary shrink-0 min-w-[120px]">{label}</span>
      <span className={`text-sm text-right ${highlight ? "font-semibold text-accent" : "text-text"}`}>{value}</span>
    </div>
  );
}

export function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4 py-4">
      <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold shrink-0">{number}</div>
      <div>
        <div className="text-base font-semibold text-text mb-1">{title}</div>
        <div className="text-sm text-text-secondary leading-relaxed">{description}</div>
      </div>
    </div>
  );
}

export function FAQ({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-4 text-left text-base font-medium text-text gap-3 cursor-pointer">
        <span className="leading-relaxed">{question}</span>
        <span className={`text-xl text-text-muted shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <div className="pb-4 text-sm text-text-secondary leading-relaxed">{answer}</div>}
    </div>
  );
}

export function HeroBanner({ title, subtitle, icon, gradient, stats, badge, badgeStatus = "active", updatedDate = "Mar 2026" }: { title: string; subtitle: string; icon: string; gradient: string; stats?: { label: string; value: string }[]; badge?: string; badgeStatus?: "active" | "upcoming" | "closed"; updatedDate?: string }) {
  return (
    <div className="rounded-2xl p-7 text-white mb-6 relative overflow-hidden" style={{ background: gradient }}>
      <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 right-10 w-20 h-20 rounded-full bg-white/4" />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          {badge && <Badge status={badgeStatus}>{badge}</Badge>}
          <span className="text-xs opacity-70">Updated: {updatedDate}</span>
        </div>
        <div className="text-3xl mb-2">{icon}</div>
        <h1 className="heading text-3xl font-normal mb-2 leading-tight">{title}</h1>
        <p className="text-base opacity-85 leading-relaxed">{subtitle}</p>
        {stats && (
          <div className="flex gap-8 mt-5 pt-4 border-t border-white/20 flex-wrap">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-xs opacity-70 mb-0.5">{s.label}</div>
                <div className="text-xl font-bold">{s.value}</div>
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
          {i > 0 && <span className="text-border">›</span>}
          {item.href ? (
            <a href={item.href} className="hover:text-text-secondary underline underline-offset-2 decoration-border">{item.label}</a>
          ) : (
            <span className="text-text-secondary font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card px-5 py-2 ${className}`}>{children}</div>;
}

export function AlertBox({ text, type = "warning" }: { text: string; type?: "warning" | "info" }) {
  const styles = { warning: "bg-orange-light text-orange", info: "bg-blue-light text-blue" };
  const icons = { warning: "⚠️", info: "ℹ️" };
  return (
    <div className={`mt-4 p-4 rounded-xl flex gap-3 items-start ${styles[type]}`}>
      <span className="text-base">{icons[type]}</span>
      <span className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}
