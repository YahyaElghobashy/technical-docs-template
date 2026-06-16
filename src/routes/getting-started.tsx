import { createFileRoute, Link } from "@tanstack/react-router";
import { Pill } from "@/components/Node";

export const Route = createFileRoute("/getting-started")({
  head: () => ({
    meta: [
      { title: "Getting Started · Docs Template" },
      { name: "description", content: "How to populate this technical-documentation template." },
    ],
  }),
  component: GettingStarted,
});

function GettingStarted() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
      <header>
        <Pill tone="sage">Guide</Pill>
        <h1 className="mt-3 text-[34px] tracking-tight font-semibold leading-tight">
          Getting started
        </h1>
        <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
          This template is a TanStack Start (React 19, SSR) app with a Tailwind v4 design
          system. Everything renders server-side — no static export, no cold start.
        </p>
      </header>

      <Step n="1" title="Run it locally">
        <p>Requires Node 22+ (see <code>.nvmrc</code>).</p>
        <Pre>{`npm install   # .npmrc pins legacy-peer-deps
npm run dev   # http://localhost:3000`}</Pre>
      </Step>

      <Step n="2" title="Set your branding">
        <p>
          Open <code>src/routes/__root.tsx</code> and edit the <code>SITE</code> object at the
          top — name, tagline, meta description, and footer. That is the only place branding
          lives.
        </p>
      </Step>

      <Step n="3" title="Edit the navigation">
        <p>
          In the same file, the <code>NAV</code> array defines top-level links and the
          dropdown group. Add an entry, then create a matching route file.
        </p>
      </Step>

      <Step n="4" title="Add pages">
        <p>
          Routing is file-based — each file in <code>src/routes/</code> is a page. Copy{" "}
          <Link to="/section" className="underline decoration-line underline-offset-4 text-foreground">
            the section example
          </Link>{" "}
          as a starting point.
        </p>
        <Pre>{`// src/routes/my-page.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my-page")({
  component: () => <main className="max-w-6xl mx-auto px-6 py-12">…</main>,
});`}</Pre>
        <p className="text-muted-foreground">
          <code>routeTree.gen.ts</code> regenerates automatically — never edit it by hand.
        </p>
      </Step>

      <Step n="5" title="Use the design primitives">
        <p>
          Build pages from <code>Node</code>, <code>Pill</code> (<code>@/components/Node</code>)
          and <code>DiagramCanvas</code> / <code>Line</code> / <code>PositionedNode</code>{" "}
          (<code>@/components/DiagramCanvas</code>), plus the shadcn-style primitives in{" "}
          <code>@/components/ui</code>. Tokens live in <code>src/styles.css</code>.
        </p>
      </Step>

      <Step n="6" title="Build & deploy">
        <p>Production SSR build:</p>
        <Pre>{`NITRO_PRESET=node-server npm run build
node .output/server/index.mjs   # serves on $PORT (default 3000)`}</Pre>
        <p className="text-muted-foreground">
          Nitro auto-detects Vercel / Netlify / Cloudflare at build time. The included{" "}
          <code>vercel.json</code> makes Vercel deploys zero-config.
        </p>
      </Step>
    </main>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="flex gap-5">
      <span className="shrink-0 grid h-8 w-8 place-items-center rounded-full bg-sage-soft text-sage-ink text-[13px] font-semibold">
        {n}
      </span>
      <div className="min-w-0 space-y-3 text-[14px] leading-relaxed">
        <h2 className="text-[18px] font-semibold tracking-tight text-foreground">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Pre({ children }: { children: string }) {
  return (
    <pre className="rounded-xl border border-line bg-muted/50 p-4 text-[12.5px] font-mono overflow-x-auto text-foreground/80">
      {children}
    </pre>
  );
}
