import { getAllSchemeSlugs, getAllExamSlugs, getAllPaisaSlugs, getAllGuideSlugs, getAllCompareSlugs } from "@/lib/content";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://knowledgekendra.com";
const NOW = new Date().toISOString();

export default function sitemap(): MetadataRoute.Sitemap {
  const schemeSlugs = getAllSchemeSlugs();
  const examSlugs = getAllExamSlugs();
  const paisaSlugs = getAllPaisaSlugs();
  const guideSlugs = getAllGuideSlugs();
  const compareSlugs = getAllCompareSlugs();

  const staticPages = [
    { url: BASE_URL, lastModified: NOW, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/check-eligibility`, lastModified: NOW, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/yojana`, lastModified: NOW, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/exam`, lastModified: NOW, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/paisa`, lastModified: NOW, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/guide`, lastModified: NOW, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/calculator`, lastModified: NOW, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: NOW, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: NOW, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: NOW, changeFrequency: "monthly" as const, priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: NOW, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${BASE_URL}/disclaimer`, lastModified: NOW, changeFrequency: "yearly" as const, priority: 0.2 },
  ];

  const schemePages = schemeSlugs.map((slug) => ({
    url: `${BASE_URL}/yojana/${slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const examPages = examSlugs.map((slug) => ({
    url: `${BASE_URL}/exam/${slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const paisaPages = paisaSlugs.map((slug) => ({
    url: `${BASE_URL}/paisa/${slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const guidePages = guideSlugs.map((slug) => ({
    url: `${BASE_URL}/guide/${slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const comparePages = compareSlugs.map((slug) => ({
    url: `${BASE_URL}/compare/${slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const calcPages = ["sip-calculator","emi-calculator","fd-calculator","ppf-calculator","income-tax-calculator","gratuity-calculator","hra-calculator","lumpsum-calculator"].map((slug) => ({
    url: `${BASE_URL}/calculator/${slug}`,
    lastModified: NOW,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...calcPages, ...schemePages, ...examPages, ...paisaPages, ...guidePages, ...comparePages];
}
