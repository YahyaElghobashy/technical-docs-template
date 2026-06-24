import { createFileRoute } from "@tanstack/react-router";
import { Node, Pill } from "@/components/Node";
import {
  Icon,
  Note,
  Code,
  Accordion,
  DataTable,
  StatCards,
  TocChips,
  LinkCard,
  CardGrid,
  PageMeta,
} from "@/components/doc-kit";
import { ScenarioCanvas, type FlowNode, type FlowEdge, type TraceCase } from "@/components/scenario-canvas";
import { ScenarioLanes } from "@/components/scenario-lanes";
import { GateSimulator } from "@/components/gate-simulator";

export const Route = createFileRoute("/components")({
  head: () => ({
    meta: [
      { title: "Components · Docs Template" },
      { name: "description", content: "Gallery of the design-system primitives bundled with the template." },
    ],
  }),
  component: Components,
});

const TONES = ["sage", "coral", "slate", "gold"] as const;

const ICON_NAMES = [
  "bolt", "refresh", "wrench", "bell", "clock", "truck", "box", "check", "x", "warn",
  "skip", "halt", "shield", "list", "route", "plug", "link", "flag", "eye", "doc",
  "arrow", "terminal", "model", "grid", "commit", "book", "make", "star", "store",
  "cart", "database", "user",
];

/* sample flow for the ScenarioCanvas demo */
const CANVAS_NODES: FlowNode[] = [
  { id: "app", x: 140, y: 90, tone: "violet", num: "1", title: "App", sub: "request in", desc: "The app receives a request." },
  { id: "api", x: 420, y: 90, tone: "make", num: "2", title: "API", sub: "validate", desc: "The API validates the input." },
  { id: "db", x: 700, y: 90, tone: "coral", num: "3", title: "Database", sub: "persist", desc: "A record is written." },
  { id: "queue", x: 420, y: 230, tone: "green", num: "4", title: "Queue", sub: "retry on fail", desc: "Failed writes are retried from the queue." },
];
const CANVAS_EDGES: FlowEdge[] = [
  { from: "app", fs: "r", to: "api", ts: "l", tone: "violet", label: "request" },
  { from: "api", fs: "r", to: "db", ts: "l", tone: "green", label: "valid" },
  { from: "api", fs: "b", to: "queue", ts: "t", tone: "red", label: "failed", dashed: true },
];
const CANVAS_CASES: TraceCase[] = [
  { key: "all", icon: "route", title: "Whole flow", lit: ["app", "api", "db", "queue"] },
  { key: "ok", icon: "check", title: "Success", body: "Validated and persisted.", lit: ["app", "api", "db"] },
  { key: "fail", icon: "warn", title: "Failure", body: "Write failed; retried via the queue.", lit: ["app", "api", "queue"] },
];

