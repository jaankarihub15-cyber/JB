import Link from "next/link";
import { getAllSchemes } from "@/lib/content";
import { Badge, Tag } from "@/components/ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government Schemes — Eligibility, Benefits & How to Apply",
  description: "Complete list of Indian government schemes explained simply. Check eligibility, benefits, documents needed, and how to apply.",
  alternates: { canonical: "https://knowledgekendra.com/yojana" },
};

export default function YojanaHubPage() {
  const schemes = getAllSchemes();
  const central = schemes.filter((s: any) => !['ladli-behna-yojana','kanya-sumangala-yojana','majhi-ladki-bahin','chiranjeevi-yojana','gruha-lakshmi','rythu-bandhu','kalia-yojana','sikho-kamao-yojana','bihar-student-credit-card','up-shramik-card','lek-ladki-yojana','kanya-vivah-yojana','mahtari-vandana','ap-ysr-aarogyasri'].includes(s.slug));
  const state = schemes.filter((s: any) => ['ladli-behna-yojana','kanya-sumangala-yojana','majhi-ladki-bahin','chiranjeevi-yojana','gruha-lakshmi','rythu-bandhu','kalia-yojana','sikho-kamao-yojana','bihar-student-credit-card','up-shramik-card','lek-ladki-yojana','kanya-vivah-yojana','mahtari-vandana','ap-ysr-aarogyasri'].includes(s.slug));

  return (
    <div className="max-w-[1100px] mx-auto px-6">
      {/* Hero header */}
      <div className="mt-8 mb-8 bg-card border border-border rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center text-3xl">🏛️</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">Government Yojanas</h1>
            <p className="text-sm text-text-secondary">{schemes.length} schemes — central and state — explained simply</p>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Link href="/check-eligibility" className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold">Check Your Eligibility</Link>
          <span className="px-4 py-2 rounded-xl bg-card-alt text-xs font-semibold text-text-muted border border-border">{central.length} Central · {state.length} State Schemes</span>
        </div>
      </div>

      {/* Central Schemes */}
      {central.length > 0 && (
        <>
          <h2 className="text-lg font-extrabold tracking-tight mb-4">Central Government Schemes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
            {central.map((s: any) => (
              <Link key={s.slug} href={`/yojana/${s.slug}`} className="bg-card border border-border rounded-2xl p-4 grid grid-cols-[44px_1fr] gap-3 hover:border-accent/40 hover:shadow-sm hover:-translate-y-px transition-all">
                <div className="w-11 h-11 rounded-xl bg-accent-light flex items-center justify-center text-lg">{s.hero?.icon || "📋"}</div>
                <div>
                  <div className="text-sm font-bold text-text">{s.title}</div>
                  <div className="text-xs text-text-secondary mt-0.5 line-clamp-2 leading-relaxed">{s.hero?.one_liner}</div>
                  <div className="flex gap-1.5 mt-2">
                    {s.hero?.stats?.slice(0, 2).map((st: any) => (
                      <span key={st.label} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-accent-light text-accent">{st.value}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* State Schemes */}
      {state.length > 0 && (
        <>
          <h2 className="text-lg font-extrabold tracking-tight mb-4">State Government Schemes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
            {state.map((s: any) => (
              <Link key={s.slug} href={`/yojana/${s.slug}`} className="bg-card border border-border rounded-2xl p-4 grid grid-cols-[44px_1fr] gap-3 hover:border-accent/40 hover:shadow-sm hover:-translate-y-px transition-all">
                <div className="w-11 h-11 rounded-xl bg-orange-light flex items-center justify-center text-lg">{s.hero?.icon || "📋"}</div>
                <div>
                  <div className="text-sm font-bold text-text">{s.title}</div>
                  <div className="text-xs text-text-secondary mt-0.5 line-clamp-2 leading-relaxed">{s.hero?.one_liner}</div>
                  <div className="flex gap-1.5 mt-2">
                    {s.tags?.slice(0, 2).map((t: string) => (
                      <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-orange-light text-orange">{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
