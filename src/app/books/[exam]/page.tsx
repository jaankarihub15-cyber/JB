import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getBookBySlug, getAllBookSlugs } from "@/lib/content";
import { Breadcrumb, SectionHeading, FAQ, Tag } from "@/components/ui";
import { JsonLd, faqSchema, breadcrumbSchema } from "@/components/json-ld";
import { AuthorBox } from "@/components/author-box";

type Props = { params: Promise<{ exam: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllBookSlugs().map((exam) => ({ exam }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { exam } = await params;
  const b = getBookBySlug(exam);
  if (!b) return {};
  const url = `https://knowledgekendra.com/books/${exam}`;
  return {
    title: b.title,
    description: b.meta_description,
    alternates: { canonical: url },
    openGraph: { title: b.title, description: b.meta_description, url, type: "article" },
  };
}

const priorityBadge: Record<string, { label: string; cls: string }> = {
  must: { label: "Must-have", cls: "bg-red/10 text-red" },
  recommended: { label: "Recommended", cls: "bg-accent-light text-accent-dark" },
  optional: { label: "Optional", cls: "bg-orange-light text-orange" },
};

export default async function BooksExamPage({ params }: Props) {
  const { exam } = await params;
  const b = getBookBySlug(exam);
  if (!b) notFound();

  const crumbSchema = [
    { name: "Home", url: "https://knowledgekendra.com/" },
    { name: "Books", url: "https://knowledgekendra.com/books" },
    { name: b.exam_name, url: `https://knowledgekendra.com/books/${exam}` },
  ];
  const crumbNav = [
    { label: "Home", href: "/" },
    { label: "Books", href: "/books" },
    { label: b.exam_name },
  ];

  return (
    <div className="max-w-[860px] mx-auto px-5 py-6">
      <JsonLd data={breadcrumbSchema(crumbSchema)} />
      <JsonLd data={faqSchema(b.faqs)} />

      <Breadcrumb items={crumbNav} />

      {/* Hero */}
      <div className="mt-4 mb-6 bg-card border border-border rounded-3xl p-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center text-3xl">
            {b.hero.icon}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">{b.title}</h1>
            <p className="text-xs text-text-muted mt-1">Updated: {b.hero.updated_date} · By Ash K.</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary mb-4">{b.hero.one_liner}</p>
        <div className="flex flex-wrap gap-2">
          {b.hero.stats.map((s, i) => (
            <span key={i} className="px-3 py-2 rounded-xl bg-card-alt border border-border text-xs">
              <span className="font-bold text-accent">{s.value}</span>{" "}
              <span className="text-text-muted">{s.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Intro */}
      <div className="space-y-3 mb-2">
        {b.intro.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-text">{p}</p>
        ))}
      </div>



      {/* Reading order */}
      <SectionHeading icon="🧭">Reading order at a glance</SectionHeading>
      <div className="bg-card border border-border rounded-2xl p-5 mb-4 space-y-3">
        {b.reading_order.map((r) => (
          <div key={r.step} className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-lg bg-accent text-white grid place-items-center font-bold text-sm shrink-0">
              {r.step}
            </div>
            <div className="text-sm">
              <b className="block text-text">{r.title}</b>
              <span className="text-text-secondary">{r.description}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Subjects - simple grouped lists */}
      {b.subjects.map((subject) => {
        const ncert = subject.books.filter((bk) => bk.tier === "ncert");
        const standard = subject.books.filter((bk) => bk.tier === "standard");
        return (
          <section key={subject.id} className="mt-8">
            <SectionHeading icon={subject.icon}>{subject.name} books</SectionHeading>
            <p className="text-sm text-text-muted -mt-2 mb-4">{subject.intro}</p>

            {ncert.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-light text-blue-dark">
                    STEP 1 · NCERT
                  </span>
                  <span className="text-sm font-semibold text-text">Build the base</span>
                </div>
                <div className="flex flex-col gap-4 mb-5">
                  {ncert.map((bk, i) => (
                    <BookCard key={i} bk={bk} />
                  ))}
                </div>
              </>
            )}

            {standard.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-accent-light text-accent-dark">
                    {ncert.length > 0 ? "STEP 2 · STANDARD" : "STANDARD BOOKS"}
                  </span>
                  <span className="text-sm font-semibold text-text">Core exam books</span>
                </div>
                <div className="flex flex-col gap-4">
                  {standard.map((bk, i) => (
                    <BookCard key={i} bk={bk} />
                  ))}
                </div>
              </>
            )}
          </section>
        );
      })}

      {/* Buying tips */}
      <SectionHeading icon="🛒">Buying tips</SectionHeading>
      <div className="bg-card border border-border rounded-2xl p-5 mb-6 space-y-2">
        {b.buying_tips.map((t, i) => (
          <div key={i} className="flex gap-2 text-sm text-text">
            <span className="text-accent font-bold">·</span>
            <span>{t}</span>
          </div>
        ))}
      </div>

      {/* Related exam cross-link */}
      {b.related_exam_slug && (
        <Link
          href={`/exam/${b.related_exam_slug}`}
          className="block mb-8 bg-accent-light border border-accent/30 rounded-2xl p-4 text-sm text-accent-dark font-semibold hover:bg-accent-light/70"
        >
          Looking for the {b.exam_name} exam pattern, eligibility, and dates? See our {b.exam_name} exam guide →
        </Link>
      )}

      {/* FAQs */}
      <SectionHeading icon="❓">Frequently asked questions</SectionHeading>
      <div className="mb-8">
        {b.faqs.map((f, i) => (
          <FAQ key={i} question={f.question} answer={f.answer} />
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {b.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <p className="text-xs text-text-muted italic border-t border-border pt-4 mb-6">{b.disclaimer}</p>

      <AuthorBox />
    </div>
  );
}

function BookCard({ bk }: { bk: any }) {
  const badge = priorityBadge[bk.priority] ?? priorityBadge.recommended;
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex gap-5 shadow-sm">
      <BookCover title={bk.title} author={bk.author} tier={bk.tier} />
      <div className="flex-1 min-w-0">
        <h3 className="text-[17px] font-bold text-text leading-snug">{bk.title}</h3>
        <div className="text-[13px] text-text-muted mb-2">
          {bk.author}
          {bk.publisher ? ` · ${bk.publisher}` : ""} · {bk.price_approx}
        </div>
        <p className="text-[13.5px] text-text-secondary mb-3 leading-relaxed">{bk.why}</p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl ${badge.cls}`}>{badge.label}</span>
          {bk.beginner_friendly && (
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-accent-light text-accent-dark">
              Beginner OK
            </span>
          )}
          {/* Book link: direct product URL if set, else Amazon search. */}
          <a
            href={
              bk.amazon_url
                ? `${bk.amazon_url}${bk.amazon_url.includes("?") ? "&" : "?"}`
                : `https://www.amazon.in/s?k=${encodeURIComponent(
                    `${bk.title} ${bk.author || ""}`.trim()
                  )}&`
            }
            rel="nofollow"
            target="_blank"
            className="text-[12.5px] font-bold px-3.5 py-1.5 rounded-lg"
            style={{ background: "#FF9900", color: "#1a1a1a" }}
          >
            View on Amazon
          </a>
        </div>
      </div>
    </div>
  );
}

// Branded, original cover tile (not a real cover image — KK's own design, copyright-safe)
const COVER_PALETTES = [
  { from: "#1B6B4A", to: "#0f4730", spine: "#0a3522" },
  { from: "#2563EB", to: "#1e3a8a", spine: "#162d6b" },
  { from: "#EA580C", to: "#9a3412", spine: "#7c2d12" },
  { from: "#7C3AED", to: "#5b21b6", spine: "#4c1d95" },
  { from: "#DC2626", to: "#991b1b", spine: "#7f1d1d" },
  { from: "#0d9488", to: "#0f766e", spine: "#115e59" },
];

function BookCover({ title, author, tier }: { title: string; author: string; tier: string }) {
  // deterministic color from the title so each book keeps a stable cover
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  const p = COVER_PALETTES[hash % COVER_PALETTES.length];
  const shortAuthor = author.replace(/\s*\(.*?\)\s*/g, "").split("&")[0].trim();
  return (
    <div
      className="w-[80px] h-[112px] rounded-md shrink-0 relative overflow-hidden flex flex-col justify-between p-2"
      style={{
        background: `linear-gradient(150deg, ${p.from}, ${p.to})`,
        boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
      }}
    >
      {/* spine */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: p.spine }} />
      {/* tier chip */}
      <div className="text-[7px] font-bold uppercase tracking-wide text-white/70 pl-1.5">
        {tier === "ncert" ? "NCERT" : ""}
      </div>
      {/* title */}
      <div
        className="text-white font-bold pl-1.5 leading-[1.15]"
        style={{ fontSize: title.length > 34 ? "8.5px" : "10px" }}
      >
        {title.length > 46 ? title.slice(0, 44) + "…" : title}
      </div>
      {/* author + KK mark */}
      <div className="pl-1.5">
        <div className="text-[7.5px] text-white/80 leading-tight mb-1 truncate">{shortAuthor}</div>
        <div className="text-[6.5px] font-bold text-white/50 tracking-wider">KK</div>
      </div>
    </div>
  );
}
