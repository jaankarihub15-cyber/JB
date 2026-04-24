"use client";
import { useState } from "react";
import { CalcCard, SliderInput, ResultRow, fmt } from "./calc-ui";

export function NpsCalc() {
  const [age, setAge] = useState(30);
  const [monthly, setMonthly] = useState(5000);
  const [returnRate, setReturnRate] = useState(10);
  const [annuityPct, setAnnuityPct] = useState(40);

  const years = 60 - age;
  const months = years * 12;
  const r = returnRate / 100 / 12;
  const totalInvested = monthly * months;
  const corpus = monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const annuityCorpus = corpus * (annuityPct / 100);
  const lumpsum = corpus - annuityCorpus;
  // Estimate monthly pension: annuity at ~6% return
  const monthlyPension = (annuityCorpus * 0.06) / 12;

  return (
    <CalcCard>
      <SliderInput label="Your Current Age" value={age} onChange={setAge} min={18} max={55} suffix=" years" />
      <SliderInput label="Monthly Contribution" value={monthly} onChange={setMonthly} min={500} max={200000} step={500} prefix="₹" />
      <SliderInput label="Expected Return Rate" value={returnRate} onChange={setReturnRate} min={8} max={14} step={0.5} suffix="%" />
      <SliderInput label="Annuity Purchase %" value={annuityPct} onChange={setAnnuityPct} min={40} max={100} step={5} suffix="%" formatValue={(v) => `${v}% (min 40%)`} />
      <ResultRow results={[
        { label: "Total Invested", value: fmt(totalInvested), sub: `${years} years × ₹${monthly.toLocaleString("en-IN")}/mo` },
        { label: "Estimated Corpus at 60", value: fmt(corpus), accent: true },
        { label: "Lumpsum Withdrawal", value: fmt(lumpsum), sub: `${100 - annuityPct}% of corpus` },
      ]} />
      <div className="mt-3 grid gap-3 grid-cols-2">
        <div className="rounded-xl p-4 bg-card-alt">
          <div className="text-[11px] mb-1 text-text-muted">Annuity Investment</div>
          <div className="text-xl font-extrabold text-text">{fmt(annuityCorpus)}</div>
          <div className="text-[11px] mt-0.5 text-text-muted">{annuityPct}% of corpus</div>
        </div>
        <div className="rounded-xl p-4 bg-card-alt">
          <div className="text-[11px] mb-1 text-text-muted">Est. Monthly Pension</div>
          <div className="text-xl font-extrabold text-text">{fmt(monthlyPension)}</div>
          <div className="text-[11px] mt-0.5 text-text-muted">~6% annuity rate assumed</div>
        </div>
      </div>
    </CalcCard>
  );
}
