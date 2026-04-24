"use client";
import { useState } from "react";
import { CalcCard, SliderInput, ResultRow, fmt } from "./calc-ui";

export function GratuityCalc() {
  const [salary, setSalary] = useState(50000);
  const [years, setYears] = useState(10);

  // Gratuity = (Last drawn salary × 15 × Years of service) / 26
  const gratuity = (salary * 15 * years) / 26;
  const taxFree = Math.min(gratuity, 2000000); // ₹20L tax-free limit
  const taxable = Math.max(0, gratuity - 2000000);

  return (
    <CalcCard>
      <SliderInput label="Last Drawn Basic + DA (Monthly)" value={salary} onChange={setSalary} min={10000} max={500000} step={1000} prefix="₹" />
      <SliderInput label="Years of Service" value={years} onChange={setYears} min={5} max={40} suffix=" years" />
      <ResultRow results={[
        { label: "Gratuity Amount", value: fmt(gratuity), accent: true },
        { label: "Tax-Free (up to ₹20L)", value: fmt(taxFree) },
        { label: "Taxable Portion", value: fmt(taxable), sub: taxable > 0 ? "Added to income" : "Fully tax-free" },
      ]} />
    </CalcCard>
  );
}
