"use client";
import { useState } from "react";
import { CalcCard, SliderInput, ResultRow, fmt } from "./calc-ui";

export function EpfCalc() {
  const [salary, setSalary] = useState(30000);
  const [age, setAge] = useState(25);
  const [existing, setExisting] = useState(0);
  const [rate, setRate] = useState(8.25);

  const years = 58 - age;
  const months = years * 12;
  const empContrib = salary * 0.12;
  const employerEpf = salary * 0.0367; // 3.67% to EPF (8.33% goes to EPS)
  const totalMonthly = empContrib + employerEpf;
  const r = rate / 100 / 12;
  const futureValue = existing * Math.pow(1 + r, months) + totalMonthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
  const totalInvested = existing + totalMonthly * months;
  const interest = futureValue - totalInvested;

  return (
    <CalcCard>
      <SliderInput label="Monthly Basic + DA" value={salary} onChange={setSalary} min={5000} max={200000} step={1000} prefix="₹" />
      <SliderInput label="Your Current Age" value={age} onChange={setAge} min={18} max={55} suffix=" years" />
      <SliderInput label="Existing EPF Balance" value={existing} onChange={setExisting} min={0} max={50000000} step={10000} prefix="₹" />
      <SliderInput label="EPF Interest Rate" value={rate} onChange={setRate} min={7} max={9} step={0.05} suffix="%" />
      <ResultRow results={[
        { label: "Your Monthly Contribution (12%)", value: fmt(empContrib) },
        { label: "Employer EPF (3.67%)", value: fmt(employerEpf), sub: "8.33% goes to EPS pension" },
        { label: "Estimated Corpus at 58", value: fmt(futureValue), accent: true },
      ]} />
      <div className="mt-3 grid gap-3 grid-cols-2">
        <div className="rounded-xl p-4 bg-card-alt">
          <div className="text-[11px] mb-1 text-text-muted">Total Invested</div>
          <div className="text-xl font-extrabold text-text">{fmt(totalInvested)}</div>
        </div>
        <div className="rounded-xl p-4 bg-card-alt">
          <div className="text-[11px] mb-1 text-text-muted">Interest Earned</div>
          <div className="text-xl font-extrabold text-text">{fmt(interest)}</div>
          <div className="text-[11px] mt-0.5 text-text-muted">{years} years compounding</div>
        </div>
      </div>
    </CalcCard>
  );
}
