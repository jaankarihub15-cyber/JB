import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financial Calculators — SIP, EMI, FD, PPF, NPS, GST, Gratuity, EPF & More",
  description: "Free financial calculators for SIP, EMI, FD, PPF, NPS, GST, gratuity, EPF, HRA, income tax, CGPA, 8th Pay Commission, and lump sum. Instant results with no signup.",
  alternates: { canonical: "https://knowledgekendra.com/calculator" },
};

const calculators = [
  { slug: "sip-calculator", title: "SIP Calculator", desc: "Calculate returns on monthly SIP investments in mutual funds", icon: "📈", color: "bg-accent-light text-accent", searches: "100K+/mo" },
  { slug: "emi-calculator", title: "EMI Calculator", desc: "Calculate monthly EMI for home loan, car loan, or personal loan", icon: "🏠", color: "bg-blue-light text-blue", searches: "80K+/mo" },
  { slug: "nps-calculator", title: "NPS Calculator", desc: "Estimate retirement corpus and monthly pension from National Pension System", icon: "🏛️", color: "bg-purple-light text-purple", searches: "100K+/mo" },
  { slug: "gst-calculator", title: "GST Calculator", desc: "Add or remove GST at 5%, 12%, 18%, 28% slabs with CGST/SGST split", icon: "🧾", color: "bg-orange-light text-orange", searches: "100K+/mo" },
  { slug: "fd-calculator", title: "FD Calculator", desc: "Calculate maturity amount and interest on fixed deposits", icon: "🏦", color: "bg-orange-light text-orange", searches: "50K+/mo" },
  { slug: "ppf-calculator", title: "PPF Calculator", desc: "Calculate PPF maturity amount with yearly deposits over 15 years", icon: "🔒", color: "bg-accent-light text-accent", searches: "30K+/mo" },
  { slug: "income-tax-calculator", title: "Income Tax Calculator", desc: "Compare tax under old vs new regime for FY 2025-26", icon: "📋", color: "bg-purple-light text-purple", searches: "60K+/mo" },
  { slug: "gratuity-calculator", title: "Gratuity Calculator", desc: "Calculate gratuity amount based on salary and years of service", icon: "💼", color: "bg-blue-light text-blue", searches: "100K+/mo" },
  { slug: "hra-calculator", title: "HRA Exemption Calculator", desc: "Calculate HRA tax exemption under Section 10(13A)", icon: "🏘️", color: "bg-orange-light text-orange", searches: "10K+/mo" },
  { slug: "epf-calculator", title: "EPF Calculator", desc: "Estimate your provident fund corpus at retirement with interest", icon: "🏗️", color: "bg-accent-light text-accent", searches: "10K+/mo" },
  { slug: "8th-pay-commission-calculator", title: "8th Pay Commission Calculator", desc: "Estimate salary under 8th CPC with fitment factor and city-wise HRA", icon: "🏛️", color: "bg-blue-light text-blue", searches: "10K+/mo" },
  { slug: "cgpa-calculator", title: "CGPA Calculator", desc: "Calculate CGPA from subjects, credits, and grades. Convert to percentage", icon: "🎓", color: "bg-purple-light text-purple", searches: "10K+/mo" },
  { slug: "lumpsum-calculator", title: "Lump Sum Calculator", desc: "Calculate returns on one-time mutual fund investment", icon: "💰", color: "bg-accent-light text-accent", searches: "15K+/mo" },
];

export default function CalculatorHubPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-6">
      <div className="mt-8 mb-8 bg-card border border-border rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center text-3xl">🧮</div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">Financial Calculators</h1>
            <p className="text-sm text-text-secondary">Free, instant calculations — no signup, no ads, no nonsense</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-12">
        {calculators.map((c) => (
          <Link
            key={c.slug}
            href={`/calculator/${c.slug}`}
            className="bg-card border border-border rounded-2xl p-5 hover:border-accent/40 hover:shadow-sm hover:-translate-y-px transition-all"
          >
            <div className="text-3xl mb-3">{c.icon}</div>
            <div className="text-sm font-bold text-text mb-1">{c.title}</div>
            <div className="text-[11px] text-text-secondary leading-relaxed mb-3">{c.desc}</div>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${c.color}`}>
              {c.searches} searches
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
