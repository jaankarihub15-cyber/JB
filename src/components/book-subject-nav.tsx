"use client";

import { useState, useEffect } from "react";

type Subject = { id: string; name: string; icon: string; count: number };

export function BookSubjectNav({ subjects }: { subjects: Subject[] }) {
  const [active, setActive] = useState(subjects[0]?.id ?? "");

  useEffect(() => {
    const handler = () => {
      let current = subjects[0]?.id ?? "";
      for (const s of subjects) {
        const el = document.getElementById(`subject-${s.id}`);
        if (el && el.getBoundingClientRect().top <= 120) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, [subjects]);

  const jump = (id: string) => {
    const el = document.getElementById(`subject-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-0 z-30 -mx-5 px-5 py-3 bg-bg/95 backdrop-blur border-b border-border mb-6">
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => jump(s.id)}
            className={`whitespace-nowrap text-sm font-semibold px-4 py-2 rounded-full border transition-colors flex items-center gap-2 ${
              active === s.id
                ? "bg-accent text-white border-accent"
                : "bg-card text-text border-border hover:border-accent/40"
            }`}
          >
            <span>{s.icon}</span>
            {s.name}
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                active === s.id ? "bg-white/25 text-white" : "bg-bg text-text-muted"
              }`}
            >
              {s.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
