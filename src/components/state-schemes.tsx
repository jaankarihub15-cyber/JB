import Link from "next/link";
import { getAllSchemes } from "@/lib/content";
import { states, StateKey } from "@/lib/categories";

function shortSub(text: string | undefined, max = 75): string {
  if (!text) return "";
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut) + "...";
}

export function StateSchemes({
  slug,
  state,
  excludeSlugs = [],
}: {
  slug: string;
  state?: string;
  excludeSlugs?: string[];
}) {
  if (!state) return null;

  const label = states[state as StateKey]?.label || state;
  const exclude = new Set([slug, ...excludeSlugs]);

  const siblings = getAllSchemes()
    .filter((s: any) => s.state === state && !exclude.has(s.slug))
    .sort((a: any, b: any) => a.slug.localeCompare(b.slug))
    .slice(0, 4);

  if (siblings.length === 0) return null;

  return (
    <div className="my-8 rounded-2xl border border-border bg-card p-5 md:p-6">
      <h3 className="text-base font-bold text-text mb-1">More {label} Schemes</h3>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        Schemes for {label} residents you may also qualify for.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {siblings.map((s: any) => (
          <Link
            key={s.slug}
            href={`/yojana/${s.slug}`}
            className="flex items-start gap-3 rounded-xl border border-border bg-bg p-4 hover:border-accent transition-colors"
          >
            <span className="text-xl shrink-0">{s.hero?.icon || "📋"}</span>
            <span>
              <span className="block text-sm font-bold text-text leading-snug">{s.title}</span>
              <span className="block text-xs text-text-secondary mt-0.5">{shortSub(s.hero?.one_liner)}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
