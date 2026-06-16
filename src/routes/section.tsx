import { createFileRoute } from "@tanstack/react-router";
import { Node, Pill } from "@/components/Node";

export const Route = createFileRoute("/section")({
  head: () => ({
    meta: [
      { title: "Section Example · Docs Template" },
      { name: "description", content: "A reusable content-page layout to copy for your own sections." },
    ],
  }),
  component: SectionExample,
});

function SectionExample() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
      <header>
        <Pill tone="coral">Section</Pill>
        <h1 className="mt-3 text-[34px] tracking-tight font-semibold leading-tight">
          Section example
        </h1>
        <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
          A plain content page — heading, prose, and a few collapsible nodes. Duplicate this
          file under a new name in <code className="text-foreground">src/routes/</code> and
          register it in the nav.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-[22px] font-semibold tracking-tight">A subsection</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Body copy goes here. Use the muted-foreground token for paragraphs and the
          foreground token for emphasis. Keep line length readable with{" "}
          <code className="text-foreground">max-w-3xl</code> on the main container.
        </p>

        <div className="space-y-3">
          <Node tone="slate" chip="Detail" title="Expandable detail" tagline="Click to reveal more.">
            <p>
              Nodes work well for FAQ-style or reference content where the summary is enough
              most of the time but the full detail should be one click away.
            </p>
          </Node>
          <Node tone="gold" chip="Note" title="Callout" tagline="Use tone to signal importance.">
            <p>Gold reads as a heads-up; coral as transactional; sage as catalog/structural.</p>
          </Node>
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-card p-8">
        <h3 className="text-[18px] font-semibold tracking-tight">Closing block</h3>
        <p className="text-[13px] text-muted-foreground mt-1 max-w-md">
          Wrap sections in a bordered card to set them apart. Replace all of this with your
          own documentation.
        </p>
      </section>
    </main>
  );
}
