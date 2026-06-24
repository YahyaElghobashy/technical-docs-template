import { useRef, useState } from "react";
import { Icon } from "@/components/doc-kit";

/* GateSimulator: a generic interactive "verification gate" demo. Build a mock
   batch, set each item's state, and watch the gate decide Ready (process now)
   vs Held (park for a human). A reusable pattern for any pass/hold decision;
   replace ITEM_TYPES and the wording with your domain. Self-contained, no data
   dependencies. */

type ItemKey = "valid" | "pending" | "trusted" | "missing";

type ItemType = {
  key: ItemKey;
  label: string;
  verified: boolean;
  reason: string;
  color: string;
};

const ITEM_TYPES: ItemType[] = [
  { key: "valid", label: "Valid item (found & approved)", verified: true, reason: "Found and approved", color: "#1F8A5B" },
  { key: "trusted", label: "Trusted item (bypasses the check)", verified: true, reason: "Trusted source, skips the check", color: "#1F8A5B" },
  { key: "pending", label: "Pending review", verified: false, reason: "Exists but not yet reviewed", color: "#C8881A" },
  { key: "missing", label: "Missing / unknown", verified: false, reason: "Not found", color: "#DC2626" },
];

const TYPE = (k: ItemKey) => ITEM_TYPES.find((t) => t.key === k)!;

const PRESETS: { label: string; items: ItemKey[] }[] = [
  { label: "All ready", items: ["valid", "trusted"] },
  { label: "One pending", items: ["valid", "pending"] },
  { label: "One missing", items: ["valid", "missing"] },
  { label: "Mixed batch", items: ["valid", "pending", "missing"] },
];

type Row = { id: number; type: ItemKey };

export function GateSimulator() {
  const idRef = useRef(3);
  const [rows, setRows] = useState<Row[]>([
    { id: 1, type: "valid" },
    { id: 2, type: "trusted" },
  ]);

  const unverified = rows.filter((r) => !TYPE(r.type).verified);
  const held = unverified.length > 0;
  const decisionKey = `${held}-${unverified.length}-${rows.length}`;

  const addRow = () => setRows((rs) => [...rs, { id: idRef.current++, type: "valid" }]);
  const removeRow = (id: number) => setRows((rs) => rs.filter((r) => r.id !== id));
  const setType = (id: number, type: ItemKey) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, type } : r)));
  const preset = (items: ItemKey[]) =>
    setRows(items.map((type) => ({ id: idRef.current++, type })));

  return (
    <div className="rounded-3xl border border-line bg-card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-line/60 bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="text-coral-ink">
            <Icon name="halt" size={16} />
          </span>
          <h3 className="text-[14px] font-semibold tracking-tight">Verification gate</h3>
        </div>
        <p className="mt-1 text-[12px] text-muted-foreground leading-relaxed">
          Build a mock batch, set each item's state, and watch the gate decide. One unverified item
          holds the whole batch for a human.
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => preset(p.items)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-line bg-card text-muted-foreground hover:bg-muted transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 space-y-2">
        <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
          Batch items ({rows.length})
        </div>
        {rows.length === 0 && (
          <p className="text-[12px] text-muted-foreground italic">
            Empty batch. Add an item, or pick a preset above.
          </p>
        )}
        {rows.map((r, i) => {
          const t = TYPE(r.type);
          return (
            <div
              key={r.id}
              className="rounded-2xl border bg-card p-3 flex flex-wrap items-center gap-3"
              style={{ borderColor: t.color + "44" }}
            >
              <span
                className="h-6 w-6 shrink-0 rounded-full grid place-items-center text-[10px] font-mono font-bold text-white"
                style={{ background: t.color }}
              >
                {i + 1}
              </span>
              <select
                value={r.type}
                onChange={(e) => setType(r.id, e.target.value as ItemKey)}
                className="text-[12.5px] rounded-lg border border-line bg-card px-2.5 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-coral/30"
              >
                {ITEM_TYPES.map((it) => (
                  <option key={it.key} value={it.key}>
                    {it.label}
                  </option>
                ))}
              </select>
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-semibold"
                style={{ background: t.color + "1A", color: t.color }}
              >
                <Icon name={t.verified ? "check" : "warn"} size={11} />
                {t.verified ? "Verified" : "Unverified"}
              </span>
              <span className="text-[11px] text-muted-foreground">{t.reason}</span>
              <button
                type="button"
                onClick={() => removeRow(r.id)}
                className="ml-auto h-6 w-6 grid place-items-center rounded-full border border-line text-muted-foreground hover:bg-muted transition-colors"
                aria-label={`Remove item ${i + 1}`}
              >
                <Icon name="x" size={12} />
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={addRow}
          className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border border-line bg-card text-muted-foreground hover:bg-muted transition-colors"
        >
          <Icon name="box" size={13} />
          Add item
        </button>
      </div>

      <div
        key={decisionKey}
        className="px-5 py-5 border-t border-line/70 animate-fade-in"
        style={{ background: (held ? "#C8881A" : "#1F8A5B") + "0D" }}
      >
        <div className="flex items-start gap-4">
          <span
            className="h-12 w-12 shrink-0 rounded-2xl grid place-items-center text-white"
            style={{ background: held ? "#C8881A" : "#1F8A5B" }}
          >
            <Icon name={held ? "halt" : "check"} size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[15px] font-bold tracking-tight"
                style={{ color: held ? "#8A5D0F" : "#136B43" }}
              >
                {held ? "Batch HELD" : "Batch READY"}
              </span>
              <span className="text-[11px] font-mono text-muted-foreground">
                unverified = {unverified.length}
              </span>
            </div>
            <p className="mt-1 text-[12.5px] text-foreground/80 leading-relaxed">
              {held
                ? `${unverified.length} item${unverified.length === 1 ? "" : "s"} did not pass, so the batch is parked for a human instead of being processed.`
                : "Every item passed, so the batch is processed straight through."}
            </p>

            <div className="mt-3 flex items-center gap-2 flex-wrap text-[11px] font-semibold">
              <span className="px-2.5 py-1 rounded-full border border-line bg-card">Batch</span>
              <Icon name="arrow" size={13} />
              <span className="px-2.5 py-1 rounded-full border border-line bg-card">Gate</span>
              <Icon name="arrow" size={13} />
              {held ? (
                <>
                  <span className="px-2.5 py-1 rounded-full text-white" style={{ background: "#C8881A" }}>
                    Held for review
                  </span>
                  <Icon name="arrow" size={13} />
                  <span className="px-2.5 py-1 rounded-full border border-line bg-card text-muted-foreground">
                    Human resolves
                  </span>
                </>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-white" style={{ background: "#1F8A5B" }}>
                  Process
                </span>
              )}
            </div>

            {held && (
              <div className="mt-3 flex items-start gap-2 text-[11.5px] text-foreground/75">
                <span className="mt-0.5 shrink-0" style={{ color: "#2563EB" }}>
                  <Icon name="user" size={14} />
                </span>
                <span>Human step: resolve the flagged item(s), then release the batch.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
