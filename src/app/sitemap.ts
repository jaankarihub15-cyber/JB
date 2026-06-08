import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://knowledgekendra.com";
  const now = new Date().toISOString();

  // Static + hub pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/yojana`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/exam`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/guide`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/paisa`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/calculator`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/sarkari-naukri`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/education`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/legal`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/check-eligibility`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    // Exam category hubs
    { url: `${baseUrl}/exam-categories/banking`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/ssc`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/upsc`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/state-psc`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/railway`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/teaching`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/medical`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/engineering`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/defense`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/exam-categories/other`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    // Scheme category hubs
    { url: `${baseUrl}/yojana-categories/women`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/farmer`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/health`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/education`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/employment`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/pension`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/housing`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/food-subsidy`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/workers`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-categories/other-central`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    // State scheme hubs
    { url: `${baseUrl}/yojana-by-state/maharashtra`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/madhya-pradesh`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/uttar-pradesh`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/bihar`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/rajasthan`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/telangana`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/andhra-pradesh`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/karnataka`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/odisha`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/yojana-by-state/chhattisgarh`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/about`, lastModified: "2026-05-10", changeFrequency: "monthly" as const, priority: 0.4 },
    { url: `${baseUrl}/books`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  // Content pages from JSON files — use real dates
  const contentDirs = [
    { dir: "schemes", prefix: "yojana" },
    { dir: "exams", prefix: "exam" },
    { dir: "guides", prefix: "guide" },
    { dir: "compare", prefix: "compare" },
    { dir: "paisa", prefix: "paisa" },
    { dir: "news", prefix: "news" },
    { dir: "sarkari-naukri", prefix: "sarkari-naukri" },
    { dir: "education", prefix: "education" },
    { dir: "legal", prefix: "legal" },
    { dir: "books", prefix: "books" },
  ];

  const contentPages: MetadataRoute.Sitemap = [];

  for (const { dir, prefix } of contentDirs) {
    const dirPath = path.join(process.cwd(), "src/content", dir);
    if (!fs.existsSync(dirPath)) continue;
    const files = fs.readdirSync(dirPath).filter((f: string) => f.endsWith(".json"));
    for (const file of files) {
      const slug = file.replace(".json", "");
      const isNews = prefix === "news";
      
      // Read actual date from JSON
      try {
        const data = JSON.parse(fs.readFileSync(path.join(dirPath, file), "utf-8"));
        const lastMod = data.date || data.last_reviewed || data.hero?.updated_date || "2026-04-01";
        // Normalize date format
        const dateStr = lastMod.includes("T") ? lastMod : 
                       /^\d{4}-\d{2}-\d{2}$/.test(lastMod) ? lastMod :
                       /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(lastMod) ? 
                         new Date(lastMod + " 2026").toISOString().split("T")[0] : "2026-04-01";
        
        contentPages.push({
          url: `${baseUrl}/${prefix}/${slug}`,
          lastModified: dateStr,
          changeFrequency: isNews ? ("daily" as const) : ("monthly" as const),
          priority: isNews ? 0.8 : 0.6,
        });
      } catch {
        contentPages.push({
          url: `${baseUrl}/${prefix}/${slug}`,
          lastModified: "2026-04-01",
          changeFrequency: "monthly" as const,
          priority: 0.6,
        });
      }
    }
  }

  // Calculator pages
  const calcSlugs = [
    "gratuity", "hra", "sip", "emi", "fd", "ppf", "lumpsum", "income-tax",
    "nps", "gst", "epf", "cgpa", "8th-pay-commission"
  ];
  const calcPages = calcSlugs.map((slug) => ({
    url: `${baseUrl}/calculator/${slug}-calculator`,
    lastModified: "2026-04-01",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...calcPages, ...contentPages];
}
