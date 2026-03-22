import { notFound } from "next/navigation";
import { getPaisaBySlug, getAllPaisaSlugs } from "@/lib/content";
import {
  Breadcrumb, HeroBanner, SectionHeading, Card, InfoRow, StepCard, FAQ, Tag,
} from "@/components/ui";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPaisaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getPaisaBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.meta_description,
  };
}

export default async function PaisaDetailPage({ params }: Props) {
  const { slug } = await params;
  const p = getPaisaBySlug(slug);
  if (!p) notFound();

  return (
    <div className="max-w-[700px] mx-auto px-5 py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Paisa Guide", href: "/paisa" },
          { label: p.title },
        ]}
      />

      <HeroBanner
        title={p.title}
        subtitle={p.hero.one_liner}
        icon={p.hero.icon}
        gradient="linear-gradient(135deg, #D4760A 0%, #A85D08 100%)"
        stats={p.hero.stats}
        updatedDate={p.hero.updated_date}
      />

      {/* Dynamic sections */}
      {p.sections.map((section: any, idx: number) => (
        <div key={idx}>
          <SectionHeading icon={section.icon}>{section.heading}</SectionHeading>

          {section.type === "text" &&
            section.content.map((para: string, i: number) => (
              <p
                key={i}
                className="text-[13px] text-text-secondary leading-[1.8] mb-2"
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}

          {section.type === "steps" && (
            <Card>
              {section.steps.map((step: any) => (
                <StepCard
                  key={step.step}
                  number={step.step}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </Card>
          )}

          {section.type === "info_rows" && (
            <Card>
              {section.rows.map((row: any) => (
                <InfoRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  highlight={row.highlight}
                />
              ))}
            </Card>
          )}

          {section.type === "comparison_table" && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[12px] card overflow-hidden">
                  <thead>
                    <tr className="bg-card-alt">
                      {section.columns.map((col: string) => (
                        <th
                          key={col}
                          className="px-3 py-2.5 text-left font-semibold text-text text-[11px] border-b border-border"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row: string[]) => (
                      <tr key={row[0]}>
                        {row.map((cell: string, i: number) => (
                          <td
                            key={i}
                            className={`px-3 py-2 border-b border-border ${
                              i === 0
                                ? "text-text-secondary"
                                : "text-text font-medium"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {section.footnote && (
                <p className="text-[11px] text-text-muted mt-1.5">
                  {section.footnote}
                </p>
              )}
            </>
          )}
        </div>
      ))}

      {/* FAQs */}
      <SectionHeading icon="❓">Common Questions</SectionHeading>
      <Card>
        {p.faqs.map((f: any) => (
          <FAQ key={f.question} question={f.question} answer={f.answer} />
        ))}
      </Card>

      {/* Related */}
      <SectionHeading icon="🔗">Related Topics</SectionHeading>
      <div className="flex gap-2.5 overflow-x-auto pb-2">
        {p.related_pages.map((r: any) => (
          <a
            key={r.slug}
            href={`/paisa/${r.slug}`}
            className="card px-4 py-3.5 min-w-[180px] shrink-0"
          >
            <Tag className="bg-orange-light">{r.tag}</Tag>
            <div className="text-[13px] font-medium text-text mt-2">
              {r.title}
            </div>
          </a>
        ))}
      </div>

      {/* Disclaimer */}
      {p.disclaimer && (
        <div className="mt-6 p-4 bg-card-alt rounded-xl text-[11px] text-text-muted leading-relaxed">
          <strong>Disclaimer:</strong> {p.disclaimer}
        </div>
      )}
    </div>
  );
}
