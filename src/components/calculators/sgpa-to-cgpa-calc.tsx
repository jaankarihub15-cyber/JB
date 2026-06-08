"use client";
import { useState } from "react";
import { CalcCard, ResultRow } from "./calc-ui";

export function SgpaToCgpaCalc() {
  const [semesters, setSemesters] = useState([
    { name: "Semester 1", sgpa: 8.2 },
    { name: "Semester 2", sgpa: 8.6 },
  ]);

  const valid = semesters.filter((s) => s.sgpa > 0 && s.sgpa <= 10);
  const cgpa = valid.length > 0 ? valid.reduce((a, s) => a + s.sgpa, 0) / valid.length : 0;
  const percentage = cgpa * 9.5;

  const addSem = () => {
    if (semesters.length < 12) {
      setSemesters([...semesters, { name: `Semester ${semesters.length + 1}`, sgpa: 8.0 }]);
    }
  };
  const removeSem = (idx: number) => {
    if (semesters.length > 1) setSemesters(semesters.filter((_, i) => i !== idx));
  };
  const update = (idx: number, value: number) => {
    const u = [...semesters];
    u[idx].sgpa = value;
    setSemesters(u);
  };

  return (
    <CalcCard>
      <div className="space-y-3 mb-5">
        {semesters.map((s, i) => (
          <div key={i} className="flex gap-2 items-center bg-card-alt sm:bg-transparent rounded-lg p-2 sm:p-0">
            <span className="flex-1 text-sm text-text px-1">{s.name}</span>
            <input
              type="number"
              value={s.sgpa}
              onChange={(e) => update(i, Number(e.target.value))}
              className="w-20 px-2 py-2 rounded-lg bg-card sm:bg-card-alt text-sm text-center text-text border-none outline-none focus:ring-2 focus:ring-accent/30"
              min={0}
              max={10}
              step={0.01}
              aria-label={`${s.name} SGPA`}
            />
            <button
              onClick={() => removeSem(i)}
              className="text-text-muted hover:text-red-500 text-lg px-1 shrink-0"
              aria-label="Remove semester"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button onClick={addSem} className="text-sm text-accent font-semibold mb-5 block">+ Add semester</button>
      <ResultRow
        results={[
          { label: "Semesters", value: valid.length.toString() },
          { label: "CGPA", value: cgpa.toFixed(2), accent: true },
          { label: "Approx. Percentage", value: `${percentage.toFixed(1)}%`, sub: "CGPA × 9.5" },
        ]}
      />
    </CalcCard>
  );
}
