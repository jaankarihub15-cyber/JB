"use client";

import { useState } from "react";
import Link from "next/link";

export type CheckerScheme = {
  slug: string;
  title: string;
  desc: string;
  amount: string;
  icon: string;
  tag: string;
  filters: {
    gender: string[];
    ageMin: number;
    ageMax: number;
    occupation: string[];
    incomeMax: number;
    category: string[];
    states: string[];
  };
};

// States KK currently has dedicated schemes for (label + slug used in filters)
const STATES = [
  { v: "andhra-pradesh", l: "Andhra Pradesh" },
  { v: "goa", l: "Goa" },
  { v: "uttarakhand", l: "Uttarakhand" },
  { v: "jharkhand", l: "Jharkhand" },
  { v: "himachal-pradesh", l: "Himachal Pradesh" },
  { v: "delhi", l: "Delhi" },
  { v: "haryana", l: "Haryana" },
  { v: "assam", l: "Assam" },
  { v: "manipur", l: "Manipur" },
  { v: "bihar", l: "Bihar" },
  { v: "chhattisgarh", l: "Chhattisgarh" },
  { v: "karnataka", l: "Karnataka" },
  { v: "madhya-pradesh", l: "Madhya Pradesh" },
  { v: "maharashtra", l: "Maharashtra" },
  { v: "odisha", l: "Odisha" },
  { v: "rajasthan", l: "Rajasthan" },
  { v: "telangana", l: "Telangana" },
  { v: "uttar-pradesh", l: "Uttar Pradesh" },
  { v: "west-bengal", l: "West Bengal" },
  { v: "gujarat", l: "Gujarat" },
  { v: "punjab", l: "Punjab" },
  { v: "tamil-nadu", l: "Tamil Nadu" },
  { v: "kerala", l: "Kerala" },
  { v: "other", l: "Other state / Not listed" },
];

const questions = [
  { key: "state", q: "Which state are you in?", opts: STATES },
  {
    key: "gender",
    q: "What is your gender?",
    opts: [
      { v: "male", l: "\u{1F468} Male" },
      { v: "female", l: "\u{1F469} Female" },
      { v: "other", l: "\u{26A7} Other" },
    ],
  },
  {
    key: "age",
    q: "What is your age group?",
    opts: [
      { v: "0-10", l: "Below 10" },
      { v: "11-17", l: "11\u201317" },
      { v: "18-25", l: "18\u201325" },
      { v: "26-40", l: "26\u201340" },
      { v: "41-60", l: "41\u201360" },
      { v: "60+", l: "60+" },
    ],
  },
  {
    key: "occupation",
    q: "What is your occupation?",
    opts: [
      { v: "farmer", l: "\u{1F33E} Farmer" },
      { v: "salaried", l: "\u{1F4BC} Salaried" },
      { v: "self-employed", l: "\u{1F3EA} Self-Employed / Business" },
      { v: "labourer", l: "\u{1F477} Daily Wage / Labourer" },
      { v: "student", l: "\u{1F4DA} Student" },
      { v: "unemployed", l: "\u{1F50D} Unemployed / Homemaker" },
    ],
  },
  {
    key: "income",
    q: "Approximate annual family income?",
    opts: [
      { v: "100000", l: "Below \u20B91 lakh" },
      { v: "200000", l: "\u20B91\u20133 lakh" },
      { v: "500000", l: "\u20B93\u20135 lakh" },
      { v: "1000000", l: "\u20B95\u201310 lakh" },
      { v: "1800000", l: "\u20B910\u201318 lakh" },
      { v: "5000000", l: "Above \u20B918 lakh" },
    ],
  },
  {
    key: "category",
    q: "Your category? (helps find reserved schemes)",
    opts: [
      { v: "general", l: "General" },
      { v: "obc", l: "OBC" },
      { v: "sc", l: "SC" },
      { v: "st", l: "ST" },
      { v: "skip", l: "Prefer not to say" },
    ],
  },
];

const ageRanges: Record<string, [number, number]> = {
  "0-10": [0, 10],
  "11-17": [11, 17],
  "18-25": [18, 25],
  "26-40": [26, 40],
  "41-60": [41, 60],
  "60+": [60, 100],
};

