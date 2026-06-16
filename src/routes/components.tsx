import { createFileRoute } from "@tanstack/react-router";
import { Node, Pill } from "@/components/Node";

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

function Components() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      <header className="max-w-3xl">
        <Pill tone="slate">Design system</Pill>
        <h1 className="mt-3 text-[34px] tracking-tight font-semibold leading-tight">
          Component gallery
        </h1>
        <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
          Every primitive below is token-driven — colors come from CSS variables in{" "}
          <code className="text-foreground">src/styles.css</code> and adapt to light/dark.
          The four semantic tones carry meaning across the whole app.
        </p>
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
