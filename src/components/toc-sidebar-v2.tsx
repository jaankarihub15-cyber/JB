"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type TocItem = { id: string; text: string };

// Theme V2 sticky sidebar TOC with reading progress + active tracking.
// Desktop: sticky left column. Mobile: hidden (content full-width; the
// existing floating TOC pattern is not duplicated to avoid double TOCs).
export function TocSidebarV2({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <aside className="hidden lg:block sticky top-20 self-start w-[240px] shrink-0">
      <div className="toc-v2-box bg-card border border-border rounded-2xl p-5">
        <div className="h-1 bg-border rounded-full mb-4 overflow-hidden">
          <i
            className="block h-full bg-accent rounded-full transition-[width] duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-[10.5px] font-extrabold tracking-[0.1em] text-text-muted uppercase mb-3">
          On This Page
        </div>
        <nav className="flex flex-col gap-0.5">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className={`text-[12.5px] leading-snug font-semibold rounded-lg px-2.5 py-2 transition-colors ${
                activeId === it.id
                  ? "bg-accent-light text-accent"
                  : "text-text-secondary hover:bg-card-alt"
              }`}
            >
              {it.text}
            </a>
          ))}
        </nav>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-[12.5px] font-bold text-text mb-1">Not sure you qualify?</div>
          <div className="text-[11.5px] text-text-muted leading-snug mb-2.5">
            Check against 50+ schemes free.
          </div>
          <Link
            href="/check-eligibility"
            className="block text-center text-[12px] font-extrabold rounded-lg px-3 py-2.5 bg-accent text-white hover:bg-accent-dark transition-colors"
          >
            Check Eligibility →
          </Link>
        </div>
      </div>
    </aside>
  );
}
