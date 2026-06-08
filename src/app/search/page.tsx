"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

import { allPages } from "@/lib/search-data";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase() || "";

  const results = q.length > 1
    ? allPages.filter((p) => p.s.includes(q)).slice(0, 20)
    : [];

  return (
    <div className="max-w-[860px] mx-auto px-5 py-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-text mb-2">Search Results</h1>
      {q && <p className="text-sm text-text-secondary mb-6">Showing results for &quot;{searchParams.get("q")}&quot;</p>}
      {!q && <p className="text-sm text-text-secondary mb-6">Enter a search term to find pages</p>}

      {results.length > 0 ? (
        <div className="flex flex-col gap-3">
          {results.map((r) => (
            <Link
              key={r.url}
              href={r.url}
              className="bg-card border border-border rounded-2xl p-4 grid grid-cols-[40px_1fr] gap-3 hover:border-accent/40 hover:shadow-sm hover:-translate-y-px transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-card-alt flex items-center justify-center text-lg">{r.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold text-text">{r.title}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent-light text-accent">{r.cat}</span>
                </div>
                <div className="text-xs text-text-secondary leading-relaxed">{r.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : q.length > 1 ? (
        <p className="text-center py-10 text-text-muted">No results found for &quot;{searchParams.get("q")}&quot;</p>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-[860px] mx-auto px-5 py-6"><p className="text-text-muted">Loading...</p></div>}>
      <SearchResults />
    </Suspense>
  );
}
