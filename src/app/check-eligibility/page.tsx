"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag } from "@/components/ui";

// Scheme data with eligibility filters (embedded for client-side filtering)
const schemes = [
  { slug: "pm-kisan", title: "PM Kisan Samman Nidhi", desc: "₹6,000/year direct income support for farmer families", amount: "₹6,000/yr", icon: "🌾", tag: "Agriculture", filters: { gender: ["all"], ageMin: 18, ageMax: 100, occupation: ["farmer"], incomeMax: 9999999, category: ["all"] }},
  { slug: "sukanya-samriddhi-yojana", title: "Sukanya Samriddhi Yojana", desc: "8.2% interest savings for girl child (up to age 10)", amount: "8.2% p.a.", icon: "👧", tag: "Savings", filters: { gender: ["female"], ageMin: 0, ageMax: 10, occupation: ["any"], incomeMax: 9999999, category: ["all"] }},
  { slug: "pm-awas-yojana", title: "PM Awas Yojana", desc: "Up to ₹2.67 lakh subsidy on home loans", amount: "Up to ₹2.67L", icon: "🏠", tag: "Housing", filters: { gender: ["all"], ageMin: 18, ageMax: 70, occupation: ["salaried","self-employed","labourer","farmer"], incomeMax: 1800000, category: ["all"] }},
  { slug: "ayushman-bharat", title: "Ayushman Bharat (PMJAY)", desc: "₹5 lakh/year health insurance for eligible families", amount: "₹5L cover", icon: "🏥", tag: "Health", filters: { gender: ["all"], ageMin: 0, ageMax: 100, occupation: ["any"], incomeMax: 300000, category: ["all"] }},
  { slug: "pm-ujjwala-yojana", title: "PM Ujjwala Yojana", desc: "Free LPG connection for BPL women", amount: "Free LPG", icon: "🔥", tag: "Welfare", filters: { gender: ["female"], ageMin: 18, ageMax: 100, occupation: ["any"], incomeMax: 200000, category: ["all"] }},
  { slug: "pm-mudra-yojana", title: "PM Mudra Yojana", desc: "Collateral-free loans up to ₹10 lakh for small businesses", amount: "Up to ₹10L", icon: "🏪", tag: "Business", filters: { gender: ["all"], ageMin: 18, ageMax: 65, occupation: ["self-employed"], incomeMax: 9999999, category: ["all"] }},
  { slug: "atal-pension-yojana", title: "Atal Pension Yojana", desc: "Guaranteed ₹1,000-5,000/month pension after 60", amount: "₹1-5K/mo", icon: "👴", tag: "Pension", filters: { gender: ["all"], ageMin: 18, ageMax: 40, occupation: ["any"], incomeMax: 9999999, category: ["all"] }},
  { slug: "pm-vishwakarma-yojana", title: "PM Vishwakarma Yojana", desc: "Training + loan up to ₹3 lakh for traditional artisans", amount: "Up to ₹3L", icon: "🔨", tag: "Skill", filters: { gender: ["all"], ageMin: 18, ageMax: 65, occupation: ["self-employed","artisan"], incomeMax: 500000, category: ["all"] }},
  { slug: "pm-jan-dhan-yojana", title: "PM Jan Dhan Yojana", desc: "Zero-balance bank account with RuPay card + ₹2 lakh insurance", amount: "Zero bal", icon: "🏦", tag: "Banking", filters: { gender: ["all"], ageMin: 10, ageMax: 100, occupation: ["any"], incomeMax: 9999999, category: ["all"] }},
  { slug: "pm-suraksha-bima-yojana", title: "PM Suraksha Bima Yojana", desc: "₹2 lakh accident insurance for just ₹20/year", amount: "₹20/yr", icon: "🛡️", tag: "Insurance", filters: { gender: ["all"], ageMin: 18, ageMax: 70, occupation: ["any"], incomeMax: 9999999, category: ["all"] }},
  { slug: "e-shram-card", title: "e-Shram Card", desc: "Social security for unorganized workers + ₹2 lakh insurance", amount: "₹2L cover", icon: "👷", tag: "Labour", filters: { gender: ["all"], ageMin: 16, ageMax: 59, occupation: ["labourer","self-employed"], incomeMax: 200000, category: ["all"] }},
  { slug: "pm-jeevan-jyoti-bima", title: "PM Jeevan Jyoti Bima", desc: "₹2 lakh life insurance for ₹436/year premium", amount: "₹436/yr", icon: "💚", tag: "Insurance", filters: { gender: ["all"], ageMin: 18, ageMax: 55, occupation: ["any"], incomeMax: 9999999, category: ["all"] }},
];

