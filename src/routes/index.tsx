import { createFileRoute, Link } from "@tanstack/react-router";
import { Node, Pill } from "@/components/Node";
import { DiagramCanvas, Line, PositionedNode } from "@/components/DiagramCanvas";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · Docs Template" },
      {
        name: "description",
        content: "Landing page of the technical-documentation template. Replace with your own content.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-20">
      <Hero />

      <Section
        index="01"
        kicker="Diagram component"
        title="An interactive diagram, ready to fill in"
        blurb="DiagramCanvas + Node + Line render absolutely-positioned, hover-annotated diagrams. Swap the nodes and connections below for your own model."
      >
        <ExampleDiagram />
      </Section>

      <Section
        index="02"
        kicker="Content blocks"
        title="Compose pages from the design primitives"
        blurb="Cards, pills, and collapsible nodes share one token-driven palette (sage / coral / slate / gold). Everything adapts to light and dark automatically."
      >
        <CardRow />
      </Section>

      <NextSteps />
    </main>
  );
}

function Hero() {
  return (
    <section className="pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Pill tone="gold">Template · replace this badge</Pill>
      </div>
      <h1 className="text-[44px] leading-[1.05] tracking-tight font-semibold max-w-3xl">
        A starting shell for{" "}
        <span className="text-sage-ink">interactive</span>{" "}
        <span className="text-coral-ink">documentation</span>.
      </h1>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
        The design system, navigation shell, and reusable diagram components are all in
        place. Edit{" "}
        <code className="text-foreground">src/routes/</code> to add your content and{" "}
        <code className="text-foreground">SITE</code> in{" "}
        <code className="text-foreground">__root.tsx</code> for branding. See the{" "}
        <Link
          to="/components"
          className="underline decoration-line underline-offset-4 text-foreground"
        >
          component gallery
        </Link>{" "}
        and{" "}
        <Link
          to="/getting-started"
          className="underline decoration-line underline-offset-4 text-foreground"
        >
          getting started
        </Link>{" "}
        guide.
      </p>
    </section>
  );
}

function Section({
  index,
  title,
  kicker,
  blurb,
  children,
}: {
  index: string;
  title: string;
  kicker: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-start gap-6 max-w-3xl">
        <span className="text-[11px] font-mono text-muted-foreground mt-2">{index}</span>
        <div>
          <Pill tone="sage">{kicker}</Pill>
          <h2 className="mt-3 text-[26px] tracking-tight font-semibold leading-tight">{title}</h2>
          <p className="mt-2 text-[14px] text-muted-foreground leading-relaxed">{blurb}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ExampleDiagram() {
  return (
    <DiagramCanvas
      ratio="16/9"
      lines={
        <Line
          x1={330}
          y1={500}
          x2={670}
          y2={500}
          arrow
          label="relates to"
          labelX={500}
          labelY={485}
          cardinality="1:many"
          from="Node A"
          to="Node B"
          description="Hover any connector to reveal its tooltip. Provide from/to/description to enable it."
        />
      }
    >
      <PositionedNode left="22%" top="50%" width="30%">
        <Node
          tone="sage"
          chip="Concept"
          title="Node A"
          tagline="A primary entity. Click to expand details."
          defaultOpen
        >
          <ul className="list-disc pl-4 space-y-1">
            <li>Replace with your own fields</li>
            <li>
              Inline <code>code</code> styles automatically
            </li>
            <li>Pick a tone: sage · coral · slate · gold</li>
          </ul>
        </Node>
      </PositionedNode>

      <PositionedNode left="78%" top="50%" width="30%">
        <Node
          tone="coral"
          chip="Related"
          title="Node B"
          tagline="A second entity connected to the first."
        >
          <ul className="list-disc pl-4 space-y-1">
            <li>Collapsed by default (no defaultOpen)</li>
            <li>Children render when expanded</li>
          </ul>
        </Node>
      </PositionedNode>
    </DiagramCanvas>
  );
}

function CardRow() {
  const cards = [
    { tone: "sage" as const, chip: "Step 1", title: "Define your model", body: "List the objects and relationships you want to document." },
    { tone: "coral" as const, chip: "Step 2", title: "Lay out the diagrams", body: "Position nodes on the canvas and connect them with Line." },
    { tone: "gold" as const, chip: "Step 3", title: "Write the pages", body: "Add routes under src/routes and link them in the nav." },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <Node key={c.title} tone={c.tone} chip={c.chip} title={c.title} tagline={c.body} />
      ))}
    </div>
  );
}

function NextSteps() {
  return (
    <section className="rounded-3xl border border-line bg-card p-8 flex flex-wrap items-center justify-between gap-6">
      <div>
        <h3 className="text-[18px] font-semibold tracking-tight">Make it yours</h3>
        <p className="text-[13px] text-muted-foreground mt-1 max-w-md">
          Explore the components, then start replacing pages with your documentation.
        </p>
      </div>
      <div className="flex gap-2">
        <Link
          to="/components"
          className="px-4 py-2 rounded-full bg-sage-soft text-sage-ink text-[13px] font-medium hover:opacity-90"
        >
          Component gallery →
        </Link>
        <Link
          to="/getting-started"
          className="px-4 py-2 rounded-full bg-coral-soft text-coral-ink text-[13px] font-medium hover:opacity-90"
        >
          Getting started →
        </Link>
      </div>
    </section>
  );
}
