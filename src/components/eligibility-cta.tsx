import Link from "next/link";

export function EligibilityCTA() {
  return (
    <div className="my-8 rounded-2xl border-2 border-accent/20 bg-accent-light p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-2xl shrink-0">✅</div>
      <div className="flex-1">
        <h3 className="text-base font-bold text-text mb-1">Not sure if you qualify?</h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          Check your eligibility for 50+ government schemes in 2 minutes. No login, no fees. Just answer a few simple questions.
        </p>
      </div>
      <Link
        href="/check-eligibility"
        className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition-colors whitespace-nowrap shrink-0"
      >
        Check Eligibility →
      </Link>
    </div>
  );
}
