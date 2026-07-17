import Link from "next/link";

const BOOK_MAP: Record<string, { href: string; label: string; note: string }> = {
  "upsc-cse": { href: "/books/upsc", label: "UPSC booklist", note: "Subject-wise books with budget shelves and honest verdicts" },
  "ssc-cgl-2026": { href: "/books/ssc-cgl", label: "SSC CGL booklist", note: "Subject-wise books with budget shelves and honest verdicts" },
  "ssc-chsl": { href: "/books/ssc-cgl", label: "SSC CGL booklist", note: "CHSL tests the same four subjects, so the CGL books cover it fully" },
  "ssc-cpo": { href: "/books/ssc-cgl", label: "SSC CGL booklist", note: "CPO Paper 1 uses the same subjects, so the CGL books cover it" },
  "ssc-mts": { href: "/books/ssc-cgl", label: "SSC CGL booklist", note: "MTS covers the same subjects at an easier level, the same books work" },
  "rbi-grade-b": { href: "/books/rbi-grade-b", label: "RBI Grade B booklist", note: "Phase 1 and the unique Phase 2 ESI and Finance books" },
  "rrb-ntpc": { href: "/books/rrb-ntpc", label: "RRB NTPC booklist", note: "Subject-wise railway exam books with buying tips" },
  "rrb-group-d": { href: "/books/rrb-ntpc", label: "RRB NTPC & Group D booklist", note: "One booklist covers both railway exams" },
  "ibps-po": { href: "/books/banking", label: "Bank exam booklist", note: "One set of books works across IBPS and SBI PO/Clerk" },
  "ibps-clerk": { href: "/books/banking", label: "Bank exam booklist", note: "One set of books works across IBPS and SBI PO/Clerk" },
  "sbi-po": { href: "/books/banking", label: "Bank exam booklist", note: "One set of books works across IBPS and SBI PO/Clerk" },
};

export function BookBridge({ slug }: { slug: string }) {
  const m = BOOK_MAP[slug];
  if (!m) return null;

  return (
    <Link
      href={m.href}
      className="block my-6 bg-card border border-border rounded-2xl p-5 hover:border-accent transition-colors"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">📚</span>
        <span>
          <span className="block text-sm font-bold text-text">Best books for this exam: see the {m.label}</span>
          <span className="block text-xs text-text-secondary mt-0.5">{m.note}</span>
        </span>
      </div>
    </Link>
  );
}
