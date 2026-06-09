import { getAllSchemes } from "@/lib/content";
import CheckerClient, { type CheckerScheme } from "./checker-client";

// Server component: read scheme eligibility filters at build time.
// Any scheme JSON with a populated eligibility_filters block auto-appears here.
export default function CheckEligibilityPage() {
  const schemes: CheckerScheme[] = getAllSchemes()
    .filter((s) => {
      const f = s.eligibility_filters;
      return (
        f &&
        Array.isArray(f.gender) &&
        f.gender.length > 0 &&
        Array.isArray(f.states) &&
        f.states.length > 0 &&
        typeof f.age_max === "number"
      );
    })
    .map((s) => ({
      slug: s.slug,
      title: (s.title || s.slug).split(" - ")[0].split(":")[0].trim(),
      desc: s.meta_description || s.hero?.one_liner || "",
      amount: s.hero?.stats?.[0]?.value || "",
      icon: s.hero?.icon || "\u{1F4CB}",
      tag: s.tags?.[0] || "Scheme",
      filters: {
        gender: s.eligibility_filters.gender,
        ageMin: s.eligibility_filters.age_min,
        ageMax: s.eligibility_filters.age_max,
        occupation:
          s.eligibility_filters.occupation && s.eligibility_filters.occupation.length > 0
            ? s.eligibility_filters.occupation
            : ["any"],
        incomeMax: s.eligibility_filters.income_max || 9999999,
        category:
          s.eligibility_filters.category && s.eligibility_filters.category.length > 0
            ? s.eligibility_filters.category
            : ["all"],
        states: s.eligibility_filters.states,
      },
    }));

  return <CheckerClient schemes={schemes} />;
}