export default function CheckerClient({ schemes }: { schemes: CheckerScheme[] }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [results, setResults] = useState<CheckerScheme[] | null>(null);

  const selectOption = (key: string, val: string) => {
    const nd = { ...data, [key]: val };
    setData(nd);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 150);
    } else {
      calculate(nd);
    }
  };

  const calculate = (d: Record<string, string>) => {
    const ages = ageRanges[d.age] || [18, 40];
    const inc = parseInt(d.income) || 500000;
    const userState = d.state;
    const matched = schemes.filter((s) => {
      const f = s.filters;
      const isCentral = f.states.includes("central");
      // State logic: central schemes show to everyone; state schemes only if user's state matches.
      // "other" state -> central only.
      if (!isCentral) {
        if (userState === "other") return false;
        if (!f.states.includes(userState)) return false;
      }
      if (!f.gender.includes("all") && !f.gender.includes(d.gender)) return false;
      if (ages[0] > f.ageMax || ages[1] < f.ageMin) return false;
      if (!f.occupation.includes("any") && !f.occupation.includes(d.occupation)) return false;
      if (inc > f.incomeMax) return false;
      if (
        d.category !== "skip" &&
        d.category &&
        !f.category.includes("all") &&
        !f.category.includes(d.category)
      )
        return false;
      return true;
    });
    // central first within results is fine; keep state schemes on top so KK strength shows
    matched.sort((a, b) => {
      const as = a.filters.states.includes("central") ? 1 : 0;
      const bs = b.filters.states.includes("central") ? 1 : 0;
      return as - bs;
    });
    setResults(matched);
  };

  const reset = () => {
    setStep(0);
    setData({});
    setResults(null);
  };

  // V2 RESULTS
  const [resultFilter, setResultFilter] = useState("all");

  const stateLabel = STATES.find((s) => s.v === data.state)?.l || data.state || "";
  const genderLabel = data.gender === "female" ? "Female" : data.gender === "male" ? "Male" : "Other";
  const ageLabel = data.age || "";

  // Compute not-eligible with reasons
  const getRejectReason = (s: CheckerScheme, d: Record<string, string>): string => {
    const f = s.filters;
    const ages = ageRanges[d.age] || [18, 40];
    const inc = parseInt(d.income) || 500000;
    const isCentral = f.states.includes("central");
    if (!isCentral && d.state === "other") return "State not listed";
    if (!isCentral && !f.states.includes(d.state)) return "Wrong state";
    if (!f.gender.includes("all") && !f.gender.includes(d.gender)) return "Gender mismatch";
    if (ages[0] > f.ageMax || ages[1] < f.ageMin) return "Age not in range";
    if (!f.occupation.includes("any") && !f.occupation.includes(d.occupation)) return "Occupation mismatch";
    if (inc > f.incomeMax) return "Income too high";
    if (d.category !== "skip" && d.category && !f.category.includes("all") && !f.category.includes(d.category)) return "Category mismatch";
    return "";
  };

  const notEligible = results ? schemes.filter((s) => !results.includes(s)).map((s) => ({ ...s, reason: getRejectReason(s, data) })).filter((s) => s.reason) : [];

  // Category filter on results
  const resultTags = results ? [...new Set(results.map((s) => s.tag))].sort() : [];
  const filteredResults = results && resultFilter !== "all" ? results.filter((s) => s.tag === resultFilter) : results;

  const STATE_COLORS: Record<string, { bg: string; text: string }> = {
    "andhra-pradesh": { bg: "#EAF4EE", text: "#1B6B4A" },
    "goa": { bg: "#FDF0E8", text: "#B5532A" },
    "uttarakhand": { bg: "#F0EDF7", text: "#5A3E8C" },
    "jharkhand": { bg: "#EDF7ED", text: "#2E6B3E" },
    "himachal-pradesh": { bg: "#EAF3F1", text: "#1F6E63" },
    "delhi": { bg: "#E8EEF9", text: "#2A4B8D" },
    "haryana": { bg: "#FBEEE6", text: "#9C4221" },
    "assam": { bg: "#EAF4EE", text: "#1B6B4A" },
    "manipur": { bg: "#EAF0F8", text: "#1E3A6E" },
    "bihar": { bg: "#EEF1FB", text: "#3D55B8" },
    "chhattisgarh": { bg: "#F0EEFB", text: "#5B44C0" },
    "karnataka": { bg: "#EAF4EE", text: "#1B6B4A" },
    "madhya-pradesh": { bg: "#FBF0EC", text: "#B5512E" },
    "maharashtra": { bg: "#FBF0EC", text: "#B5512E" },
    "odisha": { bg: "#F4ECF8", text: "#7A3DA8" },
    "rajasthan": { bg: "#FBF3E7", text: "#A8742E" },
    "telangana": { bg: "#FBF3E7", text: "#A8742E" },
    "uttar-pradesh": { bg: "#EEF1FB", text: "#3D55B8" },
    "west-bengal": { bg: "#EEF1FB", text: "#3D55B8" },
    "gujarat": { bg: "#FBF3E7", text: "#A8742E" },
    "punjab": { bg: "#EAF6EE", text: "#2E7D46" },
    "tamil-nadu": { bg: "#FDEEF0", text: "#B83D55" },
    "kerala": { bg: "#E8F5EC", text: "#2E8B57" },
    "central": { bg: "#FBF3E7", text: "#A8742E" },
  };

  const getStateColor = (states: string[]) => {
    const st = states.find((s) => s !== "central") || "central";
    return STATE_COLORS[st] || { bg: "#F3F4F6", text: "#4B5563" };
  };

  const getStateLabel = (states: string[]) => {
    const st = states.find((s) => s !== "central");
    if (!st) return "CENTRAL";
    return STATES.find((s) => s.v === st)?.l?.toUpperCase() || st.toUpperCase();
  };

  if (results) {
    return (
      <>
        {/* HERO */}
        <div className="relative overflow-hidden text-center" style={{ background: "linear-gradient(150deg, #0E2418, #0F3D2A 70%, #1B6B4A)" }}>
          <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, transparent 0 31px, rgba(255,255,255,.03) 31px 32px)" }} />
          <div className="max-w-[1140px] mx-auto px-6 pt-12 pb-20 relative">
            <div className="text-5xl mb-3">🎯</div>
            <h1 className="text-white font-extrabold tracking-tight mb-2" style={{ fontSize: "clamp(24px, 4vw, 34px)", letterSpacing: "-.5px" }}>
              You may be eligible for <span style={{ color: "#9FE2BE" }}>{results.length} {results.length === 1 ? "scheme" : "schemes"}</span>
            </h1>
            <p className="mx-auto max-w-[480px] leading-relaxed mb-5" style={{ color: "#BFDCCB", fontSize: "14.5px" }}>
              Based on your profile. Tap any scheme to learn more and apply.
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              {data.gender && <span className="text-[12px] font-bold px-3.5 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.18)", color: "#DFF3E8" }}>{data.gender === "female" ? "👩" : "👨"} {genderLabel}</span>}
              {stateLabel && <span className="text-[12px] font-bold px-3.5 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.18)", color: "#DFF3E8" }}>📍 {stateLabel}</span>}
              {ageLabel && <span className="text-[12px] font-bold px-3.5 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.18)", color: "#DFF3E8" }}>🎂 {ageLabel} years</span>}
            </div>
            <button onClick={reset} className="mt-4 text-[13px] font-bold cursor-pointer bg-transparent border-none" style={{ color: "#9FE2BE", borderBottom: "1px dashed #9FE2BE", paddingBottom: "1px" }}>← Change answers</button>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="bg-card border border-border rounded-[18px] -mt-10 relative z-[2] p-[16px_20px]" style={{ boxShadow: "0 14px 36px rgba(20,45,33,.10)" }}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold tracking-[.08em] uppercase mr-1" style={{ color: "#8a978d" }}>Show</span>
              <button onClick={() => setResultFilter("all")} className={`border-[1.5px] rounded-full px-3.5 py-[7px] text-[12.5px] font-semibold transition-colors cursor-pointer ${resultFilter === "all" ? "bg-accent border-accent text-white" : "border-border bg-white text-text-secondary hover:border-accent"}`}>
                All <span className="text-[10px] font-extrabold bg-accent text-white rounded-full px-1.5 py-0.5 ml-1">{results.length}</span>
              </button>
              {resultTags.map((tag) => {
                const count = results.filter((s) => s.tag === tag).length;
                return (
                  <button key={tag} onClick={() => setResultFilter(tag)} className={`border-[1.5px] rounded-full px-3.5 py-[7px] text-[12.5px] font-semibold transition-colors cursor-pointer ${resultFilter === tag ? "bg-accent border-accent text-white" : "border-border bg-white text-text-secondary hover:border-accent"}`}>
                    {tag} <span className="text-[10px] font-extrabold bg-accent text-white rounded-full px-1.5 py-0.5 ml-1">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="max-w-[1140px] mx-auto px-6 pt-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-extrabold">Showing <span className="text-accent">{(filteredResults || []).length} eligible schemes</span></h2>
          </div>

          {/* SCHEME CARDS */}
          <div className="flex flex-col gap-3">
            {(filteredResults || []).map((s, i) => {
              const sc = getStateColor(s.filters.states);
              const sl = getStateLabel(s.filters.states);
              return (
                <Link key={s.slug} href={`/yojana/${s.slug}`} className={`relative bg-card border border-border rounded-[18px] p-5 flex items-start gap-4 transition-all hover:shadow-lg hover:-translate-y-0.5 ${i === 0 ? "" : ""}`}>
                  {i === 0 && <div className="absolute -top-2.5 right-4 text-[9px] font-extrabold tracking-[.08em] px-2.5 py-1 rounded-full" style={{ background: "#E8A33D", color: "#3D2A07" }}>⭐ BEST MATCH</div>}
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] shrink-0" style={{ background: "#EAF4EE" }}>{s.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold tracking-[.05em] px-2.5 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{sl}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#F5F5F2", color: "#67786D" }}>{s.tag}</span>
                    </div>
                    <h3 className="text-[15px] font-bold leading-snug mb-1">{s.title}</h3>
                    <p className="text-[12.5px] leading-relaxed line-clamp-2" style={{ color: "#67786D" }}>{s.desc}</p>
                  </div>
                  <div className="text-right shrink-0 min-w-[90px]">
                    {s.amount && <div className="text-[18px] font-extrabold text-accent">{s.amount}</div>}
                    <span className="text-[12px] font-extrabold text-accent block mt-2">Read →</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {results.length === 0 && (
            <div className="p-10 text-center text-text-muted text-base">No matching schemes found. Try changing your answers.</div>
          )}

          {/* NOT ELIGIBLE */}
          {notEligible.length > 0 && (
            <div className="mt-10 pt-7" style={{ borderTop: "2px dashed #E4EAE2" }}>
              <h2 className="text-[16px] font-extrabold mb-1" style={{ color: "#67786D" }}>{notEligible.length} schemes you don&apos;t qualify for</h2>
              <p className="text-[12.5px] mb-4" style={{ color: "#aab5ad" }}>Showing why, so you know what to check if your situation changes.</p>
              <div className="flex flex-col gap-2">
                {notEligible.slice(0, 5).map((s) => (
                  <div key={s.slug} className="flex items-center gap-3 p-4 rounded-[14px] border border-border opacity-60" style={{ background: "#FAFBF9" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: "#FEF2F2" }}>{s.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-semibold" style={{ color: "#67786D" }}>{s.title}</h3>
                      <p className="text-[11.5px]" style={{ color: "#aab5ad" }}>{s.desc.slice(0, 80)}...</p>
                    </div>
                    <span className="text-[11px] font-bold shrink-0 whitespace-nowrap" style={{ color: "#DC6B5B" }}>{s.reason}</span>
                  </div>
                ))}
                {notEligible.length > 5 && (
                  <p className="text-[12px] text-center" style={{ color: "#aab5ad" }}>+ {notEligible.length - 5} more not shown</p>
                )}
              </div>
            </div>
          )}

          {/* CTA STRIP */}
          <div className="mt-12 rounded-[22px] p-[30px_34px] flex items-center justify-between gap-5 flex-col md:flex-row" style={{ background: "linear-gradient(120deg, #0E2418, #1B6B4A)" }}>
            <div>
              <h2 className="text-white text-[19px] font-extrabold mb-1">Save this result. Come back anytime.</h2>
              <p className="text-[13px] max-w-[400px] leading-relaxed" style={{ color: "#BFE0CE" }}>Bookmark this page. Our scheme database is updated weekly.</p>
            </div>
            <button onClick={reset} className="bg-white font-extrabold text-[13px] px-5 py-3 rounded-xl cursor-pointer border-none whitespace-nowrap" style={{ color: "#0F3D2A" }}>🔄 Check Again</button>
          </div>

          <div className="mt-4 p-4 rounded-xl text-center text-[12px] leading-relaxed" style={{ background: "#F5F5F2", color: "#8a978d" }}>
            This is an indicative check based on general eligibility criteria. Actual eligibility depends on documents, state rules, and specific scheme conditions. Always verify on the official portal.
          </div>
        </div>
      </>
    );
  }

  // QUESTIONNAIRE
  const cq = questions[step];
  const progress = (step / questions.length) * 100;

  return (
    <div className="max-w-[520px] mx-auto px-5 py-8">
      <div className="text-center mb-7">
        <div className="text-[40px] mb-2">{"\u{1F50D}"}</div>
        <h1 className="heading text-2xl font-normal text-text mb-1.5">
          Government Scheme Eligibility Checker
        </h1>
        <p className="text-sm text-text-secondary">
          Answer {questions.length} quick questions to find central and state government schemes you
          qualify for, including {schemes.length}+ schemes across India. Takes under a minute.
        </p>
      </div>

      <div className="h-1 bg-border rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-xs text-text-muted mb-2">
        Question {step + 1} of {questions.length}
      </div>
      <h2 className="text-lg font-semibold text-text mb-4">{cq.q}</h2>

      <div className="flex flex-col gap-2">
        {cq.opts.map((o) => (
          <button
            key={o.v}
            onClick={() => selectOption(cq.key, o.v)}
            className={`p-3.5 rounded-xl text-left text-base font-medium cursor-pointer transition-all border-[1.5px] ${
              data[cq.key] === o.v
                ? "bg-accent-light border-accent text-accent"
                : "bg-card border-border text-text hover:border-accent/40"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-4 px-4 py-2 text-sm text-text-muted cursor-pointer hover:text-text transition-colors"
        >
          {"\u2190"} Back
        </button>
      )}
    </div>
  );
}
