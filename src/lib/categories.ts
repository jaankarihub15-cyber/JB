// Category configuration - single source of truth
// All categorization data lives here. Add new schemes/exams by tagging them.

export type ExamCategoryKey =
  | "banking"
  | "ssc"
  | "upsc"
  | "state-psc"
  | "railway"
  | "teaching"
  | "medical"
  | "engineering"
  | "defense"
  | "other";

export type SchemeCategoryKey =
  | "women"
  | "farmer"
  | "health"
  | "education"
  | "employment"
  | "pension"
  | "housing"
  | "food-subsidy"
  | "workers"
  | "other-central";

export type StateKey =
  | "maharashtra"
  | "madhya-pradesh"
  | "uttar-pradesh"
  | "bihar"
  | "rajasthan"
  | "telangana"
  | "andhra-pradesh"
  | "karnataka"
  | "odisha"
  | "chhattisgarh"
  | "assam";

export const examCategories: Record<ExamCategoryKey, {
  slug: ExamCategoryKey;
  label: string;
  short: string;
  icon: string;
  description: string;
  examples: string;
}> = {
  "banking": {
    slug: "banking",
    label: "Banking Exams",
    short: "Banking",
    icon: "🏦",
    description: "Reserve Bank, IBPS, State Bank exams. Salaries, eligibility, comparison.",
    examples: "RBI, IBPS, SBI",
  },
  "ssc": {
    slug: "ssc",
    label: "SSC Exams",
    short: "SSC",
    icon: "📝",
    description: "Combined Graduate Level, CHSL, MTS, CPO. Tier-1 and Tier-2 pattern explained.",
    examples: "CGL, CHSL, MTS",
  },
  "upsc": {
    slug: "upsc",
    label: "UPSC Exams",
    short: "UPSC",
    icon: "🎯",
    description: "Civil Services, NDA, EPFO, CDS. India's most competitive exams.",
    examples: "CSE, NDA",
  },
  "state-psc": {
    slug: "state-psc",
    label: "State PSC Exams",
    short: "State PSC",
    icon: "🏛️",
    description: "UPPSC, BPSC, APPSC and all state public service commissions.",
    examples: "UPPSC, BPSC, APPSC",
  },
  "railway": {
    slug: "railway",
    label: "Railway Exams",
    short: "Railway",
    icon: "🚂",
    description: "RRB NTPC, Group D, ALP. Indian Railway recruitment 2026.",
    examples: "RRB NTPC, Group D",
  },
  "teaching": {
    slug: "teaching",
    label: "Teaching Exams",
    short: "Teaching",
    icon: "🎓",
    description: "CTET, REET, UPTET. Teacher eligibility tests across states.",
    examples: "CTET, REET, UPTET",
  },
  "medical": {
    slug: "medical",
    label: "Medical Exams",
    short: "Medical",
    icon: "🩺",
    description: "NEET UG, AIIMS INI-CET, AIIMS Nursing. Medical entrance exams.",
    examples: "NEET, AIIMS",
  },
  "engineering": {
    slug: "engineering",
    label: "Engineering Exams",
    short: "Engineering",
    icon: "⚙️",
    description: "GATE, JEE Main. Engineering entrance and PG exams.",
    examples: "GATE, JEE",
  },
  "defense": {
    slug: "defense",
    label: "Defense Exams",
    short: "Defense",
    icon: "⚔️",
    description: "NDA, AFCAT. Indian Armed Forces recruitment exams.",
    examples: "NDA, AFCAT",
  },
  "other": {
    slug: "other",
    label: "Other Exams",
    short: "Other",
    icon: "📚",
    description: "CAT, CLAT, CUET UG, UGC NET. MBA, law, university exams.",
    examples: "CAT, CLAT, CUET",
  },
};

