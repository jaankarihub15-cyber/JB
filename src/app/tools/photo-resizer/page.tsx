import type { Metadata } from "next";
import { PhotoResizer } from "@/components/tools/photo-resizer";
import { JsonLd, faqSchema, breadcrumbSchema } from "@/components/json-ld";
import { Breadcrumb, SectionHeading, FAQ, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Photo & Signature Resizer - Resize to 50KB, 20KB Online Free",
  description:
    "Free photo and signature resizer for exam and job forms. Resize images to 50KB, 20KB or any size and dimensions. Works in your browser. Your photo never leaves your device.",
  alternates: { canonical: "https://knowledgekendra.com/tools/photo-resizer" },
};

const faqs = [
  { question: "How do I resize a photo to 50KB?", answer: "Open this tool, choose your photo, and pick the 'Standard photo (50KB)' preset or enter 50 in the max size box. The tool resizes your image to the right dimensions and compresses it until it is at or below 50KB. Then tap Download. Everything happens inside your browser, so the photo is never uploaded anywhere." },
  { question: "What size should a signature be for an online form?", answer: "Most Indian exam and job application forms ask for a signature between 10KB and 20KB, often around 140x60 pixels. The exact requirement is printed in the application instructions for that form. Use the Signature mode in this tool and the 20KB preset, which fits the most common requirement. Always confirm the size limit on the official notification." },
  { question: "Is it safe to resize my photo here?", answer: "Yes. This tool does all the work inside your own browser using your device. Your photo and signature are never sent to any server or stored anywhere. This is different from many resize websites that upload your image to their servers. You can even turn off your internet after the page loads and it will still work." },
  { question: "Why can't I get my photo below the target size?", answer: "File size depends on both dimensions and image detail. A large or very detailed photo at big dimensions may not compress below a tight limit without becoming blurry. If you cannot hit the target, reduce the width and height first. Smaller dimensions almost always produce a smaller file. The tool will show you the smallest version it could make." },
  { question: "What is the difference between JPG and PNG for forms?", answer: "JPG compresses photos into small files and is the right choice for passport-style photos, since most forms ask for JPG or JPEG. PNG keeps sharp edges and is better for signatures on a white background, but the files are larger. If a form specifies a format, follow it. If it does not, use JPG for photos and either format for signatures." },
  { question: "Does this work on a mobile phone?", answer: "Yes. The tool is built mobile first. You can choose an existing photo from your gallery or take a new one with your camera, set the size, and download the resized image directly to your phone. No app install is needed and it works in any modern mobile browser." },
  { question: "Will resizing reduce my photo quality?", answer: "Some quality loss is normal when you shrink a file to meet a strict size limit, because compression removes fine detail. The tool keeps quality as high as possible while staying under your target size. For best results, start with a clear, well-lit photo and avoid setting an unnecessarily tiny size limit." },
  { question: "Do I need to pay or sign up to use this?", answer: "No. The photo and signature resizer is completely free with no login, no sign up, and no watermark. You can use it as many times as you need. KnowledgeKendra provides it as a free tool for students and applicants filling government and exam forms." },
];

export default function PhotoResizerPage() {
  return (
    <div className="max-w-[680px] mx-auto px-4 pt-6 pb-12">
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://knowledgekendra.com" },
          { name: "Tools", url: "https://knowledgekendra.com/tools" },
          { name: "Photo & Signature Resizer", url: "https://knowledgekendra.com/tools/photo-resizer" },
        ])}
      />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Photo Resizer" }]} />

      <div className="mt-4 mb-6 bg-accent-light border border-accent/20 rounded-3xl p-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shrink-0 border border-accent/10">
            🖼️
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-text">Photo &amp; Signature Resizer</h1>
            <p className="text-xs text-text-muted mt-1">Updated: June 2026 · By Ash K.</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary mb-4 leading-relaxed">
          Resize any photo or signature to 50KB, 20KB, or any size you need for exam and job forms.
          Free, instant, and private.
        </p>
        <div className="flex flex-wrap gap-2">
          {["50KB photo", "20KB signature", "Works on mobile", "Never uploaded"].map((c) => (
            <span key={c} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-accent-dark border border-accent/10">
              {c}
            </span>
          ))}
        </div>
      </div>

      <PhotoResizer />

      <div className="mt-8">
        <SectionHeading icon="📌">Why applicants struggle with photo size</SectionHeading>
        <div className="card p-5 text-text-secondary text-sm leading-relaxed space-y-3">
          <p>
            Almost every government exam and job form sets a strict photo and signature size. A photo
            must often be under 50KB and a signature under 20KB, with fixed pixel dimensions.
          </p>
          <p>
            A normal phone photo is 2MB to 5MB, which is far too large to upload. Forms reject it
            instantly, and applicants lose time hunting for a way to shrink it.
          </p>
          <p>
            This tool fixes that in seconds. Pick your image, choose a preset or enter the exact size
            limit, and download a version that fits. It runs fully in your browser, so your photo
            stays on your device and is never uploaded.
          </p>
        </div>
      </div>

      <div className="mt-8" id="faqs">
        <SectionHeading icon="❓">Frequently Asked Questions</SectionHeading>
        <Card>
          {faqs.map((f) => (
            <FAQ key={f.question} question={f.question} answer={f.answer} />
          ))}
        </Card>
      </div>

      <p className="mt-6 text-xs text-text-muted leading-relaxed text-center">
        Always check the exact photo and signature requirements printed in your official form
        notification. Size and dimension rules vary between exams and departments.
      </p>
    </div>
  );
}