function Components() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <header className="max-w-3xl">
        <Pill tone="slate">Design system</Pill>
        <h1 className="mt-3 text-[34px] tracking-tight font-semibold leading-tight">
          Component gallery
        </h1>
        <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
          Every primitive below is token-driven: colors come from CSS variables in{" "}
          <code className="text-foreground">src/styles.css</code> and adapt to light/dark. The four
          semantic tones carry meaning across the whole app.
        </p>
        <PageMeta />
        <StatCards
          stats={[
            { n: 12, label: "shared components" },
            { n: 4, label: "semantic tones" },
            { n: ICON_NAMES.length, label: "icons" },
            { n: 1, label: "colour scheme" },
          ]}
        />
      </header>

      <Block title="Tones" subtitle="Each tone has soft / base / ink variants used by chips, borders, and text.">
        <div className="flex flex-wrap gap-3">
          {TONES.map((t) => (
            <div key={t} className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-lg" style={{ background: `var(--${t})` }} />
              <span className="h-9 w-9 rounded-lg" style={{ background: `var(--${t}-soft)` }} />
              <span
                className="grid h-9 px-3 place-items-center rounded-lg text-[12px] font-medium"
                style={{ background: `var(--${t}-soft)`, color: `var(--${t}-ink)` }}
              >
                {t}
              </span>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Pills" subtitle="Compact status / category labels.">
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <Pill key={t} tone={t}>
              {t} pill
            </Pill>
          ))}
        </div>
      </Block>

      <Block title="Icons" subtitle="The inline stroke-icon set from doc-kit. Use <Icon name=... size=... />.">
        <div className="flex flex-wrap gap-2">
          {ICON_NAMES.map((n) => (
            <span
              key={n}
              title={n}
              className="h-10 w-10 grid place-items-center rounded-xl border border-line bg-card text-muted-foreground"
            >
              <Icon name={n} size={18} />
            </span>
          ))}
        </div>
      </Block>

      <Block title="Notes & code" subtitle="Tone-colored callouts and inline code.">
        <div className="space-y-2">
          <Note tone="sage">A sage note for positive or confirming information.</Note>
          <Note tone="gold">A gold note for tips and things to watch for, like {" "}<Code>a code token</Code>.</Note>
          <Note tone="coral">A coral note for warnings.</Note>
          <Note tone="slate">A slate note for neutral asides.</Note>
        </div>
      </Block>

      <Block title="Accordion & table" subtitle="Collapsible detail and a token-driven data table.">
        <Accordion num="1" tone="sage" kicker="Expandable" title="A collapsible accordion" defaultOpen>
          <p>Put any detail here. Numbered dot, optional kicker, four tones.</p>
        </Accordion>
        <div className="mt-3">
          <DataTable
            head={["Token", "Meaning"]}
            rows={[
              ["sage", "success / positive"],
              ["coral", "action / warning"],
              ["gold", "attention / tip"],
              ["slate", "neutral"],
            ]}
          />
        </div>
      </Block>

      <Block title="TOC chips & link cards" subtitle="In-page navigation and card links.">
        <TocChips toc={[{ id: "a", label: "First" }, { id: "b", label: "Second" }, { id: "c", label: "Third" }]} />
        <div className="mt-3">
          <CardGrid cols="lg:grid-cols-2">
            <LinkCard to="/getting-started" icon="bolt" title="Getting Started" desc="Set up and run the project." ring="#1F8A5B" />
            <LinkCard to="/section" icon="doc" title="Example Section" desc="A page to copy from." ring="#FF7A59" />
          </CardGrid>
        </div>
      </Block>

      <Block title="Scenario canvas" subtitle="Animated flow diagram: scaled stage, Bezier edges, trace-a-case dim/light.">
        <ScenarioCanvas width={840} height={320} nodes={CANVAS_NODES} edges={CANVAS_EDGES} cases={CANVAS_CASES} />
      </Block>

      <Block title="Swimlane intervention map" subtitle="Pick a scenario; the token plays through the system lanes, highlighting human steps. Data in src/lib/ops-scenarios.ts.">
        <ScenarioLanes />
      </Block>

      <Block title="Interactive gate simulator" subtitle="A reusable pass/hold decision demo. Build a batch and watch the gate decide.">
        <GateSimulator />
      </Block>

      <Block title="Nodes" subtitle="Collapsible cards. Pass children to make them expandable; defaultOpen to start open.">
        <div className="grid gap-4 sm:grid-cols-2">
          {TONES.map((t) => (
            <Node
              key={t}
              tone={t}
              chip={`${t} · chip`}
              title={`${t[0].toUpperCase()}${t.slice(1)} node`}
              tagline="Tagline summarising this node. Click to expand."
              defaultOpen={t === "sage"}
            >
              <ul className="list-disc pl-4 space-y-1">
                <li>Expanded body content goes here</li>
                <li>
                  Supports inline <code>code</code> and lists
                </li>
              </ul>
            </Node>
          ))}
        </div>
      </Block>

      <Block title="Typography & cards" subtitle="The base surface, border, and muted-foreground tokens.">
        <div className="rounded-3xl border border-line bg-card p-8 space-y-3">
          <h3 className="text-[20px] font-semibold tracking-tight">Card heading</h3>
          <p className="text-[14px] text-muted-foreground leading-relaxed max-w-prose">
            Body copy uses <code className="text-foreground">text-muted-foreground</code> over a{" "}
            <code className="text-foreground">bg-card</code> surface bordered with{" "}
            <code className="text-foreground">border-line</code>. Rounded-3xl is the standard
            container radius used across pages.
          </p>
        </div>
      </Block>
    </main>
  );
}

function Block({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-[20px] font-semibold tracking-tight">{title}</h2>
        <p className="text-[13px] text-muted-foreground mt-1">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
