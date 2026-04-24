"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/check-eligibility", label: "Eligibility" },
  { href: "/yojana", label: "Yojana" },
  { href: "/exam", label: "Exam" },
  { href: "/paisa", label: "Paisa" },
  { href: "/guide", label: "Guide" },
  { href: "/compare", label: "Compare" },
  { href: "/calculator", label: "Calc" },
  { href: "/news", label: "News" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const getActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-bg/92 backdrop-blur-md">
      <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-accent flex items-center justify-center text-white text-xs font-extrabold">
            K
          </div>
          <span className="text-base md:text-lg font-extrabold tracking-tight text-text">
            Knowledge<span className="text-accent">Kendra</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden md:flex gap-0.5 bg-card-alt rounded-2xl p-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  getActive(item.href)
                    ? "bg-card text-text shadow-sm"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-1.5">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search schemes, exams..."
                autoFocus
                className="w-44 md:w-52 px-3 py-1.5 rounded-xl border border-border bg-card text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setQuery(""); }}
                className="text-text-muted hover:text-text text-sm cursor-pointer px-1"
              >
                ✕
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-card-alt border border-border flex items-center justify-center text-text-muted hover:text-text hover:border-accent/40 transition-all cursor-pointer shrink-0"
              aria-label="Search"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="md:hidden overflow-x-auto border-t border-border">
        <div className="flex gap-0 px-4 py-1.5 min-w-max">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                getActive(item.href)
                  ? "bg-accent-light text-accent"
                  : "text-text-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
