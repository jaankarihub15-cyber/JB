import { getAllSchemeSlugs, getAllExamSlugs, getAllPaisaSlugs } from "@/lib/content";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://jaankarihub.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const schemeSlugs = getAllSchemeSlugs();
  const examSlugs = getAllExamSlugs();
  const paisaSlugs = getAllPaisaSlugs();

  const staticPages = [
    { url: BASE_URL, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/check-eligibility`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/yojana`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/exam`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/paisa`, changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  const schemePages = schemeSlugs.map((slug) => ({
    url: `${BASE_URL}/yojana/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const examPages = examSlugs.map((slug) => ({
    url: `${BASE_URL}/exam/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const paisaPages = paisaSlugs.map((slug) => ({
    url: `${BASE_URL}/paisa/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...schemePages, ...examPages, ...paisaPages];
}
