import type { Metadata } from "next";
import Script from "next/script";
// FONT DISABLED
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const jakarta = { variable: "" };

export const metadata: Metadata = {
  title: {
    default: "KnowledgeKendra — Government Schemes, Exams & Financial Literacy",
    template: "%s | KnowledgeKendra",
  },
  description:
    "Find government schemes you're eligible for, prepare for exams, and learn personal finance. Simple, accurate, no spam.",
  metadataBase: new URL("https://knowledgekendra.com"),
  openGraph: {
    siteName: "KnowledgeKendra",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://knowledgekendra.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "KnowledgeKendra — Government Schemes, Exams, Financial Calculators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://knowledgekendra.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <link rel="alternate" type="application/rss+xml" title="KnowledgeKendra RSS" href="https://knowledgekendra.com/feed.xml" />
      </head>
      <body className="min-h-screen bg-bg">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "KnowledgeKendra",
              url: "https://knowledgekendra.com",
              logo: "https://knowledgekendra.com/icon.svg",
              description: "Free information platform for government schemes, competitive exams, and personal finance in India.",
              founder: {
                "@type": "Person",
                name: "Ashutosh Khulbe",
              },
              sameAs: [
                "https://instagram.com/knowledgekendra"
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "KnowledgeKendra",
              url: "https://knowledgekendra.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://knowledgekendra.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C2HEZF6TV1"
          strategy="lazyOnload"
        />
        <Script id="ga4-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-C2HEZF6TV1');
          `}
        </Script>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
