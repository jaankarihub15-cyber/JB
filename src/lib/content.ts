import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "src/content");

export type SchemeContent = {
  slug: string;
  title: string;
  meta_description: string;
  hero: {
    status: string;
    one_liner: string;
    icon: string;
    updated_date: string;
    stats: { label: string; value: string }[];
  };
  quick_actions: { icon: string; label: string; url: string }[];
  what_is_it: string[];
  eligibility: { label: string; value: string; highlight: boolean }[];
  eligibility_filters: {
    gender: string[];
    age_min: number;
    age_max: number;
    occupation: string[];
    income_max: number;
    category: string[];
    states: string[];
  };
  how_to_apply: { step: number; title: string; description: string }[];
  important_alert?: { text: string; type: string };
  important_dates: { label: string; value: string; highlight: boolean }[];
  faqs: { question: string; answer: string }[];
  official_portal: { name: string; url: string };
  related_pages: { title: string; slug: string; tag: string }[];
  tags: string[];
  ministry: string;
  launch_year: number;
  last_reviewed?: string;
};

export type ExamContent = {
  slug: string;
  title: string;
  meta_description: string;
  hero: {
    status: string;
    one_liner: string;
    icon: string;
    updated_date: string;
    stats: { label: string; value: string }[];
  };
  key_details: { label: string; value: string; highlight: boolean }[];
  exam_pattern: {
    tier_name: string;
    description?: string;
    subjects: { name: string; questions: number; marks: number }[];
    total_questions: number;
    total_marks: number;
    duration: string;
    negative_marking: string;
  }[];
  major_posts: {
    post: string;
    pay_level: string;
    in_hand_salary: string;
    department: string;
  }[];
  important_dates: { label: string; value: string; highlight: boolean }[];
  preparation_tips: string[];
  faqs: { question: string; answer: string }[];
  official_portal: { name: string; url: string };
  related_pages: { title: string; slug: string; tag: string }[];
  tags: string[];
  last_reviewed?: string;
};

export type PaisaContent = {
  slug: string;
  title: string;
  meta_description: string;
  hero: {
    one_liner: string;
    icon: string;
    updated_date: string;
    tags: string[];
    read_time: string;
    stats: { label: string; value: string }[];
  };
  sections: any[];
  faqs: { question: string; answer: string }[];
  disclaimer: string;
  related_pages: { title: string; slug: string; tag: string }[];
  tags: string[];
  last_reviewed?: string;
};

export type GuideContent = {
  slug: string;
  title: string;
  meta_description: string;
  hero: {
    one_liner: string;
    icon: string;
    updated_date: string;
    tags: string[];
    read_time: string;
    stats: { label: string; value: string }[];
  };
  sections: any[];
  faqs: { question: string; answer: string }[];
  disclaimer: string;
  related_pages: { title: string; slug: string; tag: string }[];
  tags: string[];
  last_reviewed?: string;
};

function readJsonFiles<T>(subDir: string): T[] {
  const dir = path.join(contentDir, subDir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf-8");
      return JSON.parse(raw) as T;
    });
}

export function getAllSchemes(): SchemeContent[] {
  return readJsonFiles<SchemeContent>("schemes");
}

export function getSchemeBySlug(slug: string): SchemeContent | undefined {
  return getAllSchemes().find((s) => s.slug === slug);
}

export function getAllExams(): ExamContent[] {
  return readJsonFiles<ExamContent>("exams");
}

export function getExamBySlug(slug: string): ExamContent | undefined {
  return getAllExams().find((e) => e.slug === slug);
}

export function getAllPaisaArticles(): PaisaContent[] {
  return readJsonFiles<PaisaContent>("paisa");
}

export function getPaisaBySlug(slug: string): PaisaContent | undefined {
  return getAllPaisaArticles().find((p) => p.slug === slug);
}

// Get all scheme slugs for static generation
export function getAllSchemeSlugs(): string[] {
  return getAllSchemes().map((s) => s.slug);
}

export function getAllExamSlugs(): string[] {
  return getAllExams().map((e) => e.slug);
}

export function getAllPaisaSlugs(): string[] {
  return getAllPaisaArticles().map((p) => p.slug);
}

export function getAllGuides(): GuideContent[] {
  return readJsonFiles<GuideContent>("guides");
}

