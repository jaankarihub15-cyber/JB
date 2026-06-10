"use client";

import { useState, useEffect } from "react";

export function SaveForLater({ slug, title, url, onDark }: { slug: string; title: string; url: string; onDark?: boolean }) {
  const [saved, setSaved] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem("kk_saved") || "[]");
      setSaved(items.some((i: any) => i.slug === slug));
    } catch {}
  }, [slug]);

  const toggle = () => {
    try {
      let items = JSON.parse(localStorage.getItem("kk_saved") || "[]");
      if (saved) {
        items = items.filter((i: any) => i.slug !== slug);
      } else {
        items.unshift({ slug, title, url, savedAt: new Date().toISOString() });
        if (items.length > 30) items = items.slice(0, 30);
        setShowHint(true);
        setTimeout(() => setShowHint(false), 3200);
      }
      localStorage.setItem("kk_saved", JSON.stringify(items));
      setSaved(!saved);
    } catch {}
  };

  const labelClass = onDark
    ? "text-white font-semibold"
    : saved
    ? "text-accent font-semibold"
    : "text-text-muted";
  const borderClass = onDark
    ? "border-white/30 hover:border-white/60"
    : "border-border hover:border-accent/40";

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${borderClass} text-sm transition-all cursor-pointer`}
        aria-label={saved ? "Remove bookmark" : "Save for later"}
      >
        <span className="text-base">{saved ? "🔖" : "🏷️"}</span>
        <span className={labelClass}>{saved ? "Saved" : "Save"}</span>
      </button>
      {showHint && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-max max-w-[220px] bg-white text-text text-xs font-medium rounded-lg shadow-lg px-3 py-2 border border-border">
          Saved. Find it on the
          <a href="/" className="text-accent font-bold"> homepage</a> anytime.
        </div>
      )}
    </div>
  );
}

export function SavedPagesList() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("kk_saved") || "[]"));
    } catch {}
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="mt-8 mb-6">
      <h2 className="text-lg font-bold text-text mb-3 flex items-center gap-2">🔖 Your Saved Pages</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {items.slice(0, 8).map((item: any) => (
          <a
            key={item.slug}
            href={item.url}
            className="card px-4 py-3 min-w-[200px] max-w-[240px] shrink-0 hover:border-accent/30 transition-colors"
          >
            <div className="text-sm font-medium text-text line-clamp-2">{item.title}</div>
            <div className="text-xs text-text-muted mt-1">Saved {new Date(item.savedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
