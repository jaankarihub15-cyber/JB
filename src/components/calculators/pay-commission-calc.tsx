"use client";
import { useState } from "react";
import { CalcCard, SliderInput, ResultRow, fmt } from "./calc-ui";

export function PayCommissionCalc() {
  const [currentBasic, setCurrentBasic] = useState(56100);
  const [fitment, setFitment] = useState(2.57);
  const [city, setCity] = useState<"X" | "Y" | "Z">("X");

  const newBasic = Math.round(currentBasic * fitment);
  const hraRate = city === "X" ? 0.27 : city === "Y" ? 0.18 : 0.09;
  const hra = Math.round(newBasic * hraRate);
  const ta = city === "X" ? 7200 : 3600;
  const da = 0; // DA resets to 0 at new pay commission
  const gross = newBasic + hra + ta + da;
  const nps = Math.round(newBasic * 0.10);
  const inHand = gross - nps;
  const increase = newBasic - currentBasic;
  const pctIncrease = ((increase / currentBasic) * 100).toFixed(0);

  return (
    <CalcCard>
      <SliderInput label="Current Basic Pay (7th CPC)" value={currentBasic} onChange={setCurrentBasic} min={18000} max={250000} step={100} prefix="₹" />
      <SliderInput label="Expected Fitment Factor" value={fitment} onChange={setFitment} min={1.8} max={3.5} step={0.01} suffix="x" formatValue={(v) => `${v.toFixed(2)}x`} />
      <div className="mb-5">
        <label className="text-sm font-semibold text-text mb-2 block">City Category (HRA)</label>
        <div className="flex gap-2">
          {(["X", "Y", "Z"] as const).map((c) => (
            <button key={c} onClick={() => setCity(c)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${city === c ? "bg-accent text-white" : "bg-card-alt text-text-secondary hover:bg-border"}`}>
              {c === "X" ? "X (Metro)" : c === "Y" ? "Y (Tier 2)" : "Z (Others)"}
            </button>
          ))}
        </div>
      </div>
      <ResultRow results={[
        { label: "New Basic Pay", value: fmt(newBasic), sub: `+${pctIncrease}% increase` },
        { label: "HRA + TA", value: fmt(hra + ta), sub: `HRA ${(hraRate * 100)}% + TA ₹${ta.toLocaleString("en-IN")}` },
        { label: "Estimated In-Hand", value: fmt(inHand), accent: true },
      ]} />
      <div className="mt-3 grid gap-3 grid-cols-2">
        <div className="rounded-xl p-4 bg-card-alt">
          <div className="text-[11px] mb-1 text-text-muted">Gross Salary (8th CPC)</div>
          <div className="text-xl font-extrabold text-text">{fmt(gross)}</div>
          <div className="text-[11px] mt-0.5 text-text-muted">DA resets to 0% initially</div>
        </div>
        <div className="rounded-xl p-4 bg-card-alt">
          <div className="text-[11px] mb-1 text-text-muted">Monthly Increase</div>
          <div className="text-xl font-extrabold text-text">{fmt(increase)}</div>
          <div className="text-[11px] mt-0.5 text-text-muted">over current 7th CPC basic</div>
        </div>
      </div>
    </CalcCard>
  );
}