export function getGuideBySlug(slug: string): GuideContent | undefined {
  return getAllGuides().find((g) => g.slug === slug);
}

export function getAllGuideSlugs(): string[] {
  return getAllGuides().map((g) => g.slug);
}

export type CompareContent = {
  slug: string;
  title: string;
  meta_description: string;
  hero: {
    one_liner: string;
    icon: string;
    updated_date: string;
    tags: string[];
    read_time: string;
    stats: { label: string; value: string }[];
  };
  sections: any[];
  faqs: { question: string; answer: string }[];
  disclaimer: string;
  related_pages: { title: string; slug: string; tag: string }[];
  tags: string[];
  last_reviewed?: string;
};

export function getAllCompare(): CompareContent[] {
  return readJsonFiles<CompareContent>("compare");
}

export function getCompareBySlug(slug: string): CompareContent | undefined {
  return getAllCompare().find((c) => c.slug === slug);
}

export function getAllCompareSlugs(): string[] {
  return getAllCompare().map((c) => c.slug);
}

// ── Sarkari Naukri ──
export type SarkariNaukriContent = {
  slug: string;
  title: string;
  meta_description: string;
  hero: {
    status?: string;
    one_liner: string;
    icon: string;
    updated_date: string;
    stats: { label: string; value: string }[];
  };
  sections: any[];
  faqs: { question: string; answer: string }[];
  disclaimer?: string;
  related_pages: { title: string; slug: string; tag?: string }[];
  tags: string[];
  last_reviewed?: string;
};

export function getAllSarkariNaukri(): SarkariNaukriContent[] {
  return readJsonFiles<SarkariNaukriContent>("sarkari-naukri");
}
export function getSarkariNaukriBySlug(slug: string): SarkariNaukriContent | undefined {
  return getAllSarkariNaukri().find((s) => s.slug === slug);
}
export function getAllSarkariNaukriSlugs(): string[] {
  return getAllSarkariNaukri().map((s) => s.slug);
}

// ── Education ──
export type EducationContent = {
  slug: string;
  title: string;
  meta_description: string;
  hero: {
    status?: string;
    one_liner: string;
    icon: string;
    updated_date: string;
    stats: { label: string; value: string }[];
  };
  sections: any[];
  faqs: { question: string; answer: string }[];
  disclaimer?: string;
  related_pages: { title: string; slug: string; tag?: string }[];
  tags: string[];
  last_reviewed?: string;
};

export function getAllEducation(): EducationContent[] {
  return readJsonFiles<EducationContent>("education");
}
export function getEducationBySlug(slug: string): EducationContent | undefined {
  return getAllEducation().find((e) => e.slug === slug);
}
export function getAllEducationSlugs(): string[] {
  return getAllEducation().map((e) => e.slug);
}

// ── Legal ──
export type LegalContent = {
  slug: string;
  title: string;
  meta_description: string;
  hero: {
    status?: string;
    one_liner: string;
    icon: string;
    updated_date: string;
    stats: { label: string; value: string }[];
  };
  sections: any[];
  faqs: { question: string; answer: string }[];
  disclaimer?: string;
  related_pages: { title: string; slug: string; tag?: string }[];
  tags: string[];
  last_reviewed?: string;
};

export function getAllLegal(): LegalContent[] {
  return readJsonFiles<LegalContent>("legal");
}
export function getLegalBySlug(slug: string): LegalContent | undefined {
  return getAllLegal().find((l) => l.slug === slug);
}
export function getAllLegalSlugs(): string[] {
  return getAllLegal().map((l) => l.slug);
}

// ===== BOOKS =====
export type BookItem = {
  title: string;
  author: string;
  publisher?: string;
  price_approx: string;
  tier: "ncert" | "standard";
  priority: "must" | "recommended" | "optional";
  beginner_friendly?: boolean;
  why: string;
  edition_note?: { kind: "any" | "current"; text: string };
  amazon_url?: string;
};
export type BookSubject = {
  id: string;
  name: string;
  icon: string;
  intro: string;
  books: BookItem[];
};
export type BooksContent = {
  slug: string;
  exam_name: string;
  title: string;
  meta_description: string;
  hero: {
    one_liner: string;
    icon: string;
    updated_date: string;
    stats: { label: string; value: string }[];
  };
  intro: string[];
  quick_answer?: string;
  reading_order: { step: number; title: string; description: string }[];
  buying_plan?: { step: number; title: string; description: string; spend?: string }[];
  versus?: { heading: string; a: { name: string; pick_if: string }; b: { name: string; pick_if: string }; verdict: string }[];
  free_resources?: { title: string; where: string }[];
  subjects: BookSubject[];
  buying_tips: string[];
  faqs: { question: string; answer: string }[];
  disclaimer: string;
  related_exam_slug?: string;
  tags: string[];
  last_reviewed?: string;
};

