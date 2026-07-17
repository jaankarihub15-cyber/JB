import Link from "next/link";

const PAY_EXAMS = new Set([
  "upsc-cse", "ssc-cgl-2026", "ssc-chsl", "ssc-cpo", "ssc-mts", "ssc-gd-constable",
  "rrb-ntpc", "rrb-group-d", "nda", "cds", "afcat", "ugc-net",
]);

const CGPA_EXAMS = new Set([
  "gate", "cat-2026", "jee-main", "neet-ug", "cuet-ug", "clat-2026", "afcat", "ugc-net", "aiims-ini-cet",
]);

export function CalcBridge({ slug }: { slug: string }) {
  const links: { href: string; title: string; sub: string }[] = [];
  if (PAY_EXAMS.has(slug)) {
    links.push({
      href: "/calculator/8th-pay-commission-calculator",
      title: "Estimate your salary under the 8th Pay Commission",
      sub: "This post follows central pay scales. Model your basic pay at any fitment factor",
    });
  }
  if (CGPA_EXAMS.has(slug)) {
    links.push({
      href: "/calculator/cgpa-calculator",
      title: "Convert your CGPA to percentage",
      sub: "Application forms ask for percentage. Get the right number with your university's formula",
    });
  }
  if (links.length === 0) return null;

  return (
    <div className="my-6 grid gap-3">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="block bg-card border border-border rounded-2xl p-5 hover:border-accent transition-colors"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">🧮</span>
            <span>
              <span className="block text-sm font-bold text-text">{l.title}</span>
              <span className="block text-xs text-text-secondary mt-0.5">{l.sub}</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
