import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const INDEXNOW_KEY = "c34c5c8349941fdc6787f9edb5bd7c67";
const HOST = "knowledgekendra.com";

function getAllUrls(): string[] {
  const contentDir = path.join(process.cwd(), "src/content");
  const urls: string[] = [`https://${HOST}`];

  const dirMap: Record<string, string> = {
    schemes: "yojana",
    exams: "exam",
    paisa: "paisa",
    guides: "guide",
    compare: "compare",
    news: "news",
    "sarkari-naukri": "sarkari-naukri",
    education: "education",
    legal: "legal",
  };

  for (const [dir, prefix] of Object.entries(dirMap)) {
    const dirPath = path.join(contentDir, dir);
    if (!fs.existsSync(dirPath)) continue;
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json") && !f.startsWith("index"));
    for (const file of files) {
      const slug = file.replace(".json", "");
      urls.push(`https://${HOST}/${prefix}/${slug}`);
    }
  }

  // Add static pages
  const staticPages = [
    "/yojana", "/exam", "/paisa", "/guide", "/compare",
    "/calculator", "/news", "/check-eligibility", "/search",
    "/sarkari-naukri", "/education", "/legal",
    "/about", "/contact", "/privacy", "/disclaimer",
    // Calculator individual pages
    "/calculator/sip-calculator",
    "/calculator/emi-calculator",
    "/calculator/fd-calculator",
    "/calculator/ppf-calculator",
    "/calculator/income-tax-calculator",
    "/calculator/gratuity-calculator",
    "/calculator/hra-calculator",
    "/calculator/nps-calculator",
    "/calculator/gst-calculator",
    "/calculator/epf-calculator",
    "/calculator/lumpsum-calculator",
    "/calculator/cgpa-calculator",
    "/calculator/8th-pay-commission-calculator",
  ];
  for (const p of staticPages) {
    urls.push(`https://${HOST}${p}`);
  }

  return urls;
}

export async function POST() {
  try {
    const urls = getAllUrls();
    
    // IndexNow accepts max 10,000 URLs per request
    const batches = [];
    for (let i = 0; i < urls.length; i += 10000) {
      batches.push(urls.slice(i, i + 10000));
    }

    const results = [];
    for (const batch of batches) {
      const res = await fetch("https://www.bing.com/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: HOST,
          key: INDEXNOW_KEY,
          keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
          urlList: batch,
        }),
      });
      results.push({ status: res.status, count: batch.length });
    }

    return NextResponse.json({ success: true, results, totalUrls: urls.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const urls = getAllUrls();
  return NextResponse.json({ totalUrls: urls.length, urls: urls.slice(0, 20) });
}
