import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type Tone = "sage" | "coral" | "slate" | "gold";

const tones: Record<Tone, { bg: string; border: string; chip: string; ink: string }> = {
  sage: {
    bg: "bg-card",
    border: "border-sage/60",
    chip: "bg-sage-soft text-sage-ink",
    ink: "text-sage-ink",
  },
  coral: {
    bg: "bg-card",
    border: "border-coral/60",
    chip: "bg-coral-soft text-coral-ink",
    ink: "text-coral-ink",
  },
  slate: {
    bg: "bg-card",
    border: "border-line",
    chip: "bg-slate-soft text-slate-ink",
    ink: "text-slate-ink",
  },
  gold: {
    bg: "bg-card",
    border: "border-gold/60",
    chip: "bg-gold-soft text-gold-ink",
    ink: "text-gold-ink",
  },
};

interface NodeProps {
  tone?: Tone;
  title: string;
  chip?: string;
  tagline: string;
  children?: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

export function Node({
  tone = "slate",
  title,
  chip,
  tagline,
  children,
  className = "",
  defaultOpen = false,
}: NodeProps) {
  const [open, setOpen] = useState(defaultOpen);
  const t = tones[tone];
  return (
    <div
      className={`group relative rounded-2xl border ${t.border} ${t.bg} shadow-[0_1px_0_rgba(0,0,0,0.02),0_8px_24px_-12px_rgba(60,40,20,0.12)] transition-all ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className={`text-[15px] font-semibold tracking-tight ${t.ink}`}>{title}</h3>
            {chip && (
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${t.chip}`}
              >
                {chip}
              </span>
            )}
          </div>
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">{tagline}</p>
        </div>
        {children && (
          <ChevronDown
            className={`h-4 w-4 mt-0.5 text-muted-foreground transition-transform shrink-0 ${
              open ? "rotate-180" : ""
            }`}
          />
        )}
      </button>
      {open && children && (
        <div className="px-4 pb-4 pt-1 border-t border-line/60 text-[12.5px] leading-relaxed text-foreground/80 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

export function Pill({ children, tone = "slate" }: { children: ReactNode; tone?: Tone }) {
  const t = tones[tone];
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-[10.5px] font-medium ${t.chip} border border-line/60 shadow-sm`}
    >
      {children}
    </span>
  );
}