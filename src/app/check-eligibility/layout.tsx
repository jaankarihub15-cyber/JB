import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eligibility Checker - Find Government Schemes You Qualify For",
  description:
    "Answer 6 simple questions to instantly find central and state government schemes you are eligible for. Free tool covering 50+ schemes across India.",
  alternates: {
    canonical: "https://knowledgekendra.com/check-eligibility",
  },
  openGraph: {
    title: "Eligibility Checker - Find Government Schemes You Qualify For",
    description:
      "Answer 6 simple questions to find central and state government schemes you qualify for. Covers 50+ schemes across 11 states plus national schemes.",
    url: "https://knowledgekendra.com/check-eligibility",
    type: "website",
    images: [
      {
        url: "/api/og?title=Check%20Your%20Eligibility&icon=\u{1F50D}&cat=yojana",
        width: 1200,
        height: 630,
        alt: "KnowledgeKendra Eligibility Checker Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Check Your Eligibility for Government Schemes",
    description: "6 questions, instant results. Find central and state schemes you qualify for.",
  },
};

export default function CheckEligibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
