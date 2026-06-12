"use client";

import { useState } from "react";
import Link from "next/link";
import { FIX_PAGES } from "@/lib/fix-data";

type Filter = "all" | "id" | "epf" | "education";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All fixes" },
  { key: "id", label: "🪪 Aadhaar / PAN" },
  { key: "epf", label: "💼 EPF / PF" },
  { key: "education", label: "🎓 Certificates" },
];

export function FixHubClient() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const shown = FIX_PAGES.filter((p) => {
    if (filter !== "all" && p.group !== filter) return false;
    if (q.trim().length >= 2) {
      const hay = (p.h1 + " " + p.short + " " + p.intro).toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  });

  return (
    <>
      {/* Floating filter + search bar overlapping the band */}
      <div className="bg-card border border-border rounded-[18px] -mt-12 relative z-10 shadow-[0_14px_36px_rgba(20,45,33,0.10)] p-4 md:p-5">
        <div className="flex items-center bg-card-alt border border-border rounded-xl px-4 py-2.5 mb-3.5">
          <span className="text-[15px] mr-2.5">🔍</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Describe the problem... e.g. PAN name, EPF rejected, marksheet"
            className="flex-1 bg-transparent outline-none text-[14px] text-text placeholder:text-text-muted"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={
                "px-3.5 py-2 rounded-full text-[12.5px] font-semibold border transition-colors cursor-pointer " +
                (filter === f.key
                  ? "bg-accent border-accent text-white"
                  : "bg-card border-border text-text-secondary hover:border-accent/40")
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between mt-7 mb-4">
        <h2 className="text-[16px] font-extrabold">
          Showing <span className="text-accent">{shown.length} fix{shown.length === 1 ? "" : "es"}</span>
        </h2>
      </div>

      {/* Cards */}
      {shown.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-6 text-center text-[14px] text-text-secondary">
          No fix matches that yet. Try a broader word, or{" "}
          <Link href="/fix" className="text-accent underline">see all fixes</Link>.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3.5">
          {shown.map((p) => (
            <Link
              key={p.slug}
              href={`/fix/${p.slug}`}
              className={
                "relative bg-card border rounded-2xl p-5 transition-all hover:shadow-[0_12px_30px_rgba(27,107,74,0.12)] hover:-translate-y-0.5 " +
                (p.popular ? "border-accent/30" : "border-border hover:border-accent/40")
              }
            >
              {p.popular && (
                <span className="absolute -top-2.5 left-4 bg-[#E8A33D] text-[#3D2A07] text-[9.5px] font-extrabold tracking-[0.06em] px-2.5 py-1 rounded-full">
                  🔥 MOST COMMON
                </span>
              )}
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-accent-light flex items-center justify-center text-[20px] shrink-0">
                  {p.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-extrabold text-text leading-snug mb-1">{p.h1}</h3>
                  <p className="text-[12.5px] text-text-secondary leading-relaxed">{p.intro}</p>
                </div>
              </div>
              <div className="flex justify-end mt-3 pt-3 border-t border-dashed border-border">
                <span className="text-[12.5px] font-extrabold text-accent">Find my fix →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
