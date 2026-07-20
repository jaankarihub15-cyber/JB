import Link from "next/link";

// Scheme pages: cash/DBT schemes get the payment-failure card.
// Same exclusions as FinanceBridge: pages with no money flow get nothing.
const SKIP_SLUGS = new Set([
  "digital-india", "jal-jeevan-mission", "jan-samarth", "matirkatha",
  "parivar-pehchan-patra", "saral-haryana", "mukhyamantri-mahalakshmi-kit-yojana",
  "shg-list-assam", "mukhyamantri-ghasiyari-kalyan-yojana", "indira-gandhi-smartphone-yojana",
]);
const SKIP_CATEGORIES = new Set(["food-subsidy", "welfare"]);

export function SchemeFixBridge({ slug, category }: { slug: string; category?: string }) {
  if (SKIP_SLUGS.has(slug)) return null;
  if (!category || SKIP_CATEGORIES.has(category)) return null;

  return (
    <Link
      href="/fix/aadhaar-bank-name-mismatch"
      className="block my-6 bg-card border border-border rounded-2xl p-5 hover:border-accent transition-colors"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">🛠️</span>
        <span>
          <span className="block text-sm font-bold text-text">
            Payment failed or stuck? It is usually a name mismatch
          </span>
          <span className="block text-xs text-text-secondary mt-0.5">
            If your Aadhaar and bank names differ even slightly, DBT credits bounce. Here is the exact fix, step by step
          </span>
        </span>
      </div>
    </Link>
  );
}

// Guide pages: each guide links to its matching document-fix page(s).
const GUIDE_FIX_MAP: Record<string, { href: string; title: string; sub: string }[]> = {
  "apply-pan-card": [
    { href: "/fix/pan-correction-online", title: "Fix a wrong name or DOB on your PAN", sub: "Correction request, documents, and fees, step by step" },
    { href: "/fix/aadhaar-pan-name-mismatch", title: "Aadhaar-PAN name mismatch blocking linking?", sub: "Which document to correct and how" },
  ],
  "link-aadhaar-pan": [
    { href: "/fix/aadhaar-pan-name-mismatch", title: "Linking failing on a name mismatch?", sub: "Fix the mismatch first, then link. The exact route" },
  ],
  "link-aadhaar-bank": [
    { href: "/fix/aadhaar-bank-name-mismatch", title: "Bank rejecting the Aadhaar link over your name?", sub: "Match the records and re-seed NPCI for DBT" },
  ],
  "check-epf-balance": [
    { href: "/fix/epf-claim-rejected-name-mismatch", title: "EPF claim rejected for a name mismatch?", sub: "The joint declaration route that actually works" },
    { href: "/fix/dob-mismatch-aadhaar-epf", title: "DOB differs between Aadhaar and EPF?", sub: "Fix it before it blocks your withdrawal" },
  ],
  "check-ration-card": [
    { href: "/fix/ration-card-name-correction", title: "Wrong name on the ration card?", sub: "Correction process, documents, and where to apply" },
  ],
  "apply-passport": [
    { href: "/fix/aadhaar-name-correction", title: "Name differs across your documents?", sub: "Fix Aadhaar first, the passport form checks it letter for letter" },
  ],
  "get-marriage-certificate": [
    { href: "/fix/aadhaar-name-correction", title: "Changing your name after marriage?", sub: "Update Aadhaar first so every other record follows" },
  ],
};

export function GuideFixBridge({ slug }: { slug: string }) {
  const links = GUIDE_FIX_MAP[slug];
  if (!links) return null;

  return (
    <div className="my-6 grid gap-3">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="block bg-card border border-border rounded-2xl p-5 hover:border-accent transition-colors"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">🛠️</span>
            <span>
              <span className="block text-sm font-bold text-text">{l.title}</span>
              <span className="block text-xs text-text-secondary mt-0.5">{l.sub}</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
