"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/check-eligibility", label: "🔍 Check" },
  { href: "/yojana", label: "Yojana" },
  { href: "/exam", label: "Exam" },
  { href: "/paisa", label: "Paisa" },
];

export function Header() {
  const pathname = usePathname();

  const getActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-bg/92 backdrop-blur-md border-b border-border">
      <div className="max-w-[720px] mx-auto px-5 py-3 flex items-center justify-between">
        <Link href="/" className="heading text-lg">
          <span className="text-text">Jaankari</span>
          <span className="text-accent">Hub</span>
        </Link>
        <nav className="flex gap-0.5 bg-card-alt rounded-full p-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors ${
                getActive(item.href)
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:text-text"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
