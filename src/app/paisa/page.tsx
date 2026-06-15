import { getAllPaisaArticles } from "@/lib/content";
import { PaisaHubClient } from "@/components/paisa-hub-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paisa Guide — Personal Finance, Tax, Insurance & Investments",
  description: "Simple guides on SIP, mutual funds, tax saving, insurance, FD, PPF, and more. Personal finance explained for beginners.",
  alternates: { canonical: "https://knowledgekendra.com/paisa" },
};

const TAG_TO_CATEGORY: Record<string, string> = {
  "SIP": "investing", "Mutual Funds": "investing", "Demat Account": "investing",
  "Stock Investing": "investing", "Gold Investment": "investing", "Gold ETF": "investing",
  "ELSS": "investing", "FD": "investing", "Fixed Deposit": "investing",
  "Investing Basics": "investing",
  "Tax Saving": "tax", "80C": "tax", "Income Tax": "tax", "ITR": "tax",
  "Section 80D": "tax", "HRA Exemption": "tax", "House Rent Allowance": "tax",
  "advance tax calculator 2026": "tax", "advance tax due dates india": "tax",
  "Health Insurance": "insurance", "Mediclaim": "insurance",
  "Term Insurance": "insurance", "Life Insurance": "insurance",
  "PPF": "savings", "NPS": "savings", "EPF": "savings",
  "Provident Fund": "savings", "Savings": "savings",
  "Gratuity": "savings", "Payment of Gratuity Act": "savings",
  "Home Loan": "loans", "Mortgage": "loans", "Education Loan": "loans",
  "Student Loan": "loans", "Personal Loan": "loans", "Unsecured Debt": "loans",
  "PMAY CLSS subsidy scheme": "loans", "affordable housing guide India 2026": "loans",
  "CIBIL": "banking", "Credit Score": "banking",
  "UPI": "banking", "Digital Payment": "banking",
};

function getCategory(tags: string[]): string {
  for (const t of tags) {
    if (TAG_TO_CATEGORY[t]) return TAG_TO_CATEGORY[t];
  }
  return "investing";
}

export default function PaisaHubPage() {
  const raw = getAllPaisaArticles();

  const articles = raw.map((a: any) => ({
    slug: a.slug,
    title: a.title,
    one_liner: a.hero?.one_liner || "",
    tags: a.hero?.tags?.slice(0, 2) || [],
    read_time: a.hero?.read_time || "5 min",
    category: getCategory(a.hero?.tags || []),
  }));

  return <PaisaHubClient articles={articles} />;
}
