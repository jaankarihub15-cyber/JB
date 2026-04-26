import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://knowledgekendra.com";
  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/calculator`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/check-eligibility`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  // Content pages from JSON files
  const contentDirs = [
    { dir: "schemes", prefix: "yojana" },
    { dir: "exams", prefix: "exam" },
    { dir: "guides", prefix: "guide" },
    { dir: "compare", prefix: "compare" },
    { dir: "paisa", prefix: "paisa" },
    { dir: "news", prefix: "news" },
  ];

  const contentPages: MetadataRoute.Sitemap = [];

  for (const { dir, prefix } of contentDirs) {
    const dirPath = path.join(process.cwd(), "src/content", dir);
    if (!fs.existsSync(dirPath)) continue;
    const files = fs.readdirSync(dirPath).filter((f: string) => f.endsWith(".json"));
    for (const file of files) {
      const slug = file.replace(".json", "");
      const isNews = prefix === "news";
      contentPages.push({
        url: `${baseUrl}/${prefix}/${slug}`,
        lastModified: now,
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
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...calcPages, ...contentPages];
}
