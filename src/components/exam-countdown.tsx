"use client";

import { useState, useEffect } from "react";

export function ExamCountdown({ examName, examDate }: { examName: string; examDate: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [days, setDays] = useState(0);

  useEffect(() => {
    const target = new Date(examDate).getTime();
    const update = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) { setTimeLeft("Exam day!"); setDays(0); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      setDays(d);
      setTimeLeft(`${d} day${d !== 1 ? "s" : ""} ${h} hr${h !== 1 ? "s" : ""}`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [examDate]);

  if (!examDate || !timeLeft) return null;

  const urgency = days <= 7 ? "bg-red-50 border-red-200" : days <= 30 ? "bg-amber-50 border-amber-200" : "bg-accent-light border-accent/20";
  const textColor = days <= 7 ? "text-red-600" : days <= 30 ? "text-amber-700" : "text-accent";

  return (
    <div className={`mt-4 mb-2 px-4 py-3 rounded-xl border ${urgency} flex items-center justify-between`}>
      <div>
        <div className="text-xs text-text-muted font-medium uppercase tracking-wide">Exam Countdown</div>
        <div className={`text-lg font-bold ${textColor}`}>{timeLeft}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-text-muted">{examName}</div>
        <div className="text-sm text-text-secondary">{new Date(examDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
      </div>
    </div>
  );
}
