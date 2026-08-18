import Link from "next/link";
import type { Metadata } from "next";
import { getAllBooks } from "@/lib/content";
import { Breadcrumb } from "@/components/ui";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Best Books for Competitive Exams 2026 - Subject-Wise Guides",
  description:
    "Honest, exam-wise book guides for UPSC, SSC CGL, Banking, RBI Grade B and Railways. NCERT-first reading order, no coaching agenda. Updated 2026.",
  alternates: { canonical: "https://knowledgekendra.com/books" },
  robots: { index: false, follow: false },
};

export default function BooksHubPage() {
  const books = getAllBooks();
  const totalBooks = books.reduce(
    (n, b) => n + b.subjects.reduce((m, s) => m + s.books.length, 0),
    0
  );

  const crumbSchema = [
    { name: "Home", url: "https://knowledgekendra.com/" },
    { name: "Books", url: "https://knowledgekendra.com/books" },
  ];

  const tags = ["No coaching sales pitch", "Reading order included", "Beginner vs advanced"];
  const stats = [
    { value: String(books.length), label: "Exam categories" },
    { value: `${totalBooks}+`, label: "Books explained" },
    { value: "2026", label: "Latest editions" },
    { value: "Free", label: "PDF sources noted" },
  ];

  return (
    <div className="max-w-[1000px] mx-auto px-5 py-6">
      <JsonLd data={breadcrumbSchema(crumbSchema)} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Books" }]} />

      {/* Hero */}
      <div className="mt-4 mb-6 bg-card border border-border rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center text-3xl">📚</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">Best Books for Competitive Exams</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Honest, exam-wise book guides with no coaching agenda.
            </p>
          </div>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          We explain what each book covers, who it suits, the right reading order, and common mistakes. Updated for 2026.
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent-light text-accent-dark">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4">
            <div className="text-xl font-extrabold text-accent">{s.value}</div>
            <div className="text-xs text-text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Exam cards */}
      <h2 className="text-lg font-extrabold tracking-tight mb-4 flex items-center gap-2">
        <span>📂</span> Choose your exam
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {books.map((b) => {
          const total = b.subjects.reduce((n, s) => n + s.books.length, 0);
          return (
            <Link
              key={b.slug}
              href={`/books/${b.slug}`}
              className="bg-card border border-border rounded-2xl p-5 hover:border-accent hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center text-2xl mb-3">
                {b.hero.icon}
              </div>
              <h3 className="text-base font-bold text-text mb-1">{b.exam_name}</h3>
              <p className="text-[13px] text-text-secondary mb-3 leading-relaxed">{b.hero.one_liner}</p>
              <div className="text-xs text-accent font-semibold">
                {total} books · {b.subjects.length} subjects →
              </div>
            </Link>
          );
        })}
      </div>

      <p className="text-xs text-text-muted italic border-t border-border pt-4">
        Book prices and editions are approximate and last checked in July 2026. Independent guide, not affiliated with any exam body or publisher. As an Amazon Associate, KnowledgeKendra earns from qualifying purchases made through links on these pages.
      </p>
    </div>
  );
}
