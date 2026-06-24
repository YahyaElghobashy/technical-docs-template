import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { pageMeta } from "@/lib/page-meta";

/* ============================================================================
 * doc-kit, shared documentation primitives used by the Phase 7 pages
 * (Order Updates, Order Repair). Mirrors the house style established on the
 * Implementation page. Pill lives in @/components/Node.
 * ========================================================================== */

/* ---------- Inline icon set ---------- */
const ICONS: Record<string, ReactNode> = {
  bolt: (
    <>
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </>
  ),
  refresh: (
    <>
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 18l3 3 6.5-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.2-.4-.4-2.2z" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  truck: (
    <>
      <path d="M1 4h13v11H1z" />
      <path d="M14 8h4l3 3v4h-7z" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  box: (
    <>
      <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
      <path d="M3 8l9 5 9-5" />
      <path d="M12 13v8" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </>
  ),
  warn: (
    <>
      <path d="M10.3 3.5 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.5a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </>
  ),
  skip: (
    <>
      <path d="M5 4l10 8-10 8z" />
      <path d="M19 5v14" />
    </>
  ),
  halt: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9h6v6H9z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <path d="M3 6h.01" />
      <path d="M3 12h.01" />
      <path d="M3 18h.01" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="19" r="2.4" />
      <circle cx="18" cy="5" r="2.4" />
      <path d="M8.4 18.6A6 6 0 0 0 18 13.5V8" />
    </>
  ),
  plug: (
    <>
      <path d="M9 2v6" />
      <path d="M15 2v6" />
      <path d="M6 8h12v3a6 6 0 0 1-12 0z" />
      <path d="M12 17v5" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </>
  ),
  flag: (
    <>
      <path d="M4 22V4" />
      <path d="M4 4h13l-2 4 2 4H4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  doc: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  terminal: (
    <>
      <path d="M4 17l6-5-6-5" />
      <path d="M12 19h8" />
    </>
  ),
  model: (
    <>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="M7.8 7.6 10.5 16" />
      <path d="M16.2 7.6 13.5 16" />
      <path d="M8.2 6h7.6" />
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
  commit: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M3 12h6" />
      <path d="M15 12h6" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
  make: (
    <>
      <circle cx="6" cy="12" r="2" />
      <circle cx="18" cy="5" r="2" />
      <circle cx="18" cy="19" r="2" />
      <path d="M8 12h4l4-6" />
      <path d="M12 12h4l4 6" />
    </>
  ),
  star: (
    <>
      <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z" />
    </>
  ),
  store: (
    <>
      <path d="M3 9l1.8-4.5A1 1 0 0 1 5.7 4h12.6a1 1 0 0 1 .9.6L21 9" />
      <path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
      <path d="M9 20v-5h6v5" />
      <path d="M3 9h18" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2 3h3l2.4 12.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
};

export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
}

/* ---------- Page freshness stamp ---------- */
const PM_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function fmtPageDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  if (!y || !m || !d) return iso;
  return `${PM_MONTHS[m - 1]} ${d}, ${y}`;
}

/* Standard "Updated / Created" stamp shown on every documentation page. Reads
   the current route from the router and looks the dates up in the page-meta
   registry; props can override. A consistent verification line: if a page is
   changed without bumping its stamp, the dates fall out of step with git. */
export function PageMeta({ created, updated }: { created?: string; updated?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const entry = pageMeta(pathname);
  const c = created ?? entry?.created;
  const u = updated ?? entry?.updated;
  if (!c && !u) return null;
  return (
    <div className="mt-5 inline-flex items-center gap-2 text-[11px] text-muted-foreground">
      <span className="text-muted-foreground/70">
        <Icon name="clock" size={13} />
      </span>
      {u && (
        <span>
          Updated <span className="font-medium text-foreground/70">{fmtPageDate(u)}</span>
        </span>
      )}
      {c && u && <span className="text-muted-foreground/40">·</span>}
      {c && <span>Created {fmtPageDate(c)}</span>}
    </div>
  );
}

/* ---------- Count-up (SSR-safe) ---------- */
export function CountUp({
  to,
  duration = 1100,
  className = "",
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const [n, setN] = useState(to);
  const ref = useRef<HTMLSpanElement>(null);
  const ran = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || ran.current) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || ran.current) return;
        ran.current = true;
        io.disconnect();
        const start = performance.now();
        setN(0);
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return (
    <span ref={ref} className={className}>
      {n}
    </span>
  );
}

/* ---------- Section header ---------- */
export function SectionHeader({
  index,
  kicker,
  title,
  subtitle,
}: {
  index: string;
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-5 max-w-3xl">
      <span className="text-[11px] font-mono text-muted-foreground mt-2 shrink-0">{index}</span>
      <div>
        {kicker && (
          <span className="inline-block px-2.5 py-1 rounded-full text-[10.5px] font-medium bg-sage-soft text-sage-ink border border-line/60 shadow-sm">
            {kicker}
          </span>
        )}
        <h2 className="mt-3 text-[26px] tracking-tight font-semibold leading-tight">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-[14px] text-muted-foreground leading-relaxed">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

/* ---------- Note / callout ---------- */
export function Note({
  tone = "gold",
  children,
}: {
  tone?: "gold" | "coral" | "sage" | "slate";
  children: ReactNode;
}) {
  const cls =
    tone === "coral"
      ? "bg-coral-soft border-coral/40 text-coral-ink"
      : tone === "sage"
        ? "bg-sage-soft border-sage/40 text-sage-ink"
        : tone === "slate"
          ? "bg-slate-soft border-line text-slate-ink"
          : "bg-gold-soft border-gold/40 text-gold-ink";
  return (
    <div className={`rounded-xl border px-4 py-3 text-[12.5px] leading-relaxed ${cls}`}>
      {children}
    </div>
  );
}

/* ---------- Code ---------- */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded-md bg-muted text-foreground/85 font-mono text-[11.5px] border border-line/60">
      {children}
    </code>
  );
}

