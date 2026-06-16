import { useState, type ReactNode } from "react";

/**
 * Fixed-design canvas. Children are absolutely positioned in % so layout
 * scales cleanly. SVG layer draws beneath via the `lines` slot.
 */
export function DiagramCanvas({
  ratio = "16/10",
  lines,
  children,
  className = "",
}: {
  ratio?: string;
  lines?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full rounded-3xl border border-line/70 bg-[radial-gradient(ellipse_at_top,var(--sage-soft),transparent_60%),radial-gradient(ellipse_at_bottom,var(--coral-soft),transparent_55%)] overflow-hidden ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--slate-ink)" opacity="0.7" />
          </marker>
          <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--coral-ink)" />
          </marker>
        </defs>
        {lines}
      </svg>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

export function Line({
  x1,
  y1,
  x2,
  y2,
  dashed,
  arrow,
  label,
  labelX,
  labelY,
  cardinality,
  from,
  to,
  description,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
  arrow?: boolean;
  label?: string;
  labelX?: number;
  labelY?: number;
  cardinality?: "1:1" | "1:many" | "many:1" | "many:many";
  from?: string;
  to?: string;
  description?: string;
}) {
  const [hover, setHover] = useState(false);
  const hasTip = Boolean(from && to);
  const stroke = hover ? "var(--coral-ink)" : "var(--slate-ink)";
  const opacity = hover ? 0.95 : 0.45;
  const tipX = labelX ?? (x1 + x2) / 2;
  const tipY = labelY ?? (y1 + y2) / 2;
  return (
    <g style={{ pointerEvents: hasTip ? "auto" : "none" }}>
      {/* fat invisible hit area */}
      {hasTip && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="transparent"
          strokeWidth={22}
          style={{ cursor: "help" }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
      )}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeOpacity={opacity}
        strokeWidth={hover ? 2.2 : 1.6}
        strokeDasharray={dashed ? "6 5" : undefined}
        markerEnd={arrow ? (hover ? "url(#arrow-active)" : "url(#arrow)") : undefined}
        style={{ transition: "stroke 150ms, stroke-width 150ms, stroke-opacity 150ms" }}
        pointerEvents="none"
      />
      {label && labelX != null && labelY != null && (
        <foreignObject x={labelX - 110} y={labelY - 14} width="220" height="30" pointerEvents="none">
          <div className="flex justify-center">
            <span
              className={`px-2 py-0.5 rounded-full border text-[9px] font-medium shadow-sm whitespace-nowrap inline-flex items-center gap-1.5 transition-colors ${
                hover
                  ? "bg-coral-soft border-coral/60 text-coral-ink"
                  : "bg-card border-line text-slate-ink"
              }`}
            >
              {cardinality && (
                <em className="not-italic text-[8.5px] font-mono px-1 py-px rounded bg-foreground/5 text-foreground/70">
                  {cardinality}
                </em>
              )}
              {label}
            </span>
          </div>
        </foreignObject>
      )}
      {hasTip && hover && (
        <foreignObject x={tipX - 140} y={tipY + 14} width={280} height={140} pointerEvents="none">
          <div className="rounded-xl border border-line bg-card shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)] px-3 py-2.5 text-[11px] leading-snug animate-fade-in">
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span className="font-semibold text-foreground">{from}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-semibold text-foreground">{to}</span>
              {cardinality && (
                <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-coral-soft text-coral-ink uppercase tracking-wider">
                  {cardinality}
                </span>
              )}
            </div>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
            {dashed && (
              <p className="mt-1.5 text-[10px] text-gold-ink">⚠ Soft reference — a dashed line marks an indirect / logical link.</p>
            )}
          </div>
        </foreignObject>
      )}
    </g>
  );
}

export function PositionedNode({
  left,
  top,
  width = "26%",
  children,
}: {
  left: string;
  top: string;
  width?: string;
  children: ReactNode;
}) {
  return (
    <div className="absolute" style={{ left, top, width, transform: "translate(-50%, -50%)" }}>
      {children}
    </div>
  );
}