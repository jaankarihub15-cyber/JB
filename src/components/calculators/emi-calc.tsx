"use client";
import { useState } from "react";
import { CalcCard, SliderInput, ResultRow, fmt } from "./calc-ui";

export function EmiCalc() {
  const [principal, setPrincipal] = useState(3000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const n = years * 12;
  const r = rate / 100 / 12;
  const emi = r > 0 ? principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : principal / n;
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  return (
    <CalcCard>
      <SliderInput label="Loan Amount" value={principal} onChange={setPrincipal} min={100000} max={20000000} step={100000} prefix="₹" />
      <SliderInput label="Interest Rate" value={rate} onChange={setRate} min={5} max={20} step={0.1} suffix="%" />
      <SliderInput label="Loan Tenure" value={years} onChange={setYears} min={1} max={30} suffix=" years" />
      <ResultRow results={[
        { label: "Monthly EMI", value: fmt(emi), accent: true },
        { label: "Total Interest", value: fmt(totalInterest), sub: `${((totalInterest / principal) * 100).toFixed(0)}% of loan` },
        { label: "Total Payment", value: fmt(totalPayment) },
      ]} />
    </CalcCard>
  );
}
