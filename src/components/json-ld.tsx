export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function articleSchema({
  title,
  description,
  url,
  dateModified,
  breadcrumbs,
}: {
  title: string;
  description: string;
  url: string;
  dateModified: string;
  breadcrumbs: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    dateModified,
    datePublished: "2026-03-15",
    author: {
      "@type": "Person",
      name: "Ashutosh Khulbe",
      url: "https://knowledgekendra.com/about#author",
    },
    publisher: {
      "@type": "Organization",
      name: "KnowledgeKendra",
      url: "https://knowledgekendra.com",
      logo: {
        "@type": "ImageObject",
        url: "https://knowledgekendra.com/icon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function governmentServiceSchema({
  name,
  description,
  url,
  provider,
  serviceType,
}: {
  name: string;
  description: string;
  url: string;
  provider: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name,
    description,
    url,
    provider: {
      "@type": "GovernmentOrganization",
      name: provider,
    },
    serviceType,
  };
}
