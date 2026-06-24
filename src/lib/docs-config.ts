/* ============================================================================
 * Documentation registry: the single source of truth for the catalogue, the
 * contextual nav, and each documentation's overview page (DocOverview).
 * Add a documentation by adding one DOCS entry plus an overview route.
 * Icon names resolve through the doc-kit <Icon> set. Replace the sample below.
 * ========================================================================== */

export type DocPage = {
  to: string;
  label: string;
  desc: string;
  icon: string;
  /* Optional grouping label. Pages sharing a section render together in the
     overview and the nav. Docs with no sections render flat. */
  section?: string;
};
export type DocTone = "sage" | "coral" | "slate" | "gold";
export type Doc = {
  id: string;
  label: string;
  short: string;
  icon: string;
  overview: string;
  tone: DocTone;
  ring: string;
  blurb: string;
  pages: DocPage[];
};

/* Top N pages shown as direct links in the nav before the rest fold into "More". */
export const MAX_DIRECT = 3;

export const DOCS: Doc[] = [
  {
    id: "guide",
    label: "Documentation Guide",
    short: "Guide",
    icon: "book",
    overview: "/section",
    tone: "sage",
    ring: "#1F8A5B",
    blurb:
      "A sample documentation. Replace this entry in src/lib/docs-config.ts with your own pages; the nav, catalogue, and overview all read from here.",
    pages: [
      {
        to: "/getting-started",
        label: "Getting Started",
        desc: "How to set up and run the project.",
        icon: "bolt",
        section: "Basics",
      },
      {
        to: "/components",
        label: "Component Gallery",
        desc: "Every shared component and the colour scheme.",
        icon: "grid",
        section: "Basics",
      },
      {
        to: "/section",
        label: "Example Section",
        desc: "A placeholder content page to copy from.",
        icon: "doc",
        section: "Reference",
      },
    ],
  },
];

/* Resolve the active documentation from a pathname (overview or any of its pages). */
export function docForPath(pathname: string): Doc | null {
  return (
    DOCS.find((d) => d.overview === pathname || d.pages.some((p) => p.to === pathname)) ?? null
  );
}

export function docById(id: string): Doc | null {
  return DOCS.find((d) => d.id === id) ?? null;
}

/* Group a doc's pages by `section`, preserving first-seen order. A doc with no
   sections returns a single unlabelled group, so callers treat both the same.
   `sectioned` is true only when more than one distinct section exists. */
export type DocSection = { label: string | null; pages: DocPage[] };
export function pageSections(doc: Doc): { sectioned: boolean; groups: DocSection[] } {
  const order: string[] = [];
  const map = new Map<string, DocPage[]>();
  for (const p of doc.pages) {
    const key = p.section ?? "";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(p);
  }
  const groups = order.map((key) => ({ label: key === "" ? null : key, pages: map.get(key)! }));
  const sectioned = groups.filter((g) => g.label !== null).length > 1;
  return { sectioned, groups };
}
