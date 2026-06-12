import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";
import { FixHubClient } from "@/components/fix-hub-client";

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

      {/* Hero band: heading + intro. Tall bottom padding leaves green space
          for the search bar (rendered by the client) to sit INSIDE the band. */}
      <div className="hero-band-v2">
        <div className="max-w-[1140px] mx-auto px-5 md:px-6">
          <div className="pt-6 text-[12.5px] font-semibold text-[#8FB8A2]">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="mx-1.5 opacity-60">/</span>
            <b className="text-[#DFF3E8]">Fix</b>
          </div>
          <div className="pt-8 max-w-[680px]">
            <span className="inline-block text-[11px] font-bold tracking-wide px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#DFF3E8] mb-4">
              🔧 Application Fix Hub
            </span>
            <h1 className="text-[30px] md:text-[42px] font-extrabold leading-[1.12] tracking-[-0.6px] text-white mb-3">
              Documents do not match?{" "}
              <span className="text-[#9FE2BE]">Fix it the right way.</span>
            </h1>
            <p className="text-[15.5px] text-[#BFDCCB] leading-relaxed max-w-[560px]">
              When an application fails because your name, date of birth or details do not match
              across documents, find the exact verified correction path. Which one to fix, where,
              and the proof you need.
            </p>
          </div>
          {/* spacer that keeps green band height; search bar overlaps up into this via negative margin */}
          <div className="h-[120px] md:h-[130px]" />
        </div>
      </div>

      {/* Search-in-band + filter card + showing + cards (client) */}
      <FixHubClient />

      {/* Checker strip */}
      <div className="max-w-[1140px] mx-auto px-5 md:px-6 mt-12">
        <div className="rounded-[22px] p-8 md:p-9 flex flex-col md:flex-row md:items-center justify-between gap-5 bg-[linear-gradient(120deg,#0E2418,#1B6B4A)]">
          <div>
            <h2 className="text-white text-[21px] font-extrabold mb-1.5">Not sure where the mismatch is?</h2>
            <p className="text-[#BFE0CE] text-[13.5px] leading-relaxed max-w-[480px]">
              If your scheme or job application was rejected but you are not sure why, start with the
              eligibility checker, then come back here to fix the exact document.
            </p>
          </div>
          <Link
            href="/check-eligibility"
            className="bg-white text-accent-dark font-extrabold text-[14px] px-6 py-3.5 rounded-xl whitespace-nowrap text-center hover:bg-[#F0F7F3] transition-colors"
          >
            Check Eligibility →
          </Link>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-5 md:px-6 pb-14 mt-8">
        <div className="p-4 bg-card-alt border border-border rounded-2xl text-[12.5px] text-text-muted leading-relaxed">
          📋 Every fix is verified against official sources (UIDAI, Income Tax / Protean, EPFO and
          state portals). Where a route varies by state, we name the authority rather than a single
          national form.
        </div>
      </div>
    </div>
  );
}