export function getAllBooks(): BooksContent[] {
  return readJsonFiles<BooksContent>("books");
}
export function getBookBySlug(slug: string): BooksContent | undefined {
  return getAllBooks().find((b) => b.slug === slug);
}
export function getAllBookSlugs(): string[] {
  return getAllBooks().map((b) => b.slug);
}

// ── Women ──
export type WomenContent = {
  slug: string;
  title: string;
  meta_description: string;
  hero: {
    status?: string;
    one_liner: string;
    icon: string;
    updated_date: string;
    stats: { label: string; value: string }[];
  };
  sections: any[];
  faqs: { question: string; answer: string }[];
  disclaimer?: string;
  related_pages: { title: string; slug: string; tag?: string }[];
  tags: string[];
  last_reviewed?: string;
};

export function getAllWomen(): WomenContent[] {
  return readJsonFiles<WomenContent>("women");
}
export function getWomenBySlug(slug: string): WomenContent | undefined {
  return getAllWomen().find((w) => w.slug === slug);
}
export function getAllWomenSlugs(): string[] {
  return getAllWomen().map((w) => w.slug);
}

// ── Banking & Finance ──
export type BankingFinanceContent = {
  slug: string;
  title: string;
  meta_description: string;
  hero: {
    status?: string;
    one_liner: string;
    icon: string;
    updated_date: string;
    stats: { label: string; value: string }[];
  };
  sections: any[];
  faqs: { question: string; answer: string }[];
  disclaimer?: string;
  related_pages: { title: string; slug: string; tag?: string }[];
  tags: string[];
  last_reviewed?: string;
};

export function getAllBankingFinance(): BankingFinanceContent[] {
  return readJsonFiles<BankingFinanceContent>("banking-finance");
}
export function getBankingFinanceBySlug(slug: string): BankingFinanceContent | undefined {
  return getAllBankingFinance().find((b) => b.slug === slug);
}
export function getAllBankingFinanceSlugs(): string[] {
  return getAllBankingFinance().map((b) => b.slug);
}

// ── Senior Citizen ──
export type SeniorCitizenContent = {
  slug: string;
  title: string;
  meta_description: string;
  hero: {
    status?: string;
    one_liner: string;
    icon: string;
    updated_date: string;
    stats: { label: string; value: string }[];
  };
  sections: any[];
  faqs: { question: string; answer: string }[];
  disclaimer?: string;
  related_pages: { title: string; slug: string; tag?: string }[];
  tags: string[];
  last_reviewed?: string;
};

export function getAllSeniorCitizen(): SeniorCitizenContent[] {
  return readJsonFiles<SeniorCitizenContent>("senior-citizen");
}
export function getSeniorCitizenBySlug(slug: string): SeniorCitizenContent | undefined {
  return getAllSeniorCitizen().find((s) => s.slug === slug);
}
export function getAllSeniorCitizenSlugs(): string[] {
  return getAllSeniorCitizen().map((s) => s.slug);
}

// ── Agriculture ──
export type AgricultureContent = {
  slug: string;
  title: string;
  meta_description: string;
  hero: {
    status?: string;
    one_liner: string;
    icon: string;
    updated_date: string;
    stats: { label: string; value: string }[];
  };
  sections: any[];
  faqs: { question: string; answer: string }[];
  disclaimer?: string;
  related_pages: { title: string; slug: string; tag?: string }[];
  tags: string[];
  last_reviewed?: string;
};

export function getAllAgriculture(): AgricultureContent[] {
  return readJsonFiles<AgricultureContent>("agriculture");
}
export function getAgricultureBySlug(slug: string): AgricultureContent | undefined {
  return getAllAgriculture().find((a) => a.slug === slug);
}
export function getAllAgricultureSlugs(): string[] {
  return getAllAgriculture().map((a) => a.slug);
}
