"use client";
import { useState } from "react";
import { CalcCard, SliderInput, ResultRow, fmt } from "./calc-ui";

export function PpfCalc() {
  const [yearly, setYearly] = useState(150000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(15);

  let balance = 0;
  for (let i = 0; i < years; i++) {
    balance = (balance + yearly) * (1 + rate / 100);
  }
  const invested = yearly * years;
  const interest = balance - invested;

  return (
    <CalcCard>
      <SliderInput label="Yearly Deposit" value={yearly} onChange={setYearly} min={500} max={150000} step={500} prefix="₹" />
      <SliderInput label="Interest Rate" value={rate} onChange={setRate} min={5} max={10} step={0.1} suffix="%" />
      <SliderInput label="Duration" value={years} onChange={setYears} min={15} max={50} suffix=" years" />
      <ResultRow results={[
        { label: "Total Invested", value: fmt(invested) },
        { label: "Interest Earned", value: fmt(interest), sub: "100% tax-free" },
        { label: "Maturity Amount", value: fmt(balance), accent: true },
      ]} />
    </CalcCard>
  );
}
