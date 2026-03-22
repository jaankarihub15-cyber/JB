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
