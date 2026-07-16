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
const PPF_CALC: BridgeLink = { href: "/calculator/ppf-calculator", icon: "🧮", title: "PPF Calculator", sub: "See what 15 years of deposits grow to" };
const HEALTH_INS: BridgeLink = { href: "/paisa/health-insurance-guide", icon: "🏥", title: "Health Insurance Guide: Cover, Claims, Tax", sub: "What government cover does not pay for" };
const TERM_INS: BridgeLink = { href: "/paisa/term-insurance-guide", icon: "🛡️", title: "Term Insurance: Cover and How Much You Need", sub: "Protecting the family income, not just bills" };
const CIBIL_GUIDE: BridgeLink = { href: "/paisa/credit-score-guide", icon: "📈", title: "CIBIL Score: Meaning, Free Check, 600 to 750", sub: "Loan approval starts with this number" };
const CIBIL_CHECK: BridgeLink = { href: "/guide/check-cibil-score-free", icon: "🔍", title: "Check Your CIBIL Score Free on All 4 Bureaus", sub: "Step-by-step, no paid app needed" };
const HOME_LOAN: BridgeLink = { href: "/paisa/home-loan-guide", icon: "🏠", title: "Home Loan Guide: EMI, Eligibility, Rates, Tax", sub: "What banks check before approving" };
const EMI_CALC: BridgeLink = { href: "/calculator/emi-calculator", icon: "🧮", title: "EMI Calculator", sub: "Monthly instalment for any loan amount" };
const UPI_GUIDE: BridgeLink = { href: "/paisa/upi-guide", icon: "📱", title: "UPI Guide: Setup, Limits, Safety", sub: "Use the new account without visiting the branch" };
const WHAT_FD: BridgeLink = { href: "/paisa/what-is-fd", icon: "🏦", title: "What Is a Fixed Deposit and How It Works", sub: "The first step after opening an account" };

function examLink(slug: string, name: string): BridgeLink {
  return { href: `/exam/${slug}`, icon: "📝", title: `${name}: Eligibility, Pattern, Key Dates`, sub: "Full exam guide for government job aspirants" };
}

const SSC_CGL = examLink("ssc-cgl-2026", "SSC CGL Exam");
const NDA_EXAM = examLink("nda", "NDA Exam");
const CDS_EXAM = examLink("cds", "CDS Exam");

const STATE_EXAM: Record<string, BridgeLink> = {
  "andhra-pradesh": examLink("appsc", "APPSC Group Exams"),
  "bihar": examLink("bpsc", "BPSC Exam"),
  "chhattisgarh": examLink("cgpsc", "CGPSC Exam"),
  "haryana": examLink("hpsc", "HPSC Exam"),
  "jharkhand": examLink("jpsc", "JPSC Exam"),
  "karnataka": examLink("kpsc", "KPSC KAS Exam"),
  "madhya-pradesh": examLink("mppsc", "MPPSC Exam"),
  "rajasthan": examLink("rpsc-ras", "RPSC RAS Exam"),
  "tamil-nadu": examLink("tnpsc", "TNPSC Exam"),
  "uttarakhand": examLink("ukpsc", "UKPSC Exam"),
  "uttar-pradesh": examLink("uppsc-pcs", "UPPSC PCS Exam"),
  "west-bengal": examLink("wbpsc", "WBPSC Exam"),
};

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

const girlChildBridge: BridgeConfig = {
  heading: "Growing the Money Set Aside for Her",
  intro: "Scheme payouts for a daughter work best alongside a long-term deposit. Compare the options.",
  links: [SIP_FD_PPF, PPF_CALC],
};

const healthBridge: BridgeConfig = {
  heading: "Cover the Gaps Government Insurance Leaves",
  intro: "Scheme cover has limits on hospitals and amounts. These explain what full protection costs.",
  links: [HEALTH_INS, TERM_INS],
};

const businessBridge: BridgeConfig = {
  heading: "Before the Bank Approves Your Loan",
  intro: "Every business loan application starts with a credit check. Know your score before applying.",
  links: [CIBIL_GUIDE, CIBIL_CHECK],
};

const farmerBridge: BridgeConfig = {
  heading: "Parking Farm Income Between Seasons",
  intro: "Instalments and harvest income sit idle for months. These show where that money earns instead.",
  links: [SIP_FD_PPF, FD_CALC],
};

