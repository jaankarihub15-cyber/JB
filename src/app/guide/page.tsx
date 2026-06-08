import Link from "next/link";
import { getAllGuides } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How-To Guides — Aadhaar, PAN, Passport & More",
  description: "Step-by-step guides for government processes. Update Aadhaar, apply for PAN card, passport, voter ID, certificates, and more.",
  alternates: { canonical: "https://knowledgekendra.com/guide" },
};

export default function GuideHubPage() {
  const guides = getAllGuides();

  return (
    <div className="max-w-[1100px] mx-auto px-6">
      <div className="mt-8 mb-8 bg-card border border-border rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-light flex items-center justify-center text-3xl">📋</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">How-To Guides</h1>
            <p className="text-sm text-text-secondary">{guides.length} step-by-step guides for government processes</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {["Aadhaar", "PAN Card", "Passport", "Driving License", "Certificates", "EPF", "DigiLocker"].map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-lg bg-card-alt text-xs font-semibold text-text-muted border border-border">{t}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-12">
        {guides.map((g: any) => (
          <Link key={g.slug} href={`/guide/${g.slug}`} className="bg-card border border-border rounded-2xl p-5 hover:border-purple/40 hover:shadow-sm hover:-translate-y-px transition-all">
            <div className="flex gap-2 mb-2 flex-wrap">
              {g.hero?.tags?.slice(0, 2).map((t: string) => (
                <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-light text-purple">{t}</span>
              ))}
            </div>
            <div className="text-sm font-bold text-text mb-1">{g.title}</div>
            <div className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{g.hero?.one_liner}</div>
            <div className="text-[11px] text-text-muted mt-2">{g.hero?.read_time} read</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
