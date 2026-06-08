"use client";

import { useState } from "react";

type ExamTabsData = {
  syllabus?: { subject: string; topics: string; questions?: number; marks?: number; tag?: string }[];
  books?: { title: string; author: string; subject: string; tag_color?: string }[];
  study_plan?: { period: string; tasks: string }[];
  quiz?: { question: string; options: string[]; answer: number }[];
};

export function ExamTabs({ data }: { data: ExamTabsData }) {
  const [active, setActive] = useState("overview");
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const hasSyllabus = data.syllabus && data.syllabus.length > 0;
  const hasBooks = data.books && data.books.length > 0;
  const hasPlan = data.study_plan && data.study_plan.length > 0;
  const hasQuiz = data.quiz && data.quiz.length > 0;

  const hasAnyTab = hasSyllabus || hasBooks || hasPlan || hasQuiz;
  if (!hasAnyTab) return null;

  const tabs = [
    { id: "overview", label: "Overview" },
    ...(hasSyllabus ? [{ id: "syllabus", label: "Syllabus" }] : []),
    ...(hasBooks ? [{ id: "books", label: "Books" }] : []),
    ...(hasPlan ? [{ id: "plan", label: "Study Plan" }] : []),
    ...(hasQuiz ? [{ id: "quiz", label: "Quiz" }] : []),
  ];

  const tagColors: Record<string, string> = {
    maths: "bg-blue-light text-blue",
    reasoning: "bg-purple-light text-purple",
    english: "bg-accent-light text-accent",
    gk: "bg-orange-light text-orange",
    science: "bg-accent-light text-accent-dark",
    default: "bg-card-alt text-text-muted",
  };

  const getTagColor = (tag?: string) => {
    if (!tag) return tagColors.default;
    const key = tag.toLowerCase();
    for (const [k, v] of Object.entries(tagColors)) {
      if (key.includes(k)) return v;
    }
    return tagColors.default;
  };

  const handleAnswer = (qIndex: number, optIndex: number) => {
    if (answers[qIndex] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  return (
    <div className="mb-8">
      {/* Tab bar */}
      <div className="flex gap-0 border-b-2 border-border mb-5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-[2px] transition-colors cursor-pointer ${
              active === tab.id
                ? "text-accent border-accent"
                : "text-text-muted border-transparent hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview — just a signal to show normal page content below */}
      {active === "overview" && (
        <div className="text-sm text-text-muted italic mb-2">
          {/* Empty — the existing page content renders below this component */}
        </div>
      )}

      {/* Syllabus */}
      {active === "syllabus" && hasSyllabus && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-base font-extrabold text-text mb-4 tracking-tight">Complete Syllabus</h3>
          {data.syllabus!.map((s, i) => (
            <div key={i} className={`pb-4 mb-4 ${i < data.syllabus!.length - 1 ? "border-b border-border" : ""}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-text">{s.subject}</span>
                {s.questions && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${getTagColor(s.subject)}`}>
                    {s.questions} Qs · {s.marks} marks
                  </span>
                )}
                {s.tag && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${getTagColor(s.tag)}`}>
                    {s.tag}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{s.topics}</p>
            </div>
          ))}
        </div>
      )}

      {/* Books */}
      {active === "books" && hasBooks && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="text-base font-extrabold text-text mb-4 tracking-tight">Recommended Books</h3>
          {data.books!.map((b, i) => (
            <div key={i} className={`flex gap-3 py-3 ${i < data.books!.length - 1 ? "border-b border-border" : ""}`}>
              <div className={`w-10 h-12 rounded-lg ${getTagColor(b.subject)} flex items-center justify-center text-lg shrink-0`}>
                📗
              </div>
              <div className="flex-1">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(b.title + " " + b.author + " book")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-accent hover:underline"
                >
                  {b.title} ↗
                </a>
                <div className="text-xs text-text-muted mt-0.5">{b.author}</div>
                <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold ${getTagColor(b.subject)}`}>
                  {b.subject}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Study Plan */}
      {active === "plan" && hasPlan && (
        <div>
          <h3 className="text-base font-extrabold text-text mb-4 tracking-tight">Study Plan</h3>
          <div className="flex flex-col gap-2.5">
            {data.study_plan!.map((w, i) => (
              <div key={i} className="bg-card-alt rounded-2xl p-4">
                <div className="text-xs font-bold text-accent mb-2">{w.period}</div>
                <div className="text-xs text-text-secondary leading-relaxed">{w.tasks}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz */}
      {active === "quiz" && hasQuiz && (
        <div>
          <h3 className="text-base font-extrabold text-text mb-4 tracking-tight">Practice Quiz</h3>
          <div className="flex flex-col gap-3">
            {data.quiz!.map((q, qi) => (
              <div key={qi} className="bg-card border border-border rounded-2xl p-4">
                <div className="text-sm font-semibold text-text mb-3">{qi + 1}. {q.question}</div>
                <div className="flex flex-col gap-1.5">
                  {q.options.map((opt, oi) => {
                    const answered = answers[qi] !== undefined;
                    const isSelected = answers[qi] === oi;
                    const isCorrect = oi === q.answer;
                    let optClass = "bg-card border border-border text-text-secondary hover:bg-card-alt";
                    if (answered && isCorrect) optClass = "bg-accent-light border-accent text-accent";
                    if (answered && isSelected && !isCorrect) optClass = "bg-red-light border-red text-red";
                    if (answered && !isSelected && !isCorrect) optClass = "bg-card border-border text-text-muted";

                    return (
                      <button
                        key={oi}
                        onClick={() => handleAnswer(qi, oi)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${optClass}`}
                      >
                        {String.fromCharCode(65 + oi)}) {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-text-muted">
            Score: {Object.entries(answers).filter(([qi, oi]) => data.quiz![Number(qi)].answer === oi).length} / {data.quiz!.length}
          </div>
        </div>
      )}
    </div>
  );
}
