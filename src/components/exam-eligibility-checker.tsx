"use client";

import { useState } from "react";

type PostRule = {
  post: string;
  min_age: number;
  max_age: number;
  education?: string;     // override; if absent, default applies
  note?: string;          // e.g. "Requires 60% in 12th Maths"
};

type EligibilityData = {
  reference_date?: string;           // e.g. "1 January 2026"
  default_education: string;         // e.g. "Bachelor's degree"
  relaxations: { category: string; years: number }[];
  posts: PostRule[];
};

const CATEGORIES = [
  { id: "gen", label: "General", years: 0 },
  { id: "obc", label: "OBC", years: 3 },
  { id: "sc_st", label: "SC/ST", years: 5 },
  { id: "pwd", label: "PwD", years: 10 },
  { id: "exsm", label: "Ex-SM", years: 3 },
];

export function ExamEligibilityChecker({ data }: { data?: EligibilityData }) {
  const [category, setCategory] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");

  if (!data || !data.posts?.length) return null;

  const relaxation = CATEGORIES.find((c) => c.id === category)?.years || 0;
  const ageNum = parseInt(age) || 0;
  const showResult = category && age && education && ageNum > 0;

  const results = showResult
    ? data.posts.map((p) => {
        const effectiveMax = p.max_age + relaxation;
        const ageOk = ageNum >= p.min_age && ageNum <= effectiveMax;
        const eduNeeded = p.education || data.default_education;
        const eduOk = education === "graduate" || (education === "final_year" && !p.education);
        const hasNote = !!p.note;
        return { ...p, effectiveMax, ageOk, eduOk, eduNeeded, eligible: ageOk && eduOk, hasNote };
      })
    : [];

  const eligible = results.filter((r) => r.eligible && !r.hasNote);
  const check = results.filter((r) => r.hasNote && r.ageOk);
  const ineligible = results.filter((r) => !r.ageOk || (!r.eduOk && !r.hasNote));

  return (
    <div className="card px-5 md:px-6 py-5 mt-4 scroll-mt-40">
      <div className="text-[10.5px] font-extrabold tracking-[0.07em] uppercase text-[#1E40AF] mb-1">✅ Am I Eligible?</div>
      <p className="text-sm text-text-secondary mb-4">Pick your details. We'll show which posts you can apply for.</p>

      {/* Category */}
      <div className="mb-4">
        <div className="text-[11px] font-bold text-text-muted uppercase tracking-wide mb-2">1. Your category</div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`text-[13px] font-semibold px-4 py-2.5 rounded-xl border-[1.5px] transition-colors ${
                category === c.id
                  ? "bg-accent-light border-accent text-accent"
                  : "border-border text-text hover:border-accent/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Age */}
      <div className="mb-4">
        <div className="text-[11px] font-bold text-text-muted uppercase tracking-wide mb-2">
          2. Your age {data.reference_date && <span className="normal-case font-normal">(as on {data.reference_date})</span>}
        </div>
        <input
          type="number"
          min="15"
          max="60"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter age"
          className="text-base font-semibold px-4 py-2.5 rounded-xl border-[1.5px] border-border w-24 text-center outline-none focus:border-accent"
        />
      </div>

      {/* Education */}
      <div className="mb-4">
        <div className="text-[11px] font-bold text-text-muted uppercase tracking-wide mb-2">3. Your education</div>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "graduate", label: "Graduate" },
            { id: "final_year", label: "Final Year" },
            { id: "below", label: "Below Graduate" },
          ].map((e) => (
            <button
              key={e.id}
              onClick={() => setEducation(e.id)}
              className={`text-[13px] font-semibold px-4 py-2.5 rounded-xl border-[1.5px] transition-colors ${
                education === e.id
                  ? "bg-accent-light border-accent text-accent"
                  : e.id === "below"
                    ? "border-border text-text-muted opacity-60"
                    : "border-border text-text hover:border-accent/40"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {education === "below" && (
        <div className="rounded-xl p-4 bg-[#FEE2E2] border border-[#FECACA]">
          <div className="text-[14px] font-bold text-[#991B1B]">❌ Not eligible</div>
          <div className="text-[13px] text-[#991B1B] mt-1">{data.default_education} is required for all posts in this exam.</div>
        </div>
      )}

      {showResult && education !== "below" && (
        <div className="rounded-xl p-4 bg-[#F0FDF4] border-[1.5px] border-accent">
          <div className="text-[14px] font-bold text-accent">
            {eligible.length > 0
              ? `✅ Eligible for ${eligible.length + check.length} of ${data.posts.length} posts`
              : `❌ Not eligible for any post at age ${age}`
            }
          </div>
          <div className="text-[12px] text-text-muted mt-1 mb-3">
            {CATEGORIES.find((c) => c.id === category)?.label}, age {age} → post limit + {relaxation} years relaxation
          </div>

          {eligible.map((r) => (
            <div key={r.post} className="flex justify-between text-[12.5px] py-1.5 border-t border-border/50">
              <span className="text-text-secondary">{r.post} (limit {r.max_age}+{relaxation}={r.effectiveMax})</span>
              <span className="font-bold text-accent shrink-0 ml-2">✓</span>
            </div>
          ))}

          {check.map((r) => (
            <div key={r.post} className="flex justify-between text-[12.5px] py-1.5 border-t border-border/50 bg-[#FEFCE8] -mx-4 px-4 rounded">
              <span className="text-text-secondary">{r.post} <span className="text-[#92400E]">({r.note})</span></span>
              <span className="font-bold text-[#92400E] shrink-0 ml-2">⚠</span>
            </div>
          ))}

          {ineligible.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border/50">
              <div className="text-[11px] font-bold text-text-muted mb-1">Over age limit:</div>
              {ineligible.map((r) => (
                <div key={r.post} className="text-[12px] text-text-muted py-1">
                  {r.post} (limit {r.max_age}+{relaxation}={r.effectiveMax}) — over by {ageNum - r.effectiveMax} {ageNum - r.effectiveMax === 1 ? "year" : "years"}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-3 p-3 rounded-xl bg-[#F7F7F5] text-[12px] text-text-muted leading-relaxed">
        <b className="text-text">💡</b> Age is calculated as on the reference date in the notification. Check the official notice for the exact date for your cycle.
      </div>
    </div>
  );
}
