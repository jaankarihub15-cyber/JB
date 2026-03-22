import { notFound } from "next/navigation";
import { getSchemeBySlug, getAllSchemeSlugs } from "@/lib/content";
import {
  Breadcrumb,
  HeroBanner,
  SectionHeading,
  Card,
  InfoRow,
  StepCard,
  FAQ,
  AlertBox,
  Tag,
} from "@/components/ui";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSchemeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const scheme = getSchemeBySlug(slug);
  if (!scheme) return {};
  return {
    title: `${scheme.title} — Eligibility, Benefits & How to Apply`,
    description: scheme.meta_description,
  };
}

export default async function SchemeDetailPage({ params }: Props) {
  const { slug } = await params;
  const s = getSchemeBySlug(slug);
  if (!s) notFound();

  return (
    <div className="max-w-[700px] mx-auto px-5 py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Yojana", href: "/yojana" },
          { label: s.title },
        ]}
      />

      <HeroBanner
        title={s.title}
        subtitle={s.hero.one_liner}
        icon={s.hero.icon}
        gradient="linear-gradient(135deg, #1B6B4A 0%, #145236 100%)"
        badge="Active Scheme"
        badgeStatus={s.hero.status as any}
        stats={s.hero.stats}
        updatedDate={s.hero.updated_date}
      />

      {/* Quick Actions */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {s.quick_actions.map((a) => (
          <a
            key={a.label}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-[11px] font-medium text-text hover:border-accent/40 transition-colors"
          >
            <span>{a.icon}</span>
            {a.label}
          </a>
        ))}
      </div>

      {/* What is it */}
      <SectionHeading icon="📖">What is {s.title}?</SectionHeading>
      {s.what_is_it.map((p, i) => (
        <p
          key={i}
          className="text-[13px] text-text-secondary leading-[1.8] mb-2"
        >
          {p}
        </p>
      ))}

      {/* Eligibility */}
      <SectionHeading icon="✅">Eligibility</SectionHeading>
      <Card>
        {s.eligibility.map((e) => (
          <InfoRow
            key={e.label}
            label={e.label}
            value={e.value}
            highlight={e.highlight}
          />
        ))}
      </Card>

      {/* How to Apply */}
      <SectionHeading icon="📝">How to Apply</SectionHeading>
      <Card>
        {s.how_to_apply.map((step) => (
          <StepCard
            key={step.step}
            number={step.step}
            title={step.title}
            description={step.description}
          />
        ))}
      </Card>

      {/* Alert */}
      {s.important_alert && (
        <AlertBox
          text={`<strong>Important:</strong> ${s.important_alert.text}`}
          type={s.important_alert.type as any}
        />
      )}

      {/* Important Dates */}
      <SectionHeading icon="📅">Important Dates</SectionHeading>
      <Card>
        {s.important_dates.map((d) => (
          <InfoRow
            key={d.label}
            label={d.label}
            value={d.value}
            highlight={d.highlight}
          />
        ))}
      </Card>

      {/* FAQs */}
      <SectionHeading icon="❓">Common Questions</SectionHeading>
      <Card>
        {s.faqs.map((f) => (
          <FAQ key={f.question} question={f.question} answer={f.answer} />
        ))}
      </Card>

      {/* Related */}
      <SectionHeading icon="🔗">Related Schemes</SectionHeading>
      <div className="flex gap-2.5 overflow-x-auto pb-2">
        {s.related_pages.map((r) => (
          <a
            key={r.slug}
            href={`/yojana/${r.slug}`}
            className="card px-4 py-3.5 min-w-[180px] shrink-0 hover:border-accent/30 transition-colors"
          >
            <Tag>{r.tag}</Tag>
            <div className="text-[13px] font-medium text-text mt-2">
              {r.title}
            </div>
          </a>
        ))}
      </div>

      {/* Official Portal */}
      <div className="mt-6 p-4 bg-blue-light rounded-xl flex justify-between items-center">
        <div>
          <div className="text-[12px] font-semibold text-blue">
            {s.official_portal.name}
          </div>
          <div className="font-mono text-[11px] text-blue/70">
            {s.official_portal.url.replace("https://", "")}
          </div>
        </div>
        <a
          href={s.official_portal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-blue font-medium"
        >
          Visit →
        </a>
      </div>
    </div>
  );
}
