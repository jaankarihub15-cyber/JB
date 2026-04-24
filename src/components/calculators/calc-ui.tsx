"use client";

import { ReactNode } from "react";

export function CalcCard({ children }: { children: ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-6">
      {children}
    </div>
  );
}

export function SliderInput({ label, value, onChange, min, max, step = 1, prefix = "", suffix = "", formatValue }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number;
  prefix?: string; suffix?: string;
  formatValue?: (v: number) => string;
}) {
  const handleManualInput = (raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, "");
    const num = parseFloat(cleaned);
    if (!isNaN(num) && num >= 0) onChange(num);
    if (cleaned === "" || cleaned === "0") onChange(min);
  };
  const displayRaw = formatValue ? formatValue(value) : `${prefix}${value.toLocaleString("en-IN")}${suffix}`;
  const inputValue = value.toString();
  const sliderVal = Math.min(value, max);
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-text">{label}</label>
        <div className="flex items-center gap-1.5">
          {prefix && <span className="text-sm font-bold text-accent">{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={(e) => handleManualInput(e.target.value)}
            className="w-28 text-right bg-accent-light text-accent px-2 py-1 rounded-lg text-sm font-bold border-none outline-none focus:ring-2 focus:ring-accent/30"
          />
          {suffix && <span className="text-sm font-bold text-accent">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min} max={max} step={step} value={sliderVal}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-accent"
      />
      <div className="flex justify-between text-[11px] text-text-muted mt-1">
        <span>{prefix}{min.toLocaleString("en-IN")}{suffix}</span>
        <span>{prefix}{max.toLocaleString("en-IN")}{suffix}</span>
      </div>
    </div>
  );
}

export function ResultCard({ label, value, sub, accent = false }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${accent ? "bg-accent text-white" : "bg-card-alt"}`}>
      <div className={`text-[11px] mb-1 ${accent ? "opacity-70" : "text-text-muted"}`}>{label}</div>
      <div className={`text-xl font-extrabold ${accent ? "" : "text-text"}`}>{value}</div>
      {sub && <div className={`text-[11px] mt-0.5 ${accent ? "opacity-60" : "text-text-muted"}`}>{sub}</div>}
    </div>
  );
}

export function ResultRow({ results }: { results: { label: string; value: string; sub?: string; accent?: boolean }[] }) {
  return (
    <div className={`grid gap-3 mt-6 ${results.length === 3 ? "grid-cols-3" : results.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
      {results.map((r) => <ResultCard key={r.label} {...r} />)}
    </div>
  );
}

export function fmt(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}
