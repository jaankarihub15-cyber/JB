"use client";
import { useState } from "react";
import { CalcCard, SliderInput, ResultRow, fmt } from "./calc-ui";

function calcOldTax(income: number, ded80c: number, ded80d: number, hra: number): number {
  const taxable = Math.max(0, income - 50000 - ded80c - ded80d - hra); // std deduction + 80C + 80D + HRA
  let tax = 0;
  if (taxable > 1000000) tax += (taxable - 1000000) * 0.3;
  if (taxable > 500000) tax += Math.min(taxable - 500000, 500000) * 0.2;
  if (taxable > 250000) tax += Math.min(taxable - 250000, 250000) * 0.05;
  // Rebate 87A
  if (taxable <= 500000) tax = 0;
  return Math.round(tax * 1.04); // 4% cess
}

function calcNewTax(income: number): number {
  const taxable = Math.max(0, income - 75000); // std deduction in new regime
  let tax = 0;
  const slabs = [[300000, 0], [400000, 0.05], [500000, 0.05], [600000, 0.1], [700000, 0.1], [800000, 0.15], [900000, 0.15], [1000000, 0.2], [1200000, 0.2], [1500000, 0.25]];
  let prev = 0;
  for (const [limit, rate] of slabs) {
    if (taxable > prev) {
      tax += Math.min(taxable - prev, (limit as number) - prev) * (rate as number);
    }
    prev = limit as number;
  }
  if (taxable > 1500000) tax += (taxable - 1500000) * 0.3;
  if (taxable <= 1200000) tax = 0; // rebate under new regime
  return Math.round(tax * 1.04);
}

export function TaxCalc() {
  const [income, setIncome] = useState(1200000);
  const [ded80c, setDed80c] = useState(150000);
  const [ded80d, setDed80d] = useState(25000);
  const [hra, setHra] = useState(100000);

  const oldTax = calcOldTax(income, ded80c, ded80d, hra);
  const newTax = calcNewTax(income);
  const savings = oldTax - newTax;

  return (
    <CalcCard>
      <SliderInput label="Annual Gross Income" value={income} onChange={setIncome} min={300000} max={5000000} step={50000} prefix="₹" />
      <SliderInput label="80C Deductions (PPF, ELSS, LIC)" value={ded80c} onChange={setDed80c} min={0} max={150000} step={10000} prefix="₹" />
      <SliderInput label="80D (Health Insurance)" value={ded80d} onChange={setDed80d} min={0} max={100000} step={5000} prefix="₹" />
      <SliderInput label="HRA Exemption (Annual)" value={hra} onChange={setHra} min={0} max={300000} step={10000} prefix="₹" />
      <ResultRow results={[
        { label: "Old Regime Tax", value: fmt(oldTax) },
        { label: "New Regime Tax", value: fmt(newTax) },
        { label: savings > 0 ? "New Regime Saves" : "Old Regime Saves", value: fmt(Math.abs(savings)), accent: true, sub: savings > 0 ? "Choose New Regime" : "Choose Old Regime" },
      ]} />
    </CalcCard>
  );
}
