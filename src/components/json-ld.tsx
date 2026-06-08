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
  datePublished,
  image,
  breadcrumbs,
}: {
  title: string;
  description: string;
  url: string;
  dateModified: string;
  datePublished?: string;
  image?: string;
  breadcrumbs: { name: string; url: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    dateModified,
    datePublished: datePublished || dateModified || "2026-03-15",
    ...(image && { image: { "@type": "ImageObject", url: image } }),
    author: {
      "@type": "Person",
      name: "Ash K.",
      url: "https://knowledgekendra.com/about",
      sameAs: [
        "https://medium.com/@jaankarihub15",
        "https://www.linkedin.com/in/knowledgekendra",
      ],
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

export function howToSchema({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  totalTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function specialAnnouncementSchema({
  name,
  text,
  datePosted,
  url,
  category,
}: {
  name: string;
  text: string;
  datePosted: string;
  url: string;
  category?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SpecialAnnouncement",
    name,
    text,
    datePosted,
    url,
    category: category === "RESULT" ? "https://schema.org/EducationalOccupationalActivity" :
              category === "RECRUITMENT" ? "https://schema.org/EmploymentRelatedAnnouncement" :
              "https://schema.org/GovernmentService",
    announcementLocation: {
      "@type": "Country",
      name: "India",
    },
  };
}
