import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";
import { FIX_PAGES } from "@/lib/fix-data";

export const metadata: Metadata = {
  title: "Document Mismatch? Fix It Here - KnowledgeKendra",
  description:
    "Application failed because your documents do not match? Find the verified, official fix for Aadhaar, PAN, EPF, bank and certificate mismatches. No login.",
  alternates: { canonical: "https://knowledgekendra.com/fix" },
};

export default function FixHubPage() {
  return (
    <div className="theme-v2 py-0">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://knowledgekendra.com" },
          { name: "Fix", url: "https://knowledgekendra.com/fix" },
        ])}
      />
      <div className="hero-band-v2">
        <div className="max-w-[760px] mx-auto px-5 md:px-6">
          <div className="pt-6 text-[12.5px] font-semibold text-[#8FB8A2]">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="mx-1.5 opacity-60">/</span>
            <b className="text-[#DFF3E8]">Fix</b>
          </div>
          <div className="pt-10 pb-16">
            <span className="inline-block text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#DFF3E8] mb-3.5">
              🔧 Application Fix Hub
            </span>
            <h1 className="text-[26px] md:text-[30px] font-extrabold leading-[1.2] text-white mb-2.5">
              Documents do not match? Fix it here.
            </h1>
            <p className="text-[15px] text-[#BFDCCB] max-w-xl">
              When an application fails because your name, date of birth or details do not match
              across documents, this is where you find the exact, verified correction path.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-5 md:px-6 pb-12 -mt-8 relative z-10">
        <div className="grid gap-3">
          {FIX_PAGES.map((p) => (
            <Link
              key={p.slug}
              href={`/fix/${p.slug}`}
              className="bg-card border border-border rounded-2xl p-4 hover:border-accent/40 transition-colors shadow-[0_2px_10px_rgba(14,36,24,0.05)]"
            >
              <div className="text-[15px] font-extrabold text-text mb-1">{p.h1}</div>
              <div className="text-[13px] text-text-secondary leading-relaxed">{p.intro}</div>
            </Link>
          ))}
        </div>

        <div className="mt-8 p-4 bg-card-alt border border-border rounded-2xl text-[12.5px] text-text-muted leading-relaxed">
          📋 Every fix is verified against official sources (UIDAI, Income Tax / Protean, EPFO and
          state portals). Where a route varies by state, we name the authority rather than a single
          national form.
        </div>
      </div>
    </div>
  );
}
