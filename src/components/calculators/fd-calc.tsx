"use client";
import { useState } from "react";
import { CalcCard, SliderInput, ResultRow, fmt } from "./calc-ui";

export function FdCalc() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);

  const maturity = amount * Math.pow(1 + rate / 400, years * 4); // quarterly compounding
  const interest = maturity - amount;

  return (
    <CalcCard>
      <SliderInput label="Deposit Amount" value={amount} onChange={setAmount} min={10000} max={10000000} step={10000} prefix="₹" />
      <SliderInput label="Interest Rate" value={rate} onChange={setRate} min={3} max={10} step={0.1} suffix="%" />
      <SliderInput label="Tenure" value={years} onChange={setYears} min={1} max={10} suffix=" years" />
      <ResultRow results={[
        { label: "Principal", value: fmt(amount) },
        { label: "Interest Earned", value: fmt(interest), sub: `${((interest / amount) * 100).toFixed(1)}% total gain` },
        { label: "Maturity Amount", value: fmt(maturity), accent: true },
      ]} />
    </CalcCard>
  );
}
