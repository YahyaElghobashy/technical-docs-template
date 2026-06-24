import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/doc-kit";

/* ============================================================================
 * scenario-canvas: a reusable animated Make.com flow diagram. A scaled stage of
 * absolutely positioned node cards joined by Bezier SVG edges, with an optional
 * "trace a case" selector that dims everything except a chosen path. Modeled on
 * the bespoke diagrams in self-healing.tsx / scenario.tsx, factored out so the
 * Products & Bundles scenario pages share one canvas.
 * ========================================================================== */

export type Side = "t" | "b" | "l" | "r";
export type FlowTone =
  | "salla"
  | "hubspot"
  | "sheets"
  | "make"
  | "slate"
  | "green"
  | "gold"
  | "red"
  | "blue"
  | "violet"
  | "coral"
  | "sage";

/* Safe tone lookup: an unknown tone falls back to slate instead of crashing SSR. */
export function flowTone(t?: FlowTone): { ring: string; ink: string } {
  return (t && FLOW_TONES[t]) || FLOW_TONES.slate;
}

export const FLOW_TONES: Record<FlowTone, { ring: string; ink: string }> = {
  salla: { ring: "#2BB7A3", ink: "#0F766E" },
  hubspot: { ring: "#FF7A59", ink: "#B23A1B" },
  sheets: { ring: "#188038", ink: "#136B2E" },
  make: { ring: "#6D5BD0", ink: "#4B3FA0" },
  slate: { ring: "#64748B", ink: "#334155" },
  green: { ring: "#1F8A5B", ink: "#136B43" },
  gold: { ring: "#C8881A", ink: "#8A5D0F" },
  red: { ring: "#DC2626", ink: "#991B1B" },
  blue: { ring: "#2563EB", ink: "#1E40AF" },
  violet: { ring: "#7C3AED", ink: "#5B21B6" },
  coral: { ring: "#FF7A59", ink: "#B23A1B" },
  sage: { ring: "#1F8A5B", ink: "#136B43" },
};

export type FlowNode = {
  id: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  tone: FlowTone;
  title: string;
  sub?: string;
  num?: string;
  desc?: string;
};

export type FlowEdge = {
  from: string;
  fs: Side;
  to: string;
  ts: Side;
  tone?: FlowTone;
  label?: string;
  dashed?: boolean;
};

export type TraceCase = {
  key: string;
  icon: string;
  title: string;
  body?: ReactNode;
  /* node ids that stay lit for this case; an edge lights when both ends are lit */
  lit: string[];
};

const DEFAULT_W = 214;
const DEFAULT_H = 66;

function useScale(W: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => setS(Math.min(1, (el.clientWidth - 2) / W));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [W]);
  return { ref, s };
}

function anchor(n: FlowNode, side: Side) {
  const w = n.w ?? DEFAULT_W;
  const h = n.h ?? DEFAULT_H;
  if (side === "t") return { x: n.x, y: n.y - h / 2 };
  if (side === "b") return { x: n.x, y: n.y + h / 2 };
  if (side === "l") return { x: n.x - w / 2, y: n.y };
  return { x: n.x + w / 2, y: n.y };
}

function edgePath(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  if (Math.abs(dy) >= Math.abs(dx))
    return `M ${p1.x} ${p1.y} C ${p1.x} ${p1.y + dy * 0.45}, ${p2.x} ${p2.y - dy * 0.45}, ${p2.x} ${p2.y}`;
  return `M ${p1.x} ${p1.y} C ${p1.x + dx * 0.45} ${p1.y}, ${p2.x - dx * 0.45} ${p2.y}, ${p2.x} ${p2.y}`;
}

