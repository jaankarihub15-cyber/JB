import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

import { FIX_PAGES } from "@/lib/fix-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://knowledgekendra.com";

  // Static + hub pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/yojana`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/exam`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/guide`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/paisa`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/compare`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/calculator`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/sarkari-naukri`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/education`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/legal`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/check-eligibility`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/fix`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/tools`, changeFrequency: "monthly" as const, priority: 0.7 },
    // Exam category hubs
    { url: `${baseUrl}/exam-categories/banking`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/ssc`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/upsc`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/state-psc`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/railway`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/teaching`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/medical`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/engineering`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/defense`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/other`, changeFrequency: "weekly" as const, priority: 0.85 },
    // Scheme category hubs
    { url: `${baseUrl}/yojana-categories/women`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/farmer`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/health`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/education`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/employment`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/pension`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/housing`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/food-subsidy`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/workers`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/other-central`, changeFrequency: "weekly" as const, priority: 0.85 },
    // State scheme hubs
    { url: `${baseUrl}/yojana-by-state/maharashtra`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/madhya-pradesh`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/uttar-pradesh`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/bihar`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/rajasthan`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/telangana`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/andhra-pradesh`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/karnataka`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/odisha`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/chhattisgarh`, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/about`, lastModified: "2026-05-10", changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/search`, changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  // Content pages from JSON files — use real dates
  const contentDirs = [
    { dir: "schemes", prefix: "yojana" },
    { dir: "exams", prefix: "exam" },
    { dir: "guides", prefix: "guide" },
    { dir: "compare", prefix: "compare" },
    { dir: "paisa", prefix: "paisa" },
    { dir: "sarkari-naukri", prefix: "sarkari-naukri" },
    { dir: "education", prefix: "education" },
    { dir: "legal", prefix: "legal" },
    { dir: "banking-finance", prefix: "banking-finance" },
  ];

  const contentPages: MetadataRoute.Sitemap = [];

  for (const { dir, prefix } of contentDirs) {
    const dirPath = path.join(process.cwd(), "src/content", dir);
    if (!fs.existsSync(dirPath)) continue;
    const files = fs.readdirSync(dirPath).filter((f: string) => f.endsWith(".json"));
    for (const file of files) {
      const slug = file.replace(".json", "");
      const isNews = prefix === "news";
      
      // Emit lastmod ONLY when a real ISO date exists in the file.
      // Display strings like "June 2026" are NOT dates; synthetic values
      // teach Google to ignore our lastmod entirely. Omission is honest.
      let realDate: string | undefined;
      try {
        const data = JSON.parse(fs.readFileSync(path.join(dirPath, file), "utf-8"));
        const candidate = data.last_reviewed || data.date;
        if (typeof candidate === "string") {
          if (/^\d{4}-\d{2}-\d{2}$/.test(candidate)) realDate = candidate;
          else if (/^\d{4}-\d{2}-\d{2}T/.test(candidate)) realDate = candidate.split("T")[0];
        }
      } catch {
        // unreadable file: emit URL without lastmod
      }

      contentPages.push({
        url: `${baseUrl}/${prefix}/${slug}`,
        ...(realDate ? { lastModified: realDate } : {}),
        changeFrequency: isNews ? ("daily" as const) : ("monthly" as const),
        priority: isNews ? 0.8 : 0.6,
      });
    }
  }

  // Calculator pages
  const calcSlugs = [
    "gratuity", "hra", "sip", "emi", "fd", "ppf", "lumpsum", "income-tax",
    "nps", "gst", "epf", "cgpa", "8th-pay-commission"
  ];
  const calcPages = calcSlugs.map((slug) => ({
    url: `${baseUrl}/calculator/${slug}-calculator`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const fixPages: MetadataRoute.Sitemap = FIX_PAGES.map((p) => ({
    url: `${baseUrl}/fix/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    ...fixPages,...staticPages, ...calcPages, ...contentPages];
}
