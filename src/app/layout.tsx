import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "JaankariHub — Government Schemes, Exams & Financial Literacy",
    template: "%s | JaankariHub",
  },
  description:
    "Find government schemes you're eligible for, prepare for exams, and learn personal finance. Simple, accurate, no spam.",
  metadataBase: new URL("https://jaankarihub.in"),
  openGraph: {
    siteName: "JaankariHub",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=JetBrains+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
