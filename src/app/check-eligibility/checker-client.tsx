"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag } from "@/components/ui";

export type CheckerScheme = {
  slug: string;
  title: string;
  desc: string;
  amount: string;
  icon: string;
  tag: string;
  filters: {
    gender: string[];
    ageMin: number;
    ageMax: number;
    occupation: string[];
    incomeMax: number;
    category: string[];
    states: string[];
  };
};

// States KK currently has dedicated schemes for (label + slug used in filters)
const STATES = [
  { v: "andhra-pradesh", l: "Andhra Pradesh" },
  { v: "assam", l: "Assam" },
  { v: "bihar", l: "Bihar" },
  { v: "chhattisgarh", l: "Chhattisgarh" },
  { v: "karnataka", l: "Karnataka" },
  { v: "madhya-pradesh", l: "Madhya Pradesh" },
  { v: "maharashtra", l: "Maharashtra" },
  { v: "odisha", l: "Odisha" },
  { v: "rajasthan", l: "Rajasthan" },
  { v: "telangana", l: "Telangana" },
  { v: "uttar-pradesh", l: "Uttar Pradesh" },
  { v: "west-bengal", l: "West Bengal" },
  { v: "other", l: "Other state / Not listed" },
];

const questions = [
  { key: "state", q: "Which state are you in?", opts: STATES },
  {
    key: "gender",
    q: "What is your gender?",
    opts: [
      { v: "male", l: "\u{1F468} Male" },
      { v: "female", l: "\u{1F469} Female" },
      { v: "other", l: "\u{26A7} Other" },
    ],
  },
  {
    key: "age",
    q: "What is your age group?",
    opts: [
      { v: "0-10", l: "Below 10" },
      { v: "11-17", l: "11\u201317" },
      { v: "18-25", l: "18\u201325" },
      { v: "26-40", l: "26\u201340" },
      { v: "41-60", l: "41\u201360" },
      { v: "60+", l: "60+" },
    ],
  },
  {
    key: "occupation",
    q: "What is your occupation?",
    opts: [
      { v: "farmer", l: "\u{1F33E} Farmer" },
      { v: "salaried", l: "\u{1F4BC} Salaried" },
      { v: "self-employed", l: "\u{1F3EA} Self-Employed / Business" },
      { v: "labourer", l: "\u{1F477} Daily Wage / Labourer" },
      { v: "student", l: "\u{1F4DA} Student" },
      { v: "unemployed", l: "\u{1F50D} Unemployed / Homemaker" },
    ],
  },
  {
    key: "income",
    q: "Approximate annual family income?",
    opts: [
      { v: "100000", l: "Below \u20B91 lakh" },
      { v: "200000", l: "\u20B91\u20133 lakh" },
      { v: "500000", l: "\u20B93\u20135 lakh" },
      { v: "1000000", l: "\u20B95\u201310 lakh" },
      { v: "1800000", l: "\u20B910\u201318 lakh" },
      { v: "5000000", l: "Above \u20B918 lakh" },
    ],
  },
  {
    key: "category",
    q: "Your category? (helps find reserved schemes)",
    opts: [
      { v: "general", l: "General" },
      { v: "obc", l: "OBC" },
      { v: "sc", l: "SC" },
      { v: "st", l: "ST" },
      { v: "skip", l: "Prefer not to say" },
    ],
  },
];

const ageRanges: Record<string, [number, number]> = {
  "0-10": [0, 10],
  "11-17": [11, 17],
  "18-25": [18, 25],
  "26-40": [26, 40],
  "41-60": [41, 60],
  "60+": [60, 100],
};

export default function CheckerClient({ schemes }: { schemes: CheckerScheme[] }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [results, setResults] = useState<CheckerScheme[] | null>(null);

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
    const userState = d.state;
    const matched = schemes.filter((s) => {
      const f = s.filters;
      const isCentral = f.states.includes("central");
      // State logic: central schemes show to everyone; state schemes only if user's state matches.
      // "other" state -> central only.
      if (!isCentral) {
        if (userState === "other") return false;
        if (!f.states.includes(userState)) return false;
      }
      if (!f.gender.includes("all") && !f.gender.includes(d.gender)) return false;
      if (ages[0] > f.ageMax || ages[1] < f.ageMin) return false;
      if (!f.occupation.includes("any") && !f.occupation.includes(d.occupation)) return false;
      if (inc > f.incomeMax) return false;
      if (
        d.category !== "skip" &&
        d.category &&
        !f.category.includes("all") &&
        !f.category.includes(d.category)
      )
        return false;
      return true;
    });
    // central first within results is fine; keep state schemes on top so KK strength shows
    matched.sort((a, b) => {
      const as = a.filters.states.includes("central") ? 1 : 0;
      const bs = b.filters.states.includes("central") ? 1 : 0;
      return as - bs;
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
      <div className="max-w-[1000px] mx-auto px-5 py-6">
        <div
          className="rounded-2xl p-7 text-white mb-6 text-center"
          style={{ background: "linear-gradient(135deg, #6B21A8 0%, #4C1D95 100%)" }}
        >
          <div className="text-5xl mb-2">{"\u{1F3AF}"}</div>
          <h1 className="heading text-3xl font-normal mb-2">
            You may be eligible for {results.length} {results.length === 1 ? "scheme" : "schemes"}
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
                <div className="text-sm text-text-secondary mt-0.5 line-clamp-2">{s.desc}</div>
              </div>
              <div className="text-right shrink-0">
                {s.amount && <div className="text-base font-bold text-accent">{s.amount}</div>}
                <Tag>{s.tag}</Tag>
              </div>
            </Link>
          ))}
        </div>

        {results.length === 0 && (
          <div className="p-10 text-center text-text-muted text-base">
            No matching schemes found for these answers. Try adjusting them, or check back as we add
            more schemes.
          </div>
        )}

        <button
          onClick={reset}
          className="block mx-auto mt-6 px-6 py-2.5 rounded-lg border border-border bg-card text-sm font-medium text-text-secondary cursor-pointer hover:bg-card-alt transition-colors"
        >
          {"\u2190"} Check Again
        </button>

        <div className="mt-6 p-4 bg-accent-light rounded-xl text-center text-sm text-text-secondary leading-relaxed">
          Our scheme database is updated every week and we keep adding new central and state schemes.
          Bookmark KnowledgeKendra and check back so you never miss a benefit you qualify for.
        </div>

        <div className="mt-4 p-4 bg-card-alt rounded-xl text-center text-sm text-text-muted leading-relaxed">
          This is an indicative check based on general eligibility criteria. Actual eligibility
          depends on documents, state rules, and specific scheme conditions. Always verify on the
          official portal.
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
        <div className="text-[40px] mb-2">{"\u{1F50D}"}</div>
        <h1 className="heading text-2xl font-normal text-text mb-1.5">
          Government Scheme Eligibility Checker
        </h1>
        <p className="text-sm text-text-secondary">
          Answer {questions.length} quick questions to find central and state government schemes you
          qualify for, including {schemes.length}+ schemes across India. Takes under a minute.
        </p>
      </div>

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
          {"\u2190"} Back
        </button>
      )}
    </div>
  );
}
