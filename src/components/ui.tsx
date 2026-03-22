"use client";

import { useState } from "react";

// ============================================
// STATUS BADGE
// ============================================
export function Badge({
  status,
  children,
}: {
  status: "active" | "upcoming" | "closed";
  children: React.ReactNode;
}) {
  const colors = {
    active: "bg-accent-light text-accent",
    upcoming: "bg-orange-light text-orange",
    closed: "bg-red-light text-red",
  };
  const dotColors = {
    active: "bg-accent",
    upcoming: "bg-orange",
    closed: "bg-red",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${colors[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status]}`} />
      {children}
    </span>
  );
}

// ============================================
// TAG
// ============================================
export function Tag({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium text-text-secondary bg-tag-bg ${className}`}
    >
      {children}
    </span>
  );
}

// ============================================
// SECTION HEADING
// ============================================
export function SectionHeading({
  icon,
  children,
}: {
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className="heading text-[21px] font-normal text-text flex items-center gap-2.5 mt-8 mb-4">
      <span className="text-lg">{icon}</span>
      {children}
    </h2>
  );
}

// ============================================
// INFO ROW
// ============================================
export function InfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-border gap-3">
      <span className="text-[13px] text-text-secondary shrink-0 min-w-[110px]">
        {label}
      </span>
      <span
        className={`text-[13px] text-right ${
          highlight ? "font-semibold text-accent" : "text-text"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// ============================================
// STEP CARD
// ============================================
export function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3.5 py-3">
      <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-[13px] font-bold shrink-0">
        {number}
      </div>
      <div>
        <div className="text-[13px] font-semibold text-text mb-1">{title}</div>
        <div className="text-[12px] text-text-secondary leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
}

// ============================================
// FAQ ACCORDION
// ============================================
export function FAQ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-3 text-left text-[13px] font-medium text-text gap-3 cursor-pointer"
      >
        <span className="leading-relaxed">{question}</span>
        <span
          className={`text-base text-text-muted shrink-0 transition-transform duration-200 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="pb-3 text-[12px] text-text-secondary leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

// ============================================
// HERO BANNER
// ============================================
export function HeroBanner({
  title,
  subtitle,
  icon,
  gradient,
  stats,
  badge,
  badgeStatus = "active",
  updatedDate = "Mar 2026",
}: {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  stats?: { label: string; value: string }[];
  badge?: string;
  badgeStatus?: "active" | "upcoming" | "closed";
  updatedDate?: string;
}) {
  return (
    <div
      className="rounded-2xl p-6 text-white mb-5 relative overflow-hidden"
      style={{ background: gradient }}
    >
      <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 right-10 w-20 h-20 rounded-full bg-white/4" />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          {badge && <Badge status={badgeStatus}>{badge}</Badge>}
          <span className="text-[11px] opacity-70">Updated: {updatedDate}</span>
        </div>
        <div className="text-[26px] mb-1.5">{icon}</div>
        <h1 className="heading text-2xl font-normal mb-1.5 leading-tight">
          {title}
        </h1>
        <p className="text-[13px] opacity-85 leading-relaxed">{subtitle}</p>
        {stats && (
          <div className="flex gap-6 mt-4 pt-4 border-t border-white/20 flex-wrap">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-[10px] opacity-70 mb-0.5">{s.label}</div>
                <div className="text-base font-bold">{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// BREADCRUMB
// ============================================
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="flex items-center gap-1.5 mb-4 flex-wrap text-[11px] text-text-muted">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-border">›</span>}
          {item.href ? (
            <a
              href={item.href}
              className="hover:text-text-secondary underline underline-offset-2 decoration-border"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-text-secondary font-medium">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ============================================
// CARD WRAPPER
// ============================================
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card px-4 py-1 ${className}`}>{children}</div>
  );
}

// ============================================
// ALERT BOX
// ============================================
export function AlertBox({
  text,
  type = "warning",
}: {
  text: string;
  type?: "warning" | "info";
}) {
  const styles = {
    warning: "bg-orange-light text-orange",
    info: "bg-blue-light text-blue",
  };
  const icons = { warning: "⚠️", info: "ℹ️" };
  return (
    <div className={`mt-3.5 p-3 rounded-lg flex gap-2.5 items-start ${styles[type]}`}>
      <span className="text-sm">{icons[type]}</span>
      <span
        className="text-[12px] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}
