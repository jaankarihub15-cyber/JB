"use client";
import { useState } from "react";
import { CalcCard, SliderInput, ResultRow, fmt } from "./calc-ui";

export function HraCalc() {
  const [basic, setBasic] = useState(40000);
  const [hra, setHra] = useState(20000);
  const [rent, setRent] = useState(15000);
  const [metro, setMetro] = useState(1);

  const yearly = 12;
  // HRA exemption = Minimum of:
  // 1. Actual HRA received
  // 2. 50% of basic (metro) or 40% (non-metro)
  // 3. Rent paid - 10% of basic
  const actual = hra;
  const percentBasic = basic * (metro ? 0.5 : 0.4);
  const rentMinus10 = Math.max(0, rent - basic * 0.1);
  const exemption = Math.min(actual, percentBasic, rentMinus10);
  const taxable = hra - exemption;

  return (
    <CalcCard>
      <SliderInput label="Basic Salary (Monthly)" value={basic} onChange={setBasic} min={10000} max={300000} step={1000} prefix="₹" />
      <SliderInput label="HRA Received (Monthly)" value={hra} onChange={setHra} min={5000} max={150000} step={1000} prefix="₹" />
      <SliderInput label="Rent Paid (Monthly)" value={rent} onChange={setRent} min={5000} max={100000} step={500} prefix="₹" />
      <div className="mb-5">
        <div className="text-sm font-semibold text-text mb-2">City Type</div>
        <div className="flex gap-2">
          <button onClick={() => setMetro(1)} className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all ${metro ? "bg-accent text-white" : "bg-card-alt text-text-muted border border-border"}`}>Metro (50%)</button>
          <button onClick={() => setMetro(0)} className={`px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all ${!metro ? "bg-accent text-white" : "bg-card-alt text-text-muted border border-border"}`}>Non-Metro (40%)</button>
        </div>
      </div>
      <ResultRow results={[
        { label: "HRA Exemption (Monthly)", value: fmt(exemption), accent: true },
        { label: "Taxable HRA (Monthly)", value: fmt(taxable) },
        { label: "Annual Tax Savings (30%)", value: fmt(exemption * 12 * 0.3), sub: "At 30% slab" },
      ]} />
    </CalcCard>
  );
}
