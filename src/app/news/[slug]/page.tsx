import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, SectionHeading, FAQ } from "@/components/ui";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/json-ld";
import fs from "fs";
import path from "path";

function getArticle(slug: string) {
  const file = path.join(process.cwd(), "src/content/news", `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function getAllSlugs() {
  const dir = path.join(process.cwd(), "src/content/news");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f: string) => f.endsWith(".json"))
    .map((f: string) => f.replace(".json", ""));
}

export function generateStaticParams() {
  return getAllSlugs().map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `https://knowledgekendra.com/news/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      images: [{ url: `https://knowledgekendra.com/news/${article.slug}.png`, width: 1200, height: 675, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [`https://knowledgekendra.com/news/${article.slug}.png`],
    },
  };
}

const calloutColors: Record<string, { border: string; bg: string }> = {
  warning: { border: "#DC2626", bg: "#FEE2E2" },
  tip: { border: "#EA580C", bg: "#FFF7ED" },
  info: { border: "#2563EB", bg: "#DBEAFE" },
};

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const cc = calloutColors[article.callout?.variant] || calloutColors.info;

  return (
    <div className="max-w-[860px] mx-auto px-5 py-6">
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://knowledgekendra.com" },
        { name: "News", url: "https://knowledgekendra.com/news" },
        { name: article.title, url: `https://knowledgekendra.com/news/${article.slug}` },
      ])} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description: article.excerpt,
        image: `https://knowledgekendra.com/news/${article.slug}.png`,
        datePublished: article.date,
        dateModified: article.date,
        author: { "@type": "Person", name: article.author },
        publisher: {
          "@type": "Organization",
          name: "KnowledgeKendra",
          url: "https://knowledgekendra.com",
          logo: { "@type": "ImageObject", url: "https://knowledgekendra.com/og-image.png" },
        },
      }} />
      {article.faqs?.length > 0 && <JsonLd data={faqSchema(article.faqs)} />}

      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "News", href: "/news" }, { label: article.title }]} />

      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "#1B6B4A" }}>{article.category}</span>
        <span className="text-xs text-text-muted">{article.date}</span>
        <span className="text-xs text-text-muted">• By {article.author}</span>
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight text-text mb-4">{article.title}</h1>

      <div className="relative w-full mb-6 rounded-xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
        <img src={`/news/${article.slug}.png`} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {article.body?.map((para: string, i: number) => (
        <p key={i} className="text-[15px] text-text-secondary leading-[1.75] mb-5">{para}</p>
      ))}

      {article.callout && (
        <div className="my-5 rounded-r-lg p-4" style={{ borderLeft: `4px solid ${cc.border}`, backgroundColor: cc.bg }}>
          <p className="text-sm font-bold mb-1.5 text-text flex items-center gap-2">
            <span>{article.callout.variant === "warning" ? "⚠️" : article.callout.variant === "tip" ? "🎯" : "💡"}</span>
            <span>{article.callout.heading}</span>
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">{article.callout.content}</p>
        </div>
      )}

      {article.faqs?.length > 0 && (
        <>
          <SectionHeading icon="❓">Frequently asked questions</SectionHeading>
          {article.faqs.map((f: any) => <FAQ key={f.question} question={f.question} answer={f.answer} />)}
        </>
      )}

      {article.related_pages?.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm font-bold text-text mb-3">Read more on KnowledgeKendra</p>
          <div className="flex flex-wrap gap-2">
            {article.related_pages.map((rp: any) => (
              <Link key={rp.url} href={rp.url} className="px-4 py-2 rounded-lg text-sm bg-card border border-border hover:border-accent/40 text-text-secondary transition-colors">{rp.title} →</Link>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-text-muted mt-8 italic">Published: {article.date} • Source: Official government press releases and notifications.</p>
    </div>
  );
}
