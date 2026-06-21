import Link from "next/link";

type CtaCopy = { query: string; title: string; blurb: string };

const COPY: Record<string, CtaCopy> = {
  "ssc-cgl": {
    query: "",
    title: "Filing the SSC CGL form? Get ready first",
    blurb:
      "Save your details, tick off the SSC CGL document checklist, and get your photo and signature the right size. Everything stays on your device.",
  },
  appsc: {
    query: "?exam=appsc",
    title: "Filing the APPSC form? Get ready first",
    blurb:
      "Save your details, tick off the APPSC checklist (OTPR, photo with name and date), and get your photo and signature the right size. Stays on your device.",
  },
};

export function FormKitCTA({ slug }: { slug: string }) {
  const c = COPY[slug];
  const href = c ? `/tools/form-kit${c.query}` : "/tools/form-kit?exam=general";
  const title = c ? c.title : "Filling this form? Get your documents ready";
  const blurb = c
    ? c.blurb
    : "Save your details once, see the documents this kind of form needs, and copy them in one tap. Stays on your device, never uploaded.";
  return (
    <div className="my-8 rounded-2xl border-2 border-accent/20 bg-accent-light p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-2xl shrink-0">🗂️</div>
      <div className="flex-1">
        <h3 className="text-base font-bold text-text mb-1">{title}</h3>
        <p className="text-sm text-text-secondary leading-relaxed">{blurb}</p>
      </div>
      <Link
        href={href}
        className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent/90 transition-colors whitespace-nowrap shrink-0"
      >
        Open Form Kit →
      </Link>
    </div>
  );
}