const questions = [
  { key: "gender", q: "What is your gender?", opts: [{ v: "male", l: "👨 Male" }, { v: "female", l: "👩 Female" }, { v: "other", l: "⚧ Other" }] },
  { key: "age", q: "What is your age group?", opts: [{ v: "0-10", l: "Below 10" }, { v: "18-25", l: "18–25" }, { v: "26-40", l: "26–40" }, { v: "41-60", l: "41–60" }, { v: "60+", l: "60+" }] },
  { key: "occupation", q: "What is your occupation?", opts: [{ v: "farmer", l: "🌾 Farmer" }, { v: "salaried", l: "💼 Salaried" }, { v: "self-employed", l: "🏪 Self-Employed / Business" }, { v: "labourer", l: "👷 Daily Wage / Labourer" }, { v: "student", l: "📚 Student" }, { v: "unemployed", l: "🔍 Unemployed / Homemaker" }] },
  { key: "income", q: "Approximate annual family income?", opts: [{ v: "100000", l: "Below ₹1 lakh" }, { v: "200000", l: "₹1–3 lakh" }, { v: "500000", l: "₹3–5 lakh" }, { v: "1000000", l: "₹5–10 lakh" }, { v: "1800000", l: "₹10–18 lakh" }, { v: "5000000", l: "Above ₹18 lakh" }] },
  { key: "category", q: "Your category? (helps find reserved schemes)", opts: [{ v: "general", l: "General" }, { v: "obc", l: "OBC" }, { v: "sc", l: "SC" }, { v: "st", l: "ST" }, { v: "skip", l: "Prefer not to say" }] },
];

const ageRanges: Record<string, [number, number]> = {
  "0-10": [0, 10], "18-25": [18, 25], "26-40": [26, 40], "41-60": [41, 60], "60+": [60, 100],
};

export default function EligibilityPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [results, setResults] = useState<typeof schemes | null>(null);

  const selectOption = (key: string, val: string) => {
    const nd = { ...data, [key]: val };
    setData(nd);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 150);
    } else {
      calculate(nd);
    }
  };

  const calculate = (d: Record<string, string>) => {
    const ages = ageRanges[d.age] || [18, 40];
    const inc = parseInt(d.income) || 500000;
    const matched = schemes.filter((s) => {
      const f = s.filters;
      if (!f.gender.includes("all") && !f.gender.includes(d.gender)) return false;
      if (ages[0] > f.ageMax || ages[1] < f.ageMin) return false;
      if (!f.occupation.includes("any") && !f.occupation.includes(d.occupation)) return false;
      if (inc > f.incomeMax) return false;
      return true;
    });
    setResults(matched);
  };

  const reset = () => {
    setStep(0);
    setData({});
    setResults(null);
  };

  // RESULTS
  if (results) {
    return (
      <div className="max-w-[860px] mx-auto px-5 py-6">
        <div className="rounded-2xl p-7 text-white mb-6 text-center" style={{ background: "linear-gradient(135deg, #6B21A8 0%, #4C1D95 100%)" }}>
          <div className="text-5xl mb-2">🎯</div>
          <h1 className="heading text-3xl font-normal mb-2">
            You may be eligible for {results.length} schemes
          </h1>
          <p className="text-base opacity-80">
            Based on your profile. Tap any scheme to learn more and apply.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {results.map((s) => (
            <Link
              key={s.slug}
              href={`/yojana/${s.slug}`}
              className="flex items-center gap-3.5 p-4 card hover:border-accent/30 transition-colors"
            >
              <span className="text-3xl">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-base font-semibold text-text">{s.title}</div>
                <div className="text-sm text-text-secondary mt-0.5">{s.desc}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base font-bold text-accent">{s.amount}</div>
                <Tag>{s.tag}</Tag>
              </div>
            </Link>
          ))}
        </div>

        {results.length === 0 && (
          <div className="p-10 text-center text-text-muted text-base">
            No matching schemes found. Try adjusting your answers.
          </div>
        )}

        <button
          onClick={reset}
          className="block mx-auto mt-6 px-6 py-2.5 rounded-lg border border-border bg-card text-sm font-medium text-text-secondary cursor-pointer hover:bg-card-alt transition-colors"
        >
          ← Check Again
        </button>

        <div className="mt-8 p-4 bg-card-alt rounded-xl text-center text-sm text-text-muted leading-relaxed">
          This is an indicative check based on general eligibility criteria.
          Actual eligibility depends on documents, state rules, and specific
          scheme conditions. Always verify on the official portal.
        </div>
      </div>
    );
  }

  // QUESTIONNAIRE
  const cq = questions[step];
  const progress = (step / questions.length) * 100;

  return (
    <div className="max-w-[520px] mx-auto px-5 py-8">
      <div className="text-center mb-7">
        <div className="text-[40px] mb-2">🔍</div>
        <h1 className="heading text-2xl font-normal text-text mb-1.5">
          Find Schemes You&apos;re Eligible For
        </h1>
        <p className="text-sm text-text-secondary">
          Answer 5 quick questions. Takes 30 seconds.
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-border rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-xs text-text-muted mb-2">
        Question {step + 1} of {questions.length}
      </div>
      <h2 className="text-lg font-semibold text-text mb-4">{cq.q}</h2>

      <div className="flex flex-col gap-2">
        {cq.opts.map((o) => (
          <button
            key={o.v}
            onClick={() => selectOption(cq.key, o.v)}
            className={`p-3.5 rounded-xl text-left text-base font-medium cursor-pointer transition-all border-[1.5px] ${
              data[cq.key] === o.v
                ? "bg-accent-light border-accent text-accent"
                : "bg-card border-border text-text hover:border-accent/40"
            }`}
          >
            {o.l}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          onClick={() => setStep(step - 1)}
          className="mt-4 px-4 py-2 text-sm text-text-muted cursor-pointer hover:text-text transition-colors"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
