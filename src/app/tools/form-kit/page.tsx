import type { Metadata } from "next";
import { FormKit } from "@/components/tools/form-kit";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";
import { Breadcrumb } from "@/components/ui";

export const metadata: Metadata = {
  title: "SSC CGL Form 2026 - Documents, Photo Size & Checklist",
  description:
    "Free form kit for SSC CGL. Save your details once, see what the form needs (documents, photo and signature size), and fill it calmly. Stays on your device.",
  alternates: { canonical: "https://knowledgekendra.com/tools/form-kit" },
};

export default function FormKitPage() {
  return (
    <div className="theme-v2 py-0">
      <div className="max-w-[900px] mx-auto px-4 pt-6 pb-12">
        <JsonLd
          data={breadcrumbSchema([
            { name: "Home", url: "https://knowledgekendra.com" },
            { name: "Tools", url: "https://knowledgekendra.com/tools" },
            { name: "Sarkari Form Kit", url: "https://knowledgekendra.com/tools/form-kit" },
          ])}
        />
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Form Kit" }]} />

        <div className="mt-4 mb-6 bg-accent-light border border-accent/20 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shrink-0 border border-accent/10">🗂️</div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-text">Sarkari Form Kit</h1>
              <p className="text-xs text-text-muted mt-1">Updated: June 2026 · By Ash K.</p>
            </div>
          </div>
          <p className="text-sm text-text-secondary mb-4 leading-relaxed">
            Save your exam details once, see exactly what the form needs, and fill it without the last-minute panic. Your details stay on your device and are never uploaded.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Saved on your device", "SSC CGL ready", "Copy in one tap", "No Aadhaar or bank"].map((c) => (
              <span key={c} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-accent-dark border border-accent/10">{c}</span>
            ))}
          </div>
        </div>

        <FormKit />
      </div>
    </div>
  );
}
