import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Your Eligibility — Find Government Schemes You Qualify For",
  description:
    "Answer 5 simple questions to instantly find which Indian government schemes you're eligible for. Free tool covering PM Kisan, Ayushman Bharat, PMAY, and more.",
  alternates: {
    canonical: "https://knowledgekendra.com/check-eligibility",
  },
  openGraph: {
    title: "Check Your Eligibility — Find Government Schemes You Qualify For",
    description:
      "Answer 5 simple questions to instantly find which Indian government schemes you're eligible for. Covers 12+ central government schemes.",
    url: "https://knowledgekendra.com/check-eligibility",
    type: "website",
    images: [
      {
        url: "/api/og?title=Check%20Your%20Eligibility&icon=🔍&cat=yojana",
        width: 1200,
        height: 630,
        alt: "KnowledgeKendra Eligibility Checker Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Check Your Eligibility for Government Schemes",
    description:
      "5 questions → instant results. Find which schemes you qualify for.",
  },
};

export default function CheckEligibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