function NodeCard({
  n,
  lit,
  dim,
  selected,
  onClick,
}: {
  n: FlowNode;
  lit: boolean;
  dim: boolean;
  selected: boolean;
  onClick?: () => void;
}) {
  const t = flowTone(n.tone);
  const w = n.w ?? DEFAULT_W;
  const h = n.h ?? DEFAULT_H;
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute rounded-2xl border text-left px-3 grid place-items-center transition-all duration-300"
      style={{
        left: n.x - w / 2,
        top: n.y - h / 2,
        width: w,
        height: h,
        background: t.ring + "14",
        borderColor: t.ring + (selected ? "" : lit ? "88" : "33"),
        borderWidth: selected ? 2 : 1,
        opacity: dim ? 0.32 : 1,
        filter: dim ? "grayscale(0.7)" : "none",
        boxShadow: selected
          ? `0 0 0 3px ${t.ring}33, 0 10px 24px -10px ${t.ring}aa`
          : lit && !dim
            ? `0 8px 22px -14px ${t.ring}99`
            : "none",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {n.num && (
        <span
          className="absolute -top-2 -left-2 h-[18px] min-w-[18px] px-1 grid place-items-center rounded-full text-[9px] font-bold font-mono text-white"
          style={{ background: t.ring }}
        >
          {n.num}
        </span>
      )}
      <div className="w-full">
        <div
          className="text-[12.5px] font-semibold tracking-tight leading-tight"
          style={{ color: t.ink }}
        >
          {n.title}
        </div>
        {n.sub && (
          <div className="mt-0.5 text-[10px] leading-snug" style={{ color: t.ink, opacity: 0.72 }}>
            {n.sub}
          </div>
        )}
      </div>
    </button>
  );
}

export function ScenarioCanvas({
  width,
  height,
  nodes,
  edges,
  cases,
  caption,
}: {
  width: number;
  height: number;
  nodes: FlowNode[];
  edges: FlowEdge[];
  cases?: TraceCase[];
  caption?: string;
}) {
  const { ref, s } = useScale(width);
  const [caseKey, setCaseKey] = useState<string>(cases?.[0]?.key ?? "all");
  const [selId, setSelId] = useState<string | null>(null);

  const active = cases?.find((c) => c.key === caseKey) ?? null;
  const showAll = !active || active.key === "all";
  const litSet = new Set(active?.lit ?? nodes.map((n) => n.id));
  const byId = (id: string) => nodes.find((n) => n.id === id)!;
  const sel = selId ? nodes.find((n) => n.id === selId) ?? null : null;

  return (
    <div className="rounded-3xl border border-line bg-card overflow-hidden">
      {cases && cases.length > 0 && (
        <div className="px-4 py-2.5 border-b border-line/60 flex items-center gap-2 flex-wrap bg-muted/30">
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold mr-1">
            Trace a case
          </span>
          {cases.map((c) => {
            const on = c.key === caseKey;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  setCaseKey(c.key);
                  setSelId(null);
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                  on
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-card text-muted-foreground border-line hover:bg-muted"
                }`}
              >
                <Icon name={c.icon} size={12} />
                {c.title}
              </button>
            );
          })}
        </div>
      )}

      <div
        ref={ref}
        className="relative w-full overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at top left, var(--sage-soft), transparent 55%), radial-gradient(ellipse at bottom right, var(--coral-soft), transparent 55%)",
        }}
      >
        <div style={{ height: height * s }}>
          <div
            key={caseKey}
            className="mk-stage mk-play relative"
            style={{
              width,
              height,
              transform: `scale(${s})`,
              transformOrigin: "top left",
            }}
          >
            <svg
              className="absolute inset-0"
              width={width}
              height={height}
              style={{ overflow: "visible" }}
            >
              <defs>
                <marker
                  id="sc-ar"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6.5"
                  markerHeight="6.5"
                  orient="auto-start-reverse"
                >
                  <path d="M0,0 L10,5 L0,10 z" fill="var(--slate-ink)" opacity="0.5" />
                </marker>
              </defs>
              {edges.map((e, i) => {
                const on = showAll || (litSet.has(e.from) && litSet.has(e.to));
                const p1 = anchor(byId(e.from), e.fs);
                const p2 = anchor(byId(e.to), e.ts);
                const tone = e.tone ? flowTone(e.tone).ring : "var(--slate-ink)";
                return (
                  <path
                    key={i}
                    d={edgePath(p1, p2)}
                    fill="none"
                    stroke={on ? tone : "var(--slate-ink)"}
                    strokeWidth={on ? 2 : 1.3}
                    strokeOpacity={on ? 1 : 0.22}
                    strokeDasharray={e.dashed ? "4 6" : "7 7"}
                    markerEnd="url(#sc-ar)"
                    className={on ? "mk-edge mk-edge-lit" : "mk-edge"}
                    style={{
                      transition: "stroke .3s, stroke-opacity .3s, stroke-width .3s",
                      ["--mk-delay" as string]: `${i * 0.12}s`,
                    }}
                  />
                );
              })}
            </svg>

            {edges
              .filter((e) => e.label)
              .map((e, i) => {
                const on = showAll || (litSet.has(e.from) && litSet.has(e.to));
                const p1 = anchor(byId(e.from), e.fs);
                const p2 = anchor(byId(e.to), e.ts);
                const mx = (p1.x + p2.x) / 2;
                const my = (p1.y + p2.y) / 2;
                const tone = flowTone(e.tone);
                return (
                  <div
                    key={i}
                    className="absolute z-20"
                    style={{
                      left: mx,
                      top: my,
                      transform: "translate(-50%,-50%)",
                      opacity: on ? 1 : 0.3,
                      transition: "opacity .3s",
                    }}
                  >
                    <span
                      className="inline-block px-2 py-0.5 rounded-full border text-[9px] font-semibold shadow-sm whitespace-nowrap bg-card"
                      style={{ color: tone.ink, borderColor: tone.ring + "66" }}
                    >
                      {e.label}
                    </span>
                  </div>
                );
              })}

            {nodes.map((n) => (
              <NodeCard
                key={n.id}
                n={n}
                lit={showAll || litSet.has(n.id)}
                dim={!showAll && !litSet.has(n.id)}
                selected={selId === n.id}
                onClick={n.desc ? () => setSelId((p) => (p === n.id ? null : n.id)) : undefined}
              />
            ))}
          </div>
        </div>
      </div>

      {active?.body && (
        <div className="px-5 py-3 border-t border-line/70 bg-muted/20 text-[12px] text-foreground/80 leading-relaxed">
          {active.body}
        </div>
      )}

      {sel && sel.desc && (
        <div className="px-5 py-3.5 border-t border-line/70 bg-muted/20 flex items-start gap-3">
          <span
            className="mt-0.5 h-7 w-7 shrink-0 rounded-lg grid place-items-center text-[10px] font-mono font-bold text-white"
            style={{ background: flowTone(sel.tone).ring }}
          >
            {sel.num ?? "·"}
          </span>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold tracking-tight">{sel.title}</div>
            <p className="mt-1 text-[12px] text-muted-foreground leading-relaxed">{sel.desc}</p>
          </div>
        </div>
      )}

      {caption && (
        <div className="px-5 py-2.5 border-t border-line/70 text-[11px] text-muted-foreground">
          {caption}
        </div>
      )}
    </div>
  );
}
