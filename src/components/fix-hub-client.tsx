"use client";

import { useState, createContext, useContext, ReactNode } from "react";
import Link from "next/link";
import { FIX_PAGES, DOC_LABELS } from "@/lib/fix-data";

type Filter = "all" | "id" | "epf" | "education";

const TYPE_FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "id", label: "🪪 Aadhaar / PAN" },
  { key: "epf", label: "💼 EPF / PF" },
  { key: "education", label: "🎓 Certificates" },
];

const MISMATCH_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "name", label: "Name" },
  { key: "dob", label: "Date of birth" },
  { key: "address", label: "Address" },
  { key: "gender", label: "Gender" },
];

const TAG_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  id: { bg: "#EAF4EE", color: "#1B6B4A", label: "AADHAAR / PAN" },
  epf: { bg: "#FBF0EC", color: "#B5512E", label: "EPF / PF" },
  education: { bg: "#EEF1FB", color: "#3D55B8", label: "CERTIFICATE" },
};

// shared state so search (in band) drives results (below band)
type Ctx = {
  q: string; setQ: (v: string) => void;
  typeF: Filter; setTypeF: (v: Filter) => void;
  mismatchF: string; setMismatchF: (v: string) => void;
};
const FixCtx = createContext<Ctx | null>(null);

export function FixHubProvider({ children }: { children: ReactNode }) {
  const [q, setQ] = useState("");
  const [typeF, setTypeF] = useState<Filter>("all");
  const [mismatchF, setMismatchF] = useState<string>("all");
  return (
    <FixCtx.Provider value={{ q, setQ, typeF, setTypeF, mismatchF, setMismatchF }}>
      {children}
    </FixCtx.Provider>
  );
}

function useFix() {
  const c = useContext(FixCtx);
  if (!c) throw new Error("FixCtx missing");
  return c;
}

// === SEARCH BAR (renders inside the green band) ===
export function FixHubBand() {
  const { q, setQ } = useFix();
  return (
    <div className="max-w-[540px]">
      <div className="flex items-center bg-white rounded-[16px] p-[7px] pl-[18px] shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
        <span className="text-[16px] mr-2.5 text-[#67786D]">🔍</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search fixes... e.g. PAN name, EPF rejected, marksheet"
          className="flex-1 bg-transparent outline-none text-[15px] text-[#243b30] placeholder:text-[#8a978d] min-w-0"
        />
        <button type="button" className="bg-accent text-white font-bold text-[14px] px-5 py-3 rounded-[11px] whitespace-nowrap">
          Search
        </button>
      </div>
    </div>
  );
}

// === FILTER CARD + RESULTS (overlaps band edge, below) ===
export function FixHubResults() {
  const { q, setQ, typeF, setTypeF, mismatchF, setMismatchF } = useFix();

  const shown = FIX_PAGES.filter((p) => {
    if (typeF !== "all" && p.group !== typeF) return false;
    if (mismatchF !== "all" && p.mismatch !== mismatchF) return false;
    if (q.trim().length >= 2) {
      const hay = (p.h1 + " " + p.short + " " + p.intro).toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });

  return (
    <>
      {/* filter card overlapping the band's bottom edge */}
      <div className="bg-card border border-border rounded-[18px] -mt-10 relative z-[2] shadow-[0_14px_36px_rgba(20,45,33,0.10)] px-5 py-[18px]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-extrabold tracking-[0.08em] text-[#8a978d] uppercase min-w-[64px] mr-1">Type</span>
          {TYPE_FILTERS.map((f) => (
            <FilterPill key={f.key} active={typeF === f.key} onClick={() => setTypeF(f.key)}>{f.label}</FilterPill>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-dashed border-[#EAEFE8]">
          <span className="text-[11px] font-extrabold tracking-[0.08em] text-[#8a978d] uppercase min-w-[64px] mr-1">Issue</span>
          {MISMATCH_FILTERS.map((f) => (
            <FilterPill key={f.key} active={mismatchF === f.key} onClick={() => setMismatchF(f.key)}>{f.label}</FilterPill>
          ))}
        </div>
      </div>

      {/* Showing + sort */}
      <div className="flex items-center justify-between mt-9 mb-5">
        <h2 className="text-[18px] font-extrabold">
          Showing <span className="text-accent">{shown.length} fix{shown.length === 1 ? "" : "es"}</span>
        </h2>
        <div className="text-[12.5px] text-text-muted font-semibold">Sort: <b className="text-text">Most common</b></div>
      </div>

      {/* cards */}
      {shown.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-6 text-center text-[14px] text-text-secondary">
          No fix matches that yet. Try a broader word, or{" "}
          <button type="button" onClick={() => { setQ(""); setTypeF("all"); setMismatchF("all"); }} className="text-accent underline">see all fixes</button>.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map((p) => {
            const tag = TAG_STYLE[p.group];
            return (
              <Link
                key={p.slug}
                href={`/fix/${p.slug}`}
                className={
                  "relative bg-card border rounded-[18px] p-5 transition-all hover:shadow-[0_12px_30px_rgba(27,107,74,0.12)] hover:-translate-y-[3px] " +
                  (p.popular ? "border-accent/30" : "border-border")
                }
              >
                {p.popular && (
                  <span className="absolute -top-2.5 left-4 bg-[#E8A33D] text-[#3D2A07] text-[9.5px] font-extrabold tracking-[0.06em] px-2.5 py-1 rounded-full">
                    🔥 MOST COMMON
                  </span>
                )}
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10.5px] font-extrabold tracking-[0.06em] px-2.5 py-1 rounded-full" style={{ background: tag.bg, color: tag.color }}>
                    {tag.label}
                  </span>
                  <span className="text-[18px]">{p.icon}</span>
                </div>
                <h3 className="text-[16px] font-extrabold text-text leading-snug mb-2">{p.h1}</h3>
                <p className="text-[12.5px] text-text-secondary leading-relaxed mb-4">{p.intro}</p>
                <div className="flex items-center justify-between border-t border-dashed border-border pt-3">
                  <div>
                    <div className="text-[10.5px] text-[#8a978d] font-semibold">Fix your</div>
                    <div className="text-[14px] font-extrabold text-accent">{DOC_LABELS[p.wrong]}</div>
                  </div>
                  <span className="text-[12.5px] font-extrabold text-accent">Find fix →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors cursor-pointer " +
        (active ? "bg-accent border-accent text-white" : "bg-card border-border text-text-secondary hover:border-accent/50")
      }
    >
      {children}
    </button>
  );
}