export const schemeCategories: Record<SchemeCategoryKey, {
  slug: SchemeCategoryKey;
  label: string;
  short: string;
  icon: string;
  description: string;
  examples: string;
}> = {
  "women": {
    slug: "women",
    label: "Women & Girls Schemes",
    short: "Women",
    icon: "👩",
    description: "Schemes for women, girls, mothers across India. Direct benefit transfers, marriage assistance, scholarships.",
    examples: "Majhi Ladki Bahin, Lek Ladki, Beti Bachao",
  },
  "farmer": {
    slug: "farmer",
    label: "Farmer & Agriculture Schemes",
    short: "Farmer",
    icon: "🌾",
    description: "Income support, crop insurance, irrigation, equipment subsidies for Indian farmers.",
    examples: "PM Kisan, Rythu Bharosa, Fasal Bima",
  },
  "health": {
    slug: "health",
    label: "Health & Insurance Schemes",
    short: "Health",
    icon: "🏥",
    description: "Free or subsidized healthcare, hospital coverage, medical insurance for Indian citizens.",
    examples: "Ayushman Bharat, Chiranjeevi/MAAY",
  },
  "education": {
    slug: "education",
    label: "Education & Skill Schemes",
    short: "Education",
    icon: "🎓",
    description: "Scholarships, skill development, internships, student credit cards for Indian students.",
    examples: "Kanya Sumangala, PMKVY, Seekho Kamao",
  },
  "employment": {
    slug: "employment",
    label: "Employment & Business Schemes",
    short: "Employment",
    icon: "💼",
    description: "Self-employment loans, startup support, MSME funding, entrepreneurship schemes.",
    examples: "MUDRA, Stand-Up India, PM Vishwakarma",
  },
  "pension": {
    slug: "pension",
    label: "Pension & Retirement Schemes",
    short: "Pension",
    icon: "👴",
    description: "Pension plans for senior citizens, unorganized workers, savings schemes for retirement.",
    examples: "Atal Pension, NPS, PM SYM",
  },
  "housing": {
    slug: "housing",
    label: "Housing Schemes",
    short: "Housing",
    icon: "🏠",
    description: "Free or subsidized housing for rural and urban poor in India.",
    examples: "PMAY Gramin, PMAY Urban",
  },
  "food-subsidy": {
    slug: "food-subsidy",
    label: "Food & Subsidy Schemes",
    short: "Food",
    icon: "🍚",
    description: "Free ration, subsidized LPG, food security programs for Indian families.",
    examples: "Free Ration, Ujjwala, PM Garib Kalyan",
  },
  "workers": {
    slug: "workers",
    label: "Workers & Labour Schemes",
    short: "Workers",
    icon: "👷",
    description: "Benefits, insurance, registration for organized and unorganized sector workers.",
    examples: "e-Shram Card, UP Shramik Card",
  },
  "other-central": {
    slug: "other-central",
    label: "Other Central Schemes",
    short: "Other",
    icon: "📋",
    description: "Digital India, Jal Jeevan Mission, and other major national programs.",
    examples: "Digital India, Jal Jeevan",
  },
};

export const states: Record<StateKey, {
  slug: StateKey;
  label: string;
  short: string;
}> = {
  "maharashtra": { slug: "maharashtra", label: "Maharashtra", short: "MH" },
  "madhya-pradesh": { slug: "madhya-pradesh", label: "Madhya Pradesh", short: "MP" },
  "uttar-pradesh": { slug: "uttar-pradesh", label: "Uttar Pradesh", short: "UP" },
  "bihar": { slug: "bihar", label: "Bihar", short: "BR" },
  "rajasthan": { slug: "rajasthan", label: "Rajasthan", short: "RJ" },
  "telangana": { slug: "telangana", label: "Telangana", short: "TS" },
  "andhra-pradesh": { slug: "andhra-pradesh", label: "Andhra Pradesh", short: "AP" },
  "karnataka": { slug: "karnataka", label: "Karnataka", short: "KA" },
  "odisha": { slug: "odisha", label: "Odisha", short: "OD" },
  "chhattisgarh": { slug: "chhattisgarh", label: "Chhattisgarh", short: "CG" },
  "assam": { slug: "assam", label: "Assam", short: "AS" },
};

// Helper: get all exams in a category from the loaded exam list
export function getExamsByCategory(allExams: any[], category: ExamCategoryKey) {
  return allExams.filter(e => e.category === category);
}

// Helper: get all schemes in a topic category
export function getSchemesByCategory(allSchemes: any[], category: SchemeCategoryKey) {
  return allSchemes.filter(s => s.category === category);
}

// Helper: get all schemes for a state (includes central + state-specific)
export function getSchemesByState(allSchemes: any[], state: StateKey) {
  return allSchemes.filter(s => s.state === state || (!s.state && s.isCentral));
}
