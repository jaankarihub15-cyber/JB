"use client";

import { useState, useEffect } from "react";

export function SaveForLater({ slug, title, url }: { slug: string; title: string; url: string }) {
  const [saved, setSaved] = useState(false);

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
      }
      localStorage.setItem("kk_saved", JSON.stringify(items));
      setSaved(!saved);
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-accent/40 text-sm transition-all cursor-pointer"
      aria-label={saved ? "Remove bookmark" : "Save for later"}
    >
      <span className="text-base">{saved ? "🔖" : "🏷️"}</span>
      <span className={saved ? "text-accent font-semibold" : "text-text-muted"}>
        {saved ? "Saved" : "Save"}
      </span>
    </button>
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
