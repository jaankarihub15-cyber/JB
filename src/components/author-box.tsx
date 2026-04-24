import Link from "next/link";

interface AuthorBoxProps {
  updatedDate?: string;
}

export function AuthorBox({ updatedDate }: AuthorBoxProps) {
  return (
    <div className="flex items-center justify-between py-4 mt-6 border-t border-border">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent text-xs font-extrabold">AK</div>
        <div>
          <div className="text-sm font-semibold text-text">
            <Link href="/about#author" className="hover:text-accent transition-colors">Ashutosh Khulbe</Link>
          </div>
          <div className="text-xs text-text-muted">Researched &amp; verified from official sources</div>
        </div>
      </div>
      {updatedDate && (
        <div className="text-xs text-text-muted text-right">
          Updated<br /><span className="font-medium text-text-secondary">{updatedDate}</span>
        </div>
      )}
    </div>
  );
}

export function AuthorJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ashutosh Khulbe",
    url: "https://knowledgekendra.com/about#author",
    jobTitle: "Founder & Editor",
    worksFor: {
      "@type": "Organization",
      name: "KnowledgeKendra",
      url: "https://knowledgekendra.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
