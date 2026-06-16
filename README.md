# Technical Documentation Template

An interactive technical-documentation **starter shell**: a complete design system,
navigation shell, and reusable diagram components — ready to populate with your own content.

Built with **TanStack Start** (React 19, SSR), **Tailwind CSS 4**, and shadcn-style
Radix primitives. It runs as a **dynamic SSR app** (not a static export), so it serves
instantly with no cold-start spin-up.

## What's included

- **Design tokens** — a semantic palette (`sage` · `coral` · `slate` · `gold`, each with
  soft/base/ink variants) plus animations, defined in [`src/styles.css`](src/styles.css)
  and wired to Tailwind utilities. Light + dark out of the box.
- **App shell** — sticky header with text wordmark, a dropdown-capable nav, and a footer,
  all driven by a single `SITE` config object in [`src/routes/__root.tsx`](src/routes/__root.tsx).
- **Diagram kit** — `DiagramCanvas`, `Line`, `PositionedNode`
  ([`src/components/DiagramCanvas.tsx`](src/components/DiagramCanvas.tsx)) for absolutely
  positioned, hover-annotated diagrams; `Node` + `Pill`
  ([`src/components/Node.tsx`](src/components/Node.tsx)) for collapsible content cards.
- **UI primitives** — the full shadcn-style set under [`src/components/ui`](src/components/ui).
- **Example pages** — Overview, Component gallery, Getting Started, and a Section example,
  all clearly marked as placeholders to replace.

## Quick start

Requires **Node 22+** (see [`.nvmrc`](.nvmrc)).

```bash
npm install        # .npmrc pins legacy-peer-deps
npm run dev        # http://localhost:3000
```

Production SSR build + smoke test:

```bash
NITRO_PRESET=node-server npm run build
node .output/server/index.mjs            # serves on $PORT (default 3000)
```

## Making it yours

1. **Branding** — edit the `SITE` object at the top of
   [`src/routes/__root.tsx`](src/routes/__root.tsx) (name, tagline, meta, footer).
2. **Navigation** — edit the `NAV` array in the same file; add a link or a dropdown item.
3. **Pages** — routing is file-based; each file in [`src/routes`](src/routes) is a page.
   Copy `section.tsx` as a starting point. `routeTree.gen.ts` regenerates automatically.
4. **Content** — compose pages from `Node`, `Pill`, `DiagramCanvas`, and the `ui/` primitives.

See the **Getting Started** page (`/getting-started`) in the running app for the same guide.

## Deployment

Nitro auto-detects **Vercel / Netlify / Cloudflare** at build time, so deploys are
zero-config. The included [`vercel.json`](vercel.json) sets the Vercel build/install
commands. To target a Node host instead, set `NITRO_PRESET=node-server`.

```bash
vercel          # first time: link/create the project
vercel --prod   # production deploy
```

## Repo layout

```
.
├── src/
│   ├── routes/        # file-based routes: __root (shell), index, components,
│   │                  #   getting-started, section
│   ├── components/     # DiagramCanvas, Node (+ Pill), + ui/ (shadcn-style primitives)
│   ├── lib/            # utils, error handling, server config (boilerplate)
│   ├── hooks/          # use-mobile
│   ├── styles.css      # Tailwind 4 + design tokens + animations
│   └── server.ts       # SSR error-wrapper entry
├── public/             # favicon, static assets
├── vite.config.ts      # TanStack Start config (Nitro forced on for deployable SSR)
└── vercel.json         # Vercel build settings
```

> **Build toolchain note:** `vite.config.ts` uses `@lovable.dev/vite-tanstack-config`,
> a wrapper that bundles the TanStack Start / React / Tailwind / Nitro Vite plugins. It is
> build-time tooling only — nothing it adds is user-facing. To drop it, replace
> `vite.config.ts` with the individual plugins (`@tanstack/react-start/plugin/vite`,
> `@vitejs/plugin-react`, `@tailwindcss/vite`, `vite-tsconfig-paths`, `nitro`).
