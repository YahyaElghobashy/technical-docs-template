/* ============================================================================
 * Page freshness registry: the single audit surface for the "Updated / Created"
 * stamp shown on documentation pages (rendered by the <PageMeta /> component in
 * doc-kit). Dates are ISO (YYYY-MM-DD). When you change a page's content, bump
 * its `updated` here; scripts/check-doc-freshness.mjs flags any page whose route
 * file changed more recently than its stamp.
 *
 * Add one entry per route. Replace these placeholders with your real pages.
 * ========================================================================== */

export type PageMetaEntry = { created: string; updated: string };

export const PAGE_META: Record<string, PageMetaEntry> = {
  "/": { created: "2026-06-17", updated: "2026-06-22" },
  "/getting-started": { created: "2026-06-17", updated: "2026-06-22" },
  "/components": { created: "2026-06-17", updated: "2026-06-22" },
  "/section": { created: "2026-06-17", updated: "2026-06-22" },
};

export function pageMeta(pathname: string): PageMetaEntry | null {
  return PAGE_META[pathname] ?? null;
}
