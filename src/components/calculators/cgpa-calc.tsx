"use client";
import { useState } from "react";
import { CalcCard, ResultRow } from "./calc-ui";

const gradePoints: Record<string, number> = {
  "O (10)": 10, "A+ (9)": 9, "A (8)": 8, "B+ (7)": 7, "B (6)": 6, "C (5)": 5, "D (4)": 4, "F (0)": 0,
};

export function CgpaCalc() {
  const [subjects, setSubjects] = useState([
    { name: "Subject 1", credits: 4, grade: "A (8)" },
    { name: "Subject 2", credits: 4, grade: "A (8)" },
    { name: "Subject 3", credits: 3, grade: "B+ (7)" },
    { name: "Subject 4", credits: 3, grade: "A+ (9)" },
    { name: "Subject 5", credits: 2, grade: "A (8)" },
  ]);

  const totalCredits = subjects.reduce((s, sub) => s + sub.credits, 0);
  const totalWeighted = subjects.reduce((s, sub) => s + sub.credits * (gradePoints[sub.grade] || 0), 0);
  const cgpa = totalCredits > 0 ? totalWeighted / totalCredits : 0;
  const percentage = cgpa * 9.5; // Approximate conversion

  const addSubject = () => {
    if (subjects.length < 12) {
      setSubjects([...subjects, { name: `Subject ${subjects.length + 1}`, credits: 3, grade: "A (8)" }]);
    }
  };

  const removeSubject = (idx: number) => {
    if (subjects.length > 2) {
      setSubjects(subjects.filter((_, i) => i !== idx));
    }
  };

  const updateSubject = (idx: number, field: string, value: any) => {
    const updated = [...subjects];
    (updated[idx] as any)[field] = value;
    setSubjects(updated);
  };

  return (
    <CalcCard>
      <div className="space-y-3 mb-5">
        {subjects.map((sub, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={sub.name}
              onChange={(e) => updateSubject(i, "name", e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-card-alt text-sm text-text border-none outline-none focus:ring-2 focus:ring-accent/30"
            />
            <input
              type="number"
              value={sub.credits}
              onChange={(e) => updateSubject(i, "credits", Number(e.target.value))}
              className="w-16 px-2 py-2 rounded-lg bg-card-alt text-sm text-center text-text border-none outline-none focus:ring-2 focus:ring-accent/30"
              min={1} max={10}
            />
            <select
              value={sub.grade}
              onChange={(e) => updateSubject(i, "grade", e.target.value)}
              className="px-2 py-2 rounded-lg bg-card-alt text-sm text-text border-none outline-none focus:ring-2 focus:ring-accent/30"
            >
              {Object.keys(gradePoints).map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <button onClick={() => removeSubject(i)} className="text-text-muted hover:text-red-500 text-lg px-1">×</button>
          </div>
        ))}
      </div>
      <button onClick={addSubject} className="text-sm text-accent font-semibold mb-5 block">+ Add subject</button>
      <ResultRow results={[
        { label: "Total Credits", value: totalCredits.toString() },
        { label: "CGPA", value: cgpa.toFixed(2), accent: true },
        { label: "Approx. Percentage", value: `${percentage.toFixed(1)}%`, sub: "CGPA × 9.5" },
      ]} />
    </CalcCard>
  );
}
