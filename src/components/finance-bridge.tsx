import Link from "next/link";

interface BridgeLink {
  href: string;
  icon: string;
  title: string;
  sub: string;
}

interface BridgeConfig {
  heading: string;
  intro: string;
  links: BridgeLink[];
}

const NPS_PPF: BridgeLink = { href: "/paisa/nps-vs-ppf", icon: "🏦", title: "NPS vs PPF: Which Builds a Bigger Pension?", sub: "Compare returns, lock-in and tax benefits" };
const SIP_FD_PPF: BridgeLink = { href: "/paisa/sip-vs-fd-vs-ppf", icon: "📊", title: "SIP vs FD vs PPF: Where Should Savings Go?", sub: "Same money, three very different outcomes" };
const GOLD: BridgeLink = { href: "/paisa/gold-investment-guide", icon: "🪙", title: "Gold Investment Guide: Jewellery vs SGB vs Digital", sub: "What actually holds value at wedding time" };
const FD_CALC: BridgeLink = { href: "/calculator/fd-calculator", icon: "🧮", title: "FD Calculator", sub: "See what a fixed deposit grows to" };
const NPS_CALC: BridgeLink = { href: "/calculator/nps-calculator", icon: "🧮", title: "NPS Calculator", sub: "Estimate your pension corpus" };
const EDU_LOAN: BridgeLink = { href: "/paisa/education-loan-guide", icon: "🎓", title: "Education Loan Guide: Rates, Moratorium, Subsidy", sub: "When a bank loan beats waiting for a scheme" };

const pensionBridge: BridgeConfig = {
  heading: "Planning Beyond This Pension",
  intro: "Government pensions cover the basics. These guides show what else builds retirement income.",
  links: [NPS_PPF, NPS_CALC],
};

const monthlyCashBridge: BridgeConfig = {
  heading: "Make the Monthly Money Work",
  intro: "A fixed amount arriving every month is a savings opportunity. Here is where small regular amounts grow best.",
  links: [SIP_FD_PPF, FD_CALC],
};

const marriageBridge: BridgeConfig = {
  heading: "Wedding Money, Handled Smartly",
  intro: "Most marriage assistance goes toward gold. Know the options before buying.",
  links: [GOLD, FD_CALC],
};

const educationBridge: BridgeConfig = {
  heading: "If the Scholarship Falls Short",
  intro: "Scheme amounts rarely cover the full cost of study. These cover the gap.",
  links: [EDU_LOAN, SIP_FD_PPF],
};

const BRIDGE_MAP: Record<string, BridgeConfig> = {
  // Pension schemes
  "atal-pension-yojana": pensionBridge,
  "national-pension-scheme": pensionBridge,
  "haryana-old-age-pension": pensionBridge,
  "hp-old-age-pension": pensionBridge,
  "old-age-pension-punjab": pensionBridge,
  "uttarakhand-social-pension": pensionBridge,
  "jk-social-security-pension": pensionBridge,
  "sarvajan-pension-yojana": pensionBridge,
  // Monthly cash transfer schemes
  "gruha-lakshmi": monthlyCashBridge,
  "amma-vodi": monthlyCashBridge,
  "majhi-ladki-bahin": monthlyCashBridge,
  "lakshmir-bhandar": monthlyCashBridge,
  "mukhyamantri-maiya-samman-yojana": monthlyCashBridge,
  "indira-gandhi-pyari-behna-sukh-samman-nidhi-yojana": monthlyCashBridge,
  // Marriage assistance schemes
  "kalyana-lakshmi-telangana": marriageBridge,
  "rupashree-prakalpa": marriageBridge,
  // Education loan / scholarship schemes
  "bihar-student-credit-card": educationBridge,
  "digital-gujarat-scholarship": educationBridge,
  "e-kalyan-scholarship-jharkhand": educationBridge,
  "har-chatravriti-scholarship": educationBridge,
  "namo-lakshmi-namo-saraswati-yojana": educationBridge,
};

export function FinanceBridge({ slug }: { slug: string }) {
  const config = BRIDGE_MAP[slug];
  if (!config) return null;

  return (
    <div className="my-8 rounded-2xl border border-border bg-card p-5 md:p-6">
      <h3 className="text-base font-bold text-text mb-1">{config.heading}</h3>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">{config.intro}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {config.links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="flex items-start gap-3 rounded-xl border border-border bg-bg p-4 hover:border-accent transition-colors"
          >
            <span className="text-xl shrink-0">{l.icon}</span>
            <span>
              <span className="block text-sm font-bold text-text leading-snug">{l.title}</span>
              <span className="block text-xs text-text-secondary mt-0.5">{l.sub}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
