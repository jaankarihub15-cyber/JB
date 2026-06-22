"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { examCategories, schemeCategories } from "@/lib/categories";
import { allPages } from "@/lib/search-data";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Live search results for autocomplete
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return allPages
      .filter((p) => p.s.includes(q))
      .slice(0, 8);
  }, [query]);

  // Group results by category for grouped display
  const groupedResults = useMemo(() => {
    const groups: Record<string, typeof searchResults> = {};
    searchResults.forEach((r) => {
      if (!groups[r.cat]) groups[r.cat] = [];
      groups[r.cat].push(r);
    });
    return groups;
  }, [searchResults]);

  const getActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white text-base font-extrabold">K</div>
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-text">
              Knowledge<span className="text-accent">Kendra</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
          <nav className="hidden lg:flex items-center gap-1" ref={navRef}>

            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "exams" ? null : "exams")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  getActive("/exam") || openDropdown === "exams"
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:bg-card-alt hover:text-text"
                }`}
              >
                Exams
                <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${openDropdown === "exams" ? "rotate-180" : ""}`}>
                  <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {openDropdown === "exams" && (
                <div className="absolute top-full left-0 mt-2 w-[640px] bg-card border border-border rounded-2xl shadow-lg p-4 grid grid-cols-2 gap-1.5">
                  {Object.values(examCategories).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/exam-categories/${cat.slug}`}
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent-light transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center text-lg shrink-0">
                        {cat.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-text group-hover:text-accent">{cat.label}</div>
                        <div className="text-[11px] text-text-muted mt-0.5 line-clamp-1">{cat.examples}</div>
                      </div>
                    </Link>
                  ))}
                  <div className="col-span-2 mt-1 pt-3 border-t border-border flex items-center justify-between">
                    <Link
                      href="/exam"
                      onClick={() => setOpenDropdown(null)}
                      className="text-sm font-bold text-accent flex items-center gap-1"
                    >
                      View all 40 exams
                      <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                    </Link>
                    <Link
                      href="/compare/bank-po-vs-ssc-cgl-vs-state-psc"
                      onClick={() => setOpenDropdown(null)}
                      className="text-xs text-text-secondary hover:text-accent"
                    >
                      Bank PO vs SSC CGL vs PSC →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === "schemes" ? null : "schemes")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  getActive("/yojana") || openDropdown === "schemes"
                    ? "bg-accent text-white"
                    : "text-text-secondary hover:bg-card-alt hover:text-text"
                }`}
              >
                Schemes
                <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${openDropdown === "schemes" ? "rotate-180" : ""}`}>
                  <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {openDropdown === "schemes" && (
                <div className="absolute top-full right-0 mt-2 w-[640px] bg-card border border-border rounded-2xl shadow-lg p-4 grid grid-cols-2 gap-1.5">
                  {Object.values(schemeCategories).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/yojana-categories/${cat.slug}`}
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent-light transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center text-lg shrink-0">
                        {cat.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-text group-hover:text-accent">{cat.label}</div>
                        <div className="text-[11px] text-text-muted mt-0.5 line-clamp-1">{cat.examples}</div>
                      </div>
                    </Link>
                  ))}
                  <div className="col-span-2 mt-1 pt-3 border-t border-border">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Browse by state</div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {[
                        { slug: "maharashtra", label: "Maharashtra" },
                        { slug: "uttar-pradesh", label: "UP" },
                        { slug: "bihar", label: "Bihar" },
                        { slug: "madhya-pradesh", label: "MP" },
                        { slug: "rajasthan", label: "Rajasthan" },
                        { slug: "karnataka", label: "Karnataka" },
                        { slug: "telangana", label: "Telangana" },
                        { slug: "andhra-pradesh", label: "Andhra Pradesh" },
                        { slug: "assam", label: "Assam" },
                        { slug: "west-bengal", label: "West Bengal" },
                        { slug: "gujarat", label: "Gujarat" },
                        { slug: "punjab", label: "Punjab" },
                        { slug: "tamil-nadu", label: "Tamil Nadu" },
                      ].map((s) => (
                        <Link
                          key={s.slug}
                          href={`/yojana-by-state/${s.slug}`}
                          onClick={() => setOpenDropdown(null)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-card-alt text-text-secondary hover:bg-accent-light hover:text-accent"
                        >
                          {s.label}
                        </Link>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <Link
                        href="/yojana"
                        onClick={() => setOpenDropdown(null)}
                        className="text-sm font-bold text-accent flex items-center gap-1"
                      >
                        View all 55 schemes
                        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                      </Link>
                      <Link
                        href="/check-eligibility"
                        onClick={() => setOpenDropdown(null)}
                        className="text-xs text-text-secondary hover:text-accent"
                      >
                        Check what you qualify for →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/paisa"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                getActive("/paisa") ? "bg-accent text-white" : "text-text-secondary hover:bg-card-alt hover:text-text"
              }`}
            >
              Paisa
            </Link>

            <Link
              href="/calculator"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                getActive("/calculator") ? "bg-accent text-white" : "text-text-secondary hover:bg-card-alt hover:text-text"
              }`}
            >
              Calculators
            </Link>

            <Link
              href="/guide"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                getActive("/guide") ? "bg-accent text-white" : "text-text-secondary hover:bg-card-alt hover:text-text"
              }`}
            >
              Guides
            </Link>

            <Link
              href="/check-eligibility"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                getActive("/check-eligibility")
                  ? "bg-accent text-white"
                  : "bg-accent-light text-accent hover:bg-accent hover:text-white"
              }`}
            >
              Check Eligibility
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-card-alt hover:text-text transition-colors"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M12 12l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-card-alt hover:text-text transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg width="18" height="18" viewBox="0 0 18 18"><path d="M4 4l10 10M14 4l-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              )}
            </button>
          </div>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-3" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search schemes, exams, guides, calculators..."
                autoFocus
                className="w-full px-4 py-3 pl-11 rounded-xl bg-card-alt border border-border text-sm placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
              <svg width="16" height="16" viewBox="0 0 16 16" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {query.length > 0 && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-text-muted hover:bg-card-alt"
                  aria-label="Clear"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              )}
            </form>

            {/* Autocomplete results */}
            {query.length >= 2 && (
              <div className="mt-2 bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
                {searchResults.length > 0 ? (
                  <>
                    {Object.entries(groupedResults).map(([cat, items]) => (
                      <div key={cat}>
                        <div className="px-4 pt-3 pb-1 text-[10px] font-bold text-text-muted uppercase tracking-wider bg-card-alt">
                          {cat}
                        </div>
                        {items.map((r) => (
                          <Link
                            key={r.url}
                            href={r.url}
                            onClick={() => { setSearchOpen(false); setQuery(""); }}
                            className="flex items-start gap-3 px-4 py-2.5 hover:bg-accent-light transition-colors border-b border-border last:border-b-0"
                          >
                            <div className="w-8 h-8 rounded-lg bg-card-alt flex items-center justify-center text-sm shrink-0 mt-0.5">{r.icon}</div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-text line-clamp-1">{r.title}</div>
                              <div className="text-[11px] text-text-muted line-clamp-1 mt-0.5">{r.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ))}
                    <div className="px-4 py-2.5 bg-card-alt border-t border-border">
                      <button
                        onClick={(e) => { e.preventDefault(); handleSearch(e as any); }}
                        className="text-xs font-bold text-accent flex items-center gap-1.5"
                      >
                        View all results for &quot;{query}&quot;
                        <svg width="12" height="12" viewBox="0 0 14 14"><path d="M3 7h8m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-5 text-center">
                    <div className="text-xs text-text-muted mb-1">No results for &quot;{query}&quot;</div>
                    <div className="text-[11px] text-text-muted">Try a different keyword or browse categories above</div>
                  </div>
                )}
              </div>
            )}

            {/* Popular searches when empty */}
            {query.length < 2 && (
              <div className="mt-2 bg-card-alt rounded-xl p-3">
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Popular searches</div>
                <div className="flex flex-wrap gap-1.5">
                  {["PM Kisan", "Ayushman Bharat", "APPSC", "SSC CGL", "Majhi Ladki Bahin", "EPF balance", "Income tax calculator"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1 rounded-full text-[11px] font-semibold bg-card border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {mobileOpen && (
          <div className="lg:hidden pb-4 pt-2 space-y-1 border-t border-border">
            <details className="group">
              <summary className="list-none flex items-center justify-between px-4 py-3 rounded-xl hover:bg-card-alt cursor-pointer">
                <span className="font-semibold text-sm">Exams</span>
                <svg width="12" height="12" viewBox="0 0 10 10" className="group-open:rotate-180 transition-transform"><path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </summary>
              <div className="pl-4 mt-1 space-y-0.5">
                {Object.values(examCategories).map((cat) => (
                  <Link key={cat.slug} href={`/exam-categories/${cat.slug}`} className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-accent-light text-sm">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </Link>
                ))}
                <Link href="/exam" className="block px-4 py-2.5 rounded-lg text-sm font-bold text-accent">View all exams →</Link>
              </div>
            </details>

            <details className="group">
              <summary className="list-none flex items-center justify-between px-4 py-3 rounded-xl hover:bg-card-alt cursor-pointer">
                <span className="font-semibold text-sm">Schemes</span>
                <svg width="12" height="12" viewBox="0 0 10 10" className="group-open:rotate-180 transition-transform"><path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </summary>
              <div className="pl-4 mt-1 space-y-0.5">
                {Object.values(schemeCategories).map((cat) => (
                  <Link key={cat.slug} href={`/yojana-categories/${cat.slug}`} className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-accent-light text-sm">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </Link>
                ))}
                <Link href="/yojana" className="block px-4 py-2.5 rounded-lg text-sm font-bold text-accent">View all schemes →</Link>
              </div>
            </details>

            <Link href="/paisa" className="block px-4 py-3 rounded-xl hover:bg-card-alt font-semibold text-sm">Paisa</Link>
            <Link href="/calculator" className="block px-4 py-3 rounded-xl hover:bg-card-alt font-semibold text-sm">Calculators</Link>
            <Link href="/guide" className="block px-4 py-3 rounded-xl hover:bg-card-alt font-semibold text-sm">Guides</Link>
            <Link href="/check-eligibility" className="block px-4 py-3 rounded-xl bg-accent text-white font-semibold text-sm text-center">Check Eligibility</Link>
          </div>
        )}
      </div>
    </header>
  );
}