/* ---------- Accordion ---------- */
export function Accordion({
  num,
  title,
  kicker,
  tone = "slate",
  defaultOpen = false,
  children,
}: {
  num: ReactNode;
  title: ReactNode;
  kicker?: string;
  tone?: "slate" | "coral" | "sage" | "gold";
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const dot =
    tone === "coral"
      ? "bg-coral text-white"
      : tone === "sage"
        ? "bg-sage text-white"
        : tone === "gold"
          ? "bg-gold text-white"
          : "bg-slate-ink text-white";
  return (
    <section className="rounded-2xl border border-line bg-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-muted/40 transition-colors"
      >
        <span
          className={`h-8 w-8 shrink-0 rounded-full grid place-items-center text-[11px] font-mono font-semibold ${dot}`}
        >
          {num}
        </span>
        <span className="flex-1 min-w-0">
          {kicker && (
            <span className="block text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
              {kicker}
            </span>
          )}
          <span className="block text-[15px] font-semibold tracking-tight">{title}</span>
        </span>
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-line/60 text-[13px] leading-relaxed text-foreground/85 space-y-4">
          {children}
        </div>
      )}
    </section>
  );
}

/* ---------- Data table ---------- */
export function DataTable({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-card">
      <table className="w-full text-left border-collapse text-[12.5px]">
        <thead>
          <tr className="bg-muted/50">
            {head.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2.5 font-semibold text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-muted/30 transition-colors align-top">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2.5 text-foreground/85">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Hero stat cards ---------- */
export function StatCards({ stats }: { stats: { n: number; label: string; suffix?: string }[] }) {
  return (
    <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-line bg-card p-5">
          <div className="text-[34px] leading-none font-semibold tracking-tight tabular-nums">
            <CountUp to={s.n} />
            {s.suffix && (
              <span className="text-muted-foreground/70 text-[20px] font-medium">{s.suffix}</span>
            )}
          </div>
          <div className="mt-2 text-[12px] text-muted-foreground leading-snug">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- In-page TOC chips ---------- */
export function TocChips({ toc }: { toc: { id: string; label: string }[] }) {
  return (
    <div className="mt-8 flex flex-wrap gap-1.5">
      {toc.map((t, i) => (
        <a
          key={t.id}
          href={`#${t.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-line bg-card text-[11.5px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <span className="font-mono text-[10px] text-muted-foreground/70">
            {String(i + 1).padStart(2, "0")}
          </span>
          {t.label}
        </a>
      ))}
    </div>
  );
}

/* ---------- Cross-link cards ---------- */
export function CrossLinks({ links }: { links: { to: string; label: string; desc: string }[] }) {
  return (
    <section className="rounded-3xl border border-line bg-card p-8 space-y-5">
      <h3 className="text-[18px] font-semibold tracking-tight">Keep exploring</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {links.map((l) => (
          <a
            key={l.to}
            href={l.to}
            className="group rounded-2xl border border-line bg-card p-4 transition-colors hover:border-foreground/30"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13.5px] font-semibold tracking-tight">{l.label}</span>
              <span className="text-muted-foreground group-hover:translate-x-0.5 transition-transform">
                <Icon name="arrow" size={15} />
              </span>
            </div>
            <p className="mt-1 text-[11.5px] text-muted-foreground leading-snug">{l.desc}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ---------- Link card (catalogue + documentation overviews) ---------- */
export function LinkCard({
  to,
  icon,
  title,
  desc,
  ring = "#64748B",
  meta,
}: {
  to: string;
  icon: string;
  title: string;
  desc: string;
  ring?: string;
  meta?: ReactNode;
}) {
  return (
    <a
      href={to}
      className="group rounded-2xl border bg-card p-5 flex flex-col transition-all hover:-translate-y-0.5"
      style={{ borderColor: ring + "33" }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="h-10 w-10 rounded-xl grid place-items-center"
          style={{ background: ring + "1A", color: ring }}
        >
          <Icon name={icon} size={20} />
        </span>
        <span className="text-muted-foreground group-hover:translate-x-0.5 transition-transform">
          <Icon name="arrow" size={16} />
        </span>
      </div>
      <h3 className="mt-3.5 text-[15px] font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-[12.5px] text-muted-foreground leading-relaxed flex-1">{desc}</p>
      {meta && (
        <div className="mt-3 pt-3 border-t border-line/60 text-[11px] text-muted-foreground">
          {meta}
        </div>
      )}
    </a>
  );
}

/* ---------- Card grid wrapper ---------- */
export function CardGrid({
  cols = "lg:grid-cols-3",
  children,
}: {
  cols?: string;
  children: ReactNode;
}) {
  return <div className={`grid sm:grid-cols-2 ${cols} gap-3`}>{children}</div>;
}
