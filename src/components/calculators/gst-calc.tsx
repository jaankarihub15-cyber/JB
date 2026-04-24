"use client";
import { useState } from "react";
import { CalcCard, SliderInput, ResultRow, fmt } from "./calc-ui";

export function GstCalc() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState<"add" | "remove">("add");

  let gstAmount: number, totalAmount: number, baseAmount: number;

  if (mode === "add") {
    baseAmount = amount;
    gstAmount = amount * (rate / 100);
    totalAmount = amount + gstAmount;
  } else {
    totalAmount = amount;
    baseAmount = amount / (1 + rate / 100);
    gstAmount = totalAmount - baseAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return (
    <CalcCard>
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setMode("add")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${mode === "add" ? "bg-accent text-white" : "bg-card-alt text-text-secondary"}`}
        >
          Add GST
        </button>
        <button
          onClick={() => setMode("remove")}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${mode === "remove" ? "bg-accent text-white" : "bg-card-alt text-text-secondary"}`}
        >
          Remove GST
        </button>
      </div>

      <SliderInput
        label={mode === "add" ? "Amount (before GST)" : "Amount (including GST)"}
        value={amount} onChange={setAmount} min={100} max={10000000} step={100} prefix="₹"
      />

      <div className="mb-5">
        <label className="text-sm font-semibold text-text mb-2 block">GST Rate</label>
        <div className="flex gap-2">
          {[5, 12, 18, 28].map((r) => (
            <button
              key={r}
              onClick={() => setRate(r)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${rate === r ? "bg-accent text-white" : "bg-card-alt text-text-secondary hover:bg-border"}`}
            >
              {r}%
            </button>
          ))}
        </div>
      </div>

      <ResultRow results={[
        { label: "Base Amount", value: fmt(baseAmount) },
        { label: `GST @ ${rate}%`, value: fmt(gstAmount), sub: `CGST: ${fmt(cgst)} + SGST: ${fmt(sgst)}` },
        { label: mode === "add" ? "Total (with GST)" : "You Paid (with GST)", value: fmt(totalAmount), accent: true },
      ]} />
    </CalcCard>
  );
}
