"use client";

import { useState, useEffect, useRef } from "react";

type TocItem = {
  id: string;
  text: string;
};

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const tocRef = useRef<HTMLDivElement>(null);

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

    return () => observer.disconnect();
  }, [items]);

  // Hide TOC when footer is in view
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (items.length < 3) return null;

  return (
    <>
      {/* Mobile: floating button + drawer */}
      <div className="md:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-11 h-11 rounded-full bg-accent text-white shadow-lg flex items-center justify-center text-base cursor-pointer"
          aria-label="Table of contents"
        >
          ☰
        </button>
        {isOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsOpen(false)} />
            <div className="fixed bottom-20 right-5 w-72 max-h-[55vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-xl z-50 p-4">
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">On This Page</p>
              <nav className="flex flex-col gap-1">
                {items.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm py-1.5 px-2 rounded-lg transition-colors ${
                      activeId === item.id
                        ? "bg-accent-light text-accent font-semibold"
                        : "text-text-secondary hover:text-text hover:bg-card-alt"
                    }`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Desktop: sticky sidebar — hidden when footer visible */}
      {isVisible && (
        <div
          ref={tocRef}
          className="hidden xl:block fixed top-28 w-48 max-h-[calc(100vh-160px)] overflow-y-auto pr-2"
          style={{ right: "max(1rem, calc((100vw - 860px) / 2 - 220px))" }}
        >
          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">On This Page</p>
          <nav className="flex flex-col gap-0.5 border-l-2 border-border pl-3">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-[12px] py-1 transition-colors leading-snug ${
                  activeId === item.id
                    ? "text-accent font-semibold border-l-2 border-accent -ml-[14px] pl-[12px]"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
