"use client";
import { useState } from "react";
import { CalcCard, SliderInput, ResultRow, fmt } from "./calc-ui";

export function LumpsumCalc() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const fv = amount * Math.pow(1 + rate / 100, years);
  const returns = fv - amount;

  return (
    <CalcCard>
      <SliderInput label="Investment Amount" value={amount} onChange={setAmount} min={10000} max={10000000} step={10000} prefix="₹" />
      <SliderInput label="Expected Annual Return" value={rate} onChange={setRate} min={1} max={30} step={0.5} suffix="%" />
      <SliderInput label="Investment Period" value={years} onChange={setYears} min={1} max={40} suffix=" years" />
      <ResultRow results={[
        { label: "Invested", value: fmt(amount) },
        { label: "Estimated Returns", value: fmt(returns), sub: `${((returns / amount) * 100).toFixed(0)}% gain` },
        { label: "Total Value", value: fmt(fv), accent: true },
      ]} />
    </CalcCard>
  );
}
