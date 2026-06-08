"use client";
import { useState } from "react";
import { CalcCard, SliderInput, ResultRow, fmt } from "./calc-ui";

export function SipCalc() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const n = years * 12;
  const r = rate / 100 / 12;
  const invested = monthly * n;
  const fv = r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : invested;
  const returns = fv - invested;

  return (
    <CalcCard>
      <SliderInput label="Monthly Investment" value={monthly} onChange={setMonthly} min={500} max={100000} step={500} prefix="₹" />
      <SliderInput label="Expected Annual Return" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" />
      <SliderInput label="Investment Period" value={years} onChange={setYears} min={1} max={40} suffix=" years" />
      <ResultRow results={[
        { label: "Total Invested", value: fmt(invested) },
        { label: "Estimated Returns", value: fmt(returns), sub: `${((returns / invested) * 100).toFixed(0)}% gain` },
        { label: "Total Value", value: fmt(fv), accent: true },
      ]} />
    </CalcCard>
  );
}