const housingBridge: BridgeConfig = {
  heading: "Funding the Rest of the House",
  intro: "Subsidy covers a part of the cost. A loan usually covers the rest, and the EMI decides everything.",
  links: [HOME_LOAN, EMI_CALC],
};

const bankingBridge: BridgeConfig = {
  heading: "Using the New Account Fully",
  intro: "An account is only step one. These show how to transact and save from it.",
  links: [UPI_GUIDE, WHAT_FD],
};

const defenceBridge: BridgeConfig = {
  heading: "Other Routes Into the Armed Forces",
  intro: "Agniveer is one entry. Permanent commission routes run through these exams.",
  links: [NDA_EXAM, CDS_EXAM],
};

function eduExamBridge(state?: string): BridgeConfig {
  const exam = (state && STATE_EXAM[state]) || SSC_CGL;
  return {
    heading: "What Comes After This Scheme",
    intro: "Students using this scheme are often preparing for the next step. These two cover it.",
    links: [exam, EDU_LOAN],
  };
}

function examOnlyBridge(state?: string): BridgeConfig {
  const exam = (state && STATE_EXAM[state]) || SSC_CGL;
  const second = exam.href === SSC_CGL.href ? EDU_LOAN : SSC_CGL;
  return {
    heading: "From Allowance to a Government Job",
    intro: "The allowance is temporary. These exams are the route to the permanent post.",
    links: [exam, second],
  };
}

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
  // Cross-category overrides (added with category rollout)
  "agnipath-scheme": defenceBridge,
  "pm-jan-dhan-yojana": bankingBridge,
  "pm-surya-ghar": housingBridge,
  "samaj-sathi": healthBridge,
  "bangla-awas-yojana": housingBridge,
  "saboojsathi": eduExamBridge("west-bengal"),
  "orunodoi-assam-beneficiary-list": monthlyCashBridge,
  "subhadra-yojana-odisha": monthlyCashBridge,
  "vahli-dikri-yojana": girlChildBridge,
  "bihar-labour-card": pensionBridge,
  "mgnrega-manipur": pensionBridge,
  "yuva-nidhi-scheme": examOnlyBridge("karnataka"),
  "abua-awas-yojana": housingBridge,
  "palanhar-yojana": monthlyCashBridge,
  "shubh-shakti-yojana": girlChildBridge,
};

// Pages with no plausible finance or exam intent. Forced links here would read as spam.
const SKIP_SLUGS = new Set([
  "digital-india",
  "jal-jeevan-mission",
  "jan-samarth",
  "matirkatha",
  "parivar-pehchan-patra",
  "saral-haryana",
  "mukhyamantri-mahalakshmi-kit-yojana",
  "shg-list-assam",
  "mukhyamantri-ghasiyari-kalyan-yojana",
  "indira-gandhi-smartphone-yojana",
]);

const SKIP_CATEGORIES = new Set(["food-subsidy", "welfare"]);

const MARRIAGE_WORDS = ["vivah", "shadi", "kalyana", "rupashree", "ashirwad", "moovalur", "marriage"];
const GIRL_CHILD_WORDS = ["sukanya", "kanya", "ladli", "laadli", "beti", "lek-ladki", "dikri", "bitiya"];
const BUSINESS_WORDS = ["udyami", "dukandar", "cmelp"];

function resolveBridge(slug: string, category?: string, state?: string): BridgeConfig | null {
  if (BRIDGE_MAP[slug]) return BRIDGE_MAP[slug];
  if (SKIP_SLUGS.has(slug)) return null;
  if (!category || SKIP_CATEGORIES.has(category)) return null;

  switch (category) {
    case "pension":
    case "senior-citizen":
    case "workers":
      return pensionBridge;
    case "women":
      if (MARRIAGE_WORDS.some((w) => slug.includes(w))) return marriageBridge;
      if (GIRL_CHILD_WORDS.some((w) => slug.includes(w))) return girlChildBridge;
      return monthlyCashBridge;
    case "education":
      if (BUSINESS_WORDS.some((w) => slug.includes(w))) return businessBridge;
      return eduExamBridge(state);
    case "employment":
      return businessBridge;
    case "farmer":
    case "agriculture":
      return farmerBridge;
    case "health":
      return healthBridge;
    case "housing":
      return housingBridge;
    default:
      return null;
  }
}

export function FinanceBridge({ slug, category, state }: { slug: string; category?: string; state?: string }) {
  const config = resolveBridge(slug, category, state);
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
