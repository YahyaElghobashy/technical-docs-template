import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";

// ─────────────────────────────────────────────────────────────────────────────
// SITE CONFIG — edit these for your project. This is the only branding surface.
// ─────────────────────────────────────────────────────────────────────────────
const SITE = {
  /** Short product/wordmark text shown in the header. */
  name: "Docs Template",
  /** Tagline next to the wordmark. Keep it short. */
  tagline: "Technical Documentation",
  /** Used for <title> / social meta. */
  title: "Technical Documentation Template",
  description:
    "An interactive technical-documentation template — design system, shell, and reusable diagram components, ready to populate with your own content.",
  /** Footer attribution. Set `org`/`url` to null to hide the credit block. */
  footer: {
    org: "Your Company",
    url: null as string | null,
    note: "Replace this footer in src/routes/__root.tsx",
    meta: ["Project · v0.1", "Edit SITE in __root.tsx"],
  },
} as const;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE.title },
      { name: "description", content: SITE.description },
      { property: "og:title", content: SITE.title },
      { property: "og:description", content: SITE.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: SITE.title },
      { name: "twitter:description", content: SITE.description },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <Outlet />
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION — add/rename pages here. Top-level links + an optional dropdown
// group. Each group item picks an icon from NAV_ICONS below.
// ─────────────────────────────────────────────────────────────────────────────
type NavItem = { to: string; label: string; desc: string; icon: keyof typeof NAV_ICONS };
type NavGroup = { type: "group"; label: string; items: NavItem[] };
type NavLinkDef = { type: "link"; to: string; label: string; exact?: boolean };
type NavEntry = NavLinkDef | NavGroup;

const NAV_ICONS: Record<string, ReactNode> = {
  page: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="18" cy="18" r="2.4" />
      <path d="M8.4 6H16a2 2 0 0 1 2 2v7.6" />
    </>
  ),
};

const NAV: NavEntry[] = [
  { type: "link", to: "/", label: "Overview", exact: true },
  { type: "link", to: "/components", label: "Components" },
  {
    type: "group",
    label: "Documentation",
    items: [
      {
        to: "/getting-started",
        label: "Getting Started",
        desc: "How to populate this template",
        icon: "book",
      },
      {
        to: "/section",
        label: "Section Example",
        desc: "A content page to copy",
        icon: "page",
      },
    ],
  },
];

function Wordmark() {
  return (
    <span className="grid h-6 w-6 place-items-center rounded-md bg-sage-soft text-sage-ink">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    </span>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-background/80 border-b border-line/70">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <Wordmark />
          <span className="text-[13px] font-semibold tracking-tight whitespace-nowrap">
            {SITE.name}
          </span>
          <span className="h-4 w-px bg-line" />
          <span className="text-[12px] text-muted-foreground whitespace-nowrap hidden sm:inline">
            {SITE.tagline}
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-[12.5px]">
          {NAV.map((n) =>
            n.type === "group" ? (
              <NavDropdown key={n.label} group={n} />
            ) : (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.exact }}
                activeProps={{ className: "bg-sage-soft text-sage-ink" }}
                inactiveProps={{ className: "text-muted-foreground hover:bg-muted" }}
                className="px-3 py-1.5 rounded-full transition-colors font-medium whitespace-nowrap"
              >
                {n.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}

function NavDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeChild = group.items.some((i) => i.to === pathname);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors font-medium whitespace-nowrap ${
          activeChild || open
            ? "bg-sage-soft text-sage-ink"
            : "text-muted-foreground hover:bg-muted"
        }`}
      >
        {group.label}
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ marginRight: -2 }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-[276px] rounded-2xl border border-line bg-card p-1.5 z-50 origin-top-right ds-menu-pop"
          style={{
            boxShadow:
              "0 14px 38px -12px rgba(85,39,105,0.22), 0 2px 8px -4px rgba(85,39,105,0.12)",
          }}
        >
          <div className="px-2.5 pt-1.5 pb-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80 font-semibold">
            {group.label}
          </div>
          {group.items.map((it) => {
            const active = pathname === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={`w-full text-left px-2.5 py-2 rounded-xl flex items-start gap-2.5 transition-colors group ${
                  active ? "bg-sage-soft" : "hover:bg-muted"
                }`}
              >
                <span
                  className={`mt-0.5 h-7 w-7 shrink-0 rounded-lg grid place-items-center border ${
                    active
                      ? "bg-card border-sage/50 text-sage-ink"
                      : "bg-muted/60 border-line text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {NAV_ICONS[it.icon]}
                  </svg>
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-[13px] font-semibold tracking-tight ${active ? "text-sage-ink" : "text-foreground"}`}
                  >
                    {it.label}
                  </span>
                  <span className="block text-[11px] text-muted-foreground leading-snug">
                    {it.desc}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SiteFooter() {
  const { footer } = SITE;
  return (
    <footer className="mt-20 border-t border-line/70">
      <div className="max-w-6xl mx-auto px-6 py-9 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="block text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
            Built with
          </span>
          <span className="text-[15px] font-semibold tracking-tight">{SITE.name}</span>
          <div className="mt-1 text-[11.5px] text-muted-foreground">{footer.note}</div>
        </div>
        <div className="text-[11.5px] text-muted-foreground sm:text-right leading-relaxed">
          {footer.org && (
            <div>
              Prepared by{" "}
              {footer.url ? (
                <a
                  href={footer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral-ink underline decoration-line underline-offset-2"
                >
                  {footer.org}
                </a>
              ) : (
                <span className="text-foreground/75 font-medium">{footer.org}</span>
              )}
            </div>
          )}
          {footer.meta.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </div>
    </footer>
  );
}
