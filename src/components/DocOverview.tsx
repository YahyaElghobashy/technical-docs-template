import { Pill } from "@/components/Node";
import { Icon, LinkCard, CardGrid, PageMeta } from "@/components/doc-kit";
import { DOCS, docById, pageSections } from "@/lib/docs-config";

/* Overview / landing page for one documentation. Driven by the shared registry. */
export function DocOverview({ docId }: { docId: string }) {
  const doc = docById(docId);
  if (!doc) return null;
  const others = DOCS.filter((d) => d.id !== docId);
  const { sectioned, groups } = pageSections(doc);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* hero */}
      <section className="pt-6">
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <Pill tone={doc.tone}>Documentation · {doc.short}</Pill>
          <a
            href="/"
            className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground hover:text-foreground"
          >
            <span className="rotate-180">
              <Icon name="arrow" size={12} />
            </span>
            Catalogue
          </a>
        </div>
        <h1 className="text-[40px] leading-[1.05] tracking-tight font-semibold max-w-3xl">
          {doc.label}
        </h1>
        <p className="mt-4 max-w-2xl text-[14.5px] text-muted-foreground leading-relaxed">
          {doc.blurb}
        </p>
        <p className="mt-2 text-[12px] text-muted-foreground">
          Part of the ClaraHair HubSpot documentation · {doc.pages.length} pages
        </p>
        <PageMeta />
      </section>

      {/* pages, grouped by section when the documentation defines sections */}
      {sectioned ? (
        <div className="space-y-10">
          {groups.map((g) => (
            <section key={g.label ?? "_"} className="space-y-4">
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
                {g.label}
              </div>
              <CardGrid cols="lg:grid-cols-3">
                {g.pages.map((p) => (
                  <LinkCard
                    key={p.to}
                    to={p.to}
                    icon={p.icon}
                    title={p.label}
                    desc={p.desc}
                    ring={doc.ring}
                  />
                ))}
              </CardGrid>
            </section>
          ))}
        </div>
      ) : (
        <section className="space-y-4">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
            Pages in this documentation
          </div>
          <CardGrid cols="lg:grid-cols-3">
            {doc.pages.map((p) => (
              <LinkCard
                key={p.to}
                to={p.to}
                icon={p.icon}
                title={p.label}
                desc={p.desc}
                ring={doc.ring}
              />
            ))}
          </CardGrid>
        </section>
      )}

      {/* other documentations */}
      <section className="rounded-3xl border border-line bg-card p-6 sm:p-7 space-y-4">
        <h3 className="text-[15px] font-semibold tracking-tight">Other documentations</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {others.map((o) => (
            <a
              key={o.id}
              href={o.overview}
              className="group rounded-2xl border border-line bg-card p-4 flex items-center gap-3 transition-colors hover:border-foreground/30"
            >
              <span
                className="h-9 w-9 shrink-0 rounded-xl grid place-items-center"
                style={{ background: o.ring + "1A", color: o.ring }}
              >
                <Icon name={o.icon} size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] font-semibold tracking-tight">{o.label}</span>
                <span className="block text-[11.5px] text-muted-foreground truncate">
                  {o.blurb}
                </span>
              </span>
              <span className="ml-auto shrink-0 text-muted-foreground group-hover:translate-x-0.5 transition-transform">
                <Icon name="arrow" size={15} />
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
