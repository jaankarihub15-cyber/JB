// SSC CGL tools v1
"use client";

import { useState } from "react";

type CutoffRow = { category: string; year: number; score: number };
type CutoffData = {
  total_questions: number;
  marks_per_question: number;
  negative_per_wrong: number;
  cutoffs: CutoffRow[];
  safe_buffer?: number;
};

export function ExamScoreCalculator({ data }: { data?: CutoffData }) {
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");
  const [category, setCategory] = useState("");

  if (!data || !data.cutoffs?.length) return null;

  const totalQ = data.total_questions;
  const mpq = data.marks_per_question;
  const neg = data.negative_per_wrong;
  const buffer = data.safe_buffer || 20;

  const c = parseInt(correct) || 0;
  const w = parseInt(wrong) || 0;
  const skipped = totalQ - c - w;
  const valid = correct !== "" && wrong !== "" && category && c + w <= totalQ && c >= 0 && w >= 0;

  const gained = c * mpq;
  const lost = w * neg;
  const score = gained - lost;
  const maxScore = totalQ * mpq;

  // Get the latest cutoff for selected category
  const catCutoffs = data.cutoffs.filter((r) => r.category === category);
  const latest = catCutoffs.length > 0 ? catCutoffs.reduce((a, b) => (a.year > b.year ? a : b)) : null;
  const cutoff = latest?.score || 0;
  const safeTarget = cutoff + buffer;
  const margin = score - cutoff;
  const clears = margin >= 0;

  // How many more correct answers needed to reach safe target
  const shortBy = safeTarget - score;
  const extraNeeded = shortBy > 0 ? Math.ceil(shortBy / (mpq + neg)) : 0;

  const categories = [...new Set(data.cutoffs.map((r) => r.category))];
  // Get latest year cutoffs for all categories
  const latestYear = Math.max(...data.cutoffs.map((r) => r.year));
  const latestCutoffs = data.cutoffs.filter((r) => r.year === latestYear);

  return (
    <div className="card px-5 md:px-6 py-5 mt-4 scroll-mt-40">
      <div className="text-[10.5px] font-extrabold tracking-[0.07em] uppercase text-[#991B1B] mb-1">📊 Score Calculator</div>
      <p className="text-sm text-text-secondary mb-4">Enter your mock test or answer key results. We'll check against previous year cutoffs.</p>

      <div className="rounded-2xl border border-border p-5 mb-4">
        {/* Inputs */}
        <div className="text-[11px] font-bold text-text-muted uppercase tracking-wide mb-2">Your answers (out of {totalQ})</div>
        <div className="flex gap-3 mb-5">
          <div className="flex-1">
            <label className="block text-[12px] text-text-muted mb-1">✅ Correct</label>
            <input
              type="number" min="0" max={totalQ} value={correct}
              onChange={(e) => setCorrect(e.target.value)}
              placeholder="0"
              className="w-full text-[18px] font-bold px-3 py-2.5 rounded-xl border-[1.5px] border-border text-center outline-none focus:border-accent text-accent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[12px] text-text-muted mb-1">❌ Wrong</label>
            <input
              type="number" min="0" max={totalQ} value={wrong}
              onChange={(e) => setWrong(e.target.value)}
              placeholder="0"
              className="w-full text-[18px] font-bold px-3 py-2.5 rounded-xl border-[1.5px] border-border text-center outline-none focus:border-[#DC2626] text-[#DC2626]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[12px] text-text-muted mb-1">⬜ Skipped</label>
            <div className="w-full text-[18px] font-bold px-3 py-2.5 rounded-xl border-[1.5px] border-border text-center text-text-muted bg-[#F7F7F5]">
              {correct !== "" || wrong !== "" ? Math.max(0, skipped) : "-"}
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="text-[11px] font-bold text-text-muted uppercase tracking-wide mb-2">Your category</div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-[13px] font-semibold px-4 py-2.5 rounded-xl border-[1.5px] transition-colors ${
                category === cat
                  ? "bg-accent-light border-accent text-accent"
                  : "border-border text-text hover:border-accent/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {valid ? (
        <>
          {/* Math breakdown */}
          <div className="rounded-xl bg-[#F7F7F5] p-4 mb-4">
            <div className="text-[11px] font-bold text-text uppercase tracking-wide mb-2">Your calculation</div>
            <div className="flex justify-between text-[13px] py-1">
              <span className="text-text-muted">{c} correct x {mpq} marks</span>
              <span className="font-semibold text-accent">+{gained.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[13px] py-1">
              <span className="text-text-muted">{w} wrong x {neg} penalty</span>
              <span className="font-semibold text-[#DC2626]">-{lost.toFixed(2)}</span>
            </div>
            {skipped > 0 && (
              <div className="flex justify-between text-[13px] py-1">
                <span className="text-text-muted">{skipped} skipped</span>
                <span>0.00</span>
              </div>
            )}
            <div className="flex justify-between text-[16px] font-extrabold pt-2 mt-2 border-t-[1.5px] border-border">
              <span>Your Score</span>
              <span>{score.toFixed(2)} / {maxScore}</span>
            </div>
          </div>

          {/* Verdict */}
          <div className={`rounded-xl p-4 mb-4 border-[1.5px] ${clears ? "bg-[#F0FDF4] border-accent" : "bg-[#FEF2F2] border-[#FECACA]"}`}>
            <div className={`text-[18px] font-extrabold ${clears ? "text-accent" : "text-[#991B1B]"}`}>
              {clears ? `✅ You clear the ${category} cutoff` : `❌ Below the ${category} cutoff`}
            </div>
            <div className="text-[13px] text-text-muted mt-1">
              Your score: {score.toFixed(0)} | {category} cutoff ({latestYear}): {cutoff} | {clears ? `Margin: +${margin.toFixed(0)}` : `Short by: ${Math.abs(margin).toFixed(0)} marks`}
            </div>

            {/* Visual bar */}
            <div className="relative h-2 bg-[#E5E5E3] rounded-full mt-4 mb-2 overflow-visible">
              <div className="absolute h-full rounded-full bg-accent/20" style={{ width: `${Math.min(100, (score / maxScore) * 100)}%` }} />
              {/* Cutoff marker */}
              <div className="absolute top-[-4px] bottom-[-4px] w-[2px] rounded bg-[#DC2626]" style={{ left: `${(cutoff / maxScore) * 100}%` }} />
              {/* Score marker */}
              <div className="absolute top-[-4px] bottom-[-4px] w-[3px] rounded bg-accent" style={{ left: `${Math.min(100, (score / maxScore) * 100)}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-text-muted">
              <span>0</span>
              <span className="text-[#DC2626] font-semibold">Cutoff: {cutoff}</span>
              <span className="text-accent font-semibold">You: {score.toFixed(0)}</span>
              <span>{maxScore}</span>
            </div>
          </div>

          {/* Safe target advice */}
          <div className="rounded-xl p-3.5 bg-[#FEFCE8] border border-[#FDE68A] text-[12.5px] text-[#78350F] leading-relaxed mb-4">
            <b>🎯 Safe target for {category}:</b>{" "}
            {score >= safeTarget
              ? `${safeTarget}+. You're at ${score.toFixed(0)}, which is safe.`
              : `${safeTarget} (cutoff + ${buffer} buffer). You need ${extraNeeded} more correct answer${extraNeeded === 1 ? "" : "s"} (converting wrong to correct) to reach the safe zone.`
            }
          </div>

          {/* Cutoff table */}
          <div className="rounded-xl border border-border p-4">
            <div className="text-[12px] font-bold text-text mb-2">Cutoffs — Tier 1 ({latestYear})</div>
            {latestCutoffs.map((r) => (
              <div key={r.category} className={`flex justify-between text-[12.5px] py-2 border-t border-border/50 ${r.category === category ? "font-semibold" : ""}`}>
                <span className={r.category === category ? "text-accent" : "text-text-muted"}>{r.category} {r.category === category && "— you"}</span>
                <span className={r.category === category ? "text-accent font-bold" : "font-semibold"}>{r.score}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-6 text-text-muted text-sm">Enter your answers and select category to see your score</div>
      )}

      <div className="mt-3 p-3 rounded-xl bg-[#F7F7F5] text-[12px] text-text-muted leading-relaxed">
        <b className="text-text">💡</b> Cutoffs vary by year based on paper difficulty. Aim 15-20 marks above the cutoff to be safe across years.
      </div>
    </div>
  );
}
