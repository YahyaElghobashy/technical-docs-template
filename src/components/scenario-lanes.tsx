import { useEffect, useRef, useState, Fragment } from "react";
import { Icon } from "@/components/doc-kit";
import {
  SYSTEMS,
  SYSTEM_ORDER,
  KIND,
  CONTRACT_LABELS,
  SCENARIOS,
  humanStepCount,
  type SK,
  type Contract,
} from "@/lib/ops-scenarios";

/* ScenarioLanes: the comprehensive swimlane intervention map. Five system lanes
   (Salla, Make, HubSpot, Google Sheet, Admin) with the selected scenario's steps
   as columns. An animated token auto-plays through the steps; each lands in its
   acting system's lane. Admin-lane steps are highlighted as human touchpoints.
   Data comes from src/lib/ops-scenarios.ts (shared with the /operations player). */

const COL = 150; // px per step column
const LABEL = 136; // px for the sticky lane-label column
const STEP_MS = 1600;

export function ScenarioLanes() {
  const [sid, setSid] = useState(SCENARIOS[0].id);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scenario = SCENARIOS.find((s) => s.id === sid)!;
  const steps = scenario.steps;
  const last = steps.length - 1;
  const cur = steps[step];

  // reset + auto-start when the scenario changes (client only, SSR renders paused)
  useEffect(() => {
    setStep(0);
    setPlaying(true);
  }, [sid]);

  // stop auto-play once the end is reached (kept out of the updater for StrictMode safety)
  useEffect(() => {
    if (step >= last) setPlaying(false);
  }, [step, last]);

  // advance on a timer while playing; for reduced motion, jump straight to the end
  useEffect(() => {
    if (!playing) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStep(last);
      setPlaying(false);
      return;
    }
    const t = setInterval(() => setStep((s) => Math.min(last, s + 1)), STEP_MS);
    return () => clearInterval(t);
  }, [playing, last]);

  // keep the current column in view
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const target = step * COL - el.clientWidth / 2 + LABEL + COL / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [step]);

  const contract: Contract = {};
  if (scenario.bundle) {
    for (let k = 0; k <= step; k++) {
      const c = steps[k].contract;
      if (c) Object.assign(contract, c);
    }
  }

  const humanScenarios = SCENARIOS.filter((s) => humanStepCount(s) > 0).length;
  const gridCols = `${LABEL}px repeat(${steps.length}, ${COL}px)`;
  const minWidth = LABEL + steps.length * COL;

  return (
    <div className="rounded-3xl border border-line bg-card overflow-hidden">
      {/* scenario selector */}
      <div className="px-4 py-3 border-b border-line/60 bg-muted/30">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">
            Pick a scenario
          </span>
          <span className="text-[11px] text-muted-foreground">
            <strong className="text-foreground/80">{humanScenarios} of {SCENARIOS.length}</strong>{" "}
            scenarios need a human
          </span>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {SCENARIOS.map((s) => {
            const on = s.id === sid;
            const humans = humanStepCount(s);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSid(s.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                  on
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-card text-muted-foreground border-line hover:bg-muted"
                }`}
              >
                <Icon name={s.icon} size={12} />
                {s.title}
                <span
                  className={`ml-0.5 inline-flex items-center gap-0.5 rounded-full px-1 text-[9px] font-semibold ${
                    on ? "bg-background/20" : ""
                  }`}
                  style={!on ? { color: humans ? "#2563EB" : "#1F8A5B" } : undefined}
                  title={humans ? `${humans} human steps` : "fully automatic"}
                >
                  {humans ? (
                    <>
                      <Icon name="user" size={9} />
                      {humans}
                    </>
                  ) : (
                    <Icon name="check" size={9} />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* the lanes grid */}
      <div ref={scrollRef} className="overflow-x-auto">
        <div className="grid" style={{ gridTemplateColumns: gridCols, minWidth }}>
          {/* header row: step indices */}
          <div className="sticky left-0 z-10 bg-card border-b border-line/60 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Steps
          </div>
          {steps.map((st, i) => {
            const isCur = i === step;
            return (
              <button
                key={`h${i}`}
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setStep(i);
                }}
                className="border-b border-line/60 px-1.5 py-2 flex items-center justify-center"
              >
                <span
                  className="h-6 min-w-6 px-1 grid place-items-center rounded-full text-[10px] font-mono font-bold transition-all"
                  style={{
                    background: isCur ? KIND[st.kind].color : "var(--muted)",
                    color: isCur ? "#fff" : "var(--muted-foreground)",
                  }}
                >
                  {i + 1}
                </span>
              </button>
            );
          })}

          {/* one row per lane */}
          {SYSTEM_ORDER.map((lane) => {
            const sys = SYSTEMS[lane];
            return (
              <Fragment key={lane}>
                <div
                  className="sticky left-0 z-10 bg-card border-b border-line/40 px-3 py-3 flex items-center gap-2"
                  style={{ borderLeft: `3px solid ${sys.color}` }}
                >
                  <span
                    className="h-6 w-6 shrink-0 rounded-md grid place-items-center"
                    style={{ background: sys.color + "1A", color: sys.color }}
                  >
                    <Icon name={sys.icon} size={13} />
                  </span>
                  <span className="text-[11.5px] font-semibold tracking-tight">{sys.label}</span>
                </div>
                {steps.map((st, i) => {
                  const here = st.actors.includes(lane);
                  const isCur = i === step;
                  const past = i <= step;
                  const isHuman = lane === "admin" && st.kind === "admin";
                  return (
                    <button
                      key={`${lane}${i}`}
                      type="button"
                      onClick={() => {
                        setPlaying(false);
                        setStep(i);
                      }}
                      className="relative border-b border-line/40 px-1.5 py-2 min-h-[58px] flex items-center justify-center"
                      style={{ background: isCur ? sys.color + "0C" : "transparent" }}
                    >
                      {/* lane track line */}
                      <span
                        className="absolute left-0 right-0 top-1/2 h-px"
                        style={{ background: "var(--line)", opacity: 0.5 }}
                      />
                      {here && (
                        <span
                          className="relative z-10 w-full rounded-lg border px-2 py-1.5 text-left transition-all"
                          style={{
                            background: past ? sys.color + "1A" : "var(--card)",
                            borderColor: isCur ? sys.color : sys.color + (past ? "66" : "33"),
                            boxShadow: isCur ? `0 0 0 2px ${sys.color}40` : "none",
                            opacity: past ? 1 : 0.7,
                          }}
                        >
                          {isHuman && (
                            <span
                              className={`absolute -top-2 -right-2 h-[18px] w-[18px] grid place-items-center rounded-full text-white ${
                                isCur ? "flow-dot" : ""
                              }`}
                              style={{ background: "#2563EB" }}
                              title="Human action needed"
                            >
                              <Icon name="user" size={10} />
                            </span>
                          )}
                          <span
                            className="block text-[10.5px] font-semibold leading-tight line-clamp-2"
                            style={{ color: sys.color }}
                          >
                            {st.title}
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </Fragment>
            );
          })}

          {/* human touchpoints rail */}
          <div className="sticky left-0 z-10 bg-card px-3 py-2 text-[9.5px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
            <Icon name="user" size={11} />
            Human
          </div>
          {steps.map((st, i) => {
            const isHuman = st.kind === "admin";
            const isCur = i === step;
            return (
              <div key={`r${i}`} className="px-1.5 py-2 flex items-center justify-center">
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-all ${isCur && isHuman ? "flow-dot" : ""}`}
                  style={{
                    background: isHuman ? "#2563EB" : "var(--line)",
                    transform: isCur ? "scale(1.5)" : "scale(1)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* current-step detail */}
      <div className="px-5 py-4 border-t border-line/70 bg-muted/15">
        <div className="flex items-start gap-3.5">
          <span
            className="h-10 w-10 shrink-0 rounded-xl grid place-items-center"
            style={{ background: SYSTEMS[cur.actors[0]].color + "1A", color: SYSTEMS[cur.actors[0]].color }}
          >
            <Icon name={SYSTEMS[cur.actors[0]].icon} size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[9.5px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
                style={{ background: KIND[cur.kind].color + "1A", color: KIND[cur.kind].color }}
              >
                {KIND[cur.kind].label}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {cur.actors.map((a) => SYSTEMS[a].label).join(" + ")}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground ml-auto">
                Step {step + 1} of {steps.length}
              </span>
            </div>
            <h4 className="mt-1.5 text-[15px] font-semibold tracking-tight">{cur.title}</h4>
            <p className="mt-1 text-[12.5px] text-foreground/80 leading-relaxed">{cur.body}</p>
          </div>
        </div>

        {scenario.bundle && (
          <div className="mt-3 flex flex-wrap gap-2">
            {CONTRACT_LABELS.map((c) => {
              const ok = !!contract[c.key];
              return (
                <span
                  key={c.key}
                  className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono transition-all"
                  style={{
                    borderColor: ok ? "#1F8A5B" : "var(--line)",
                    background: ok ? "#1F8A5B14" : "transparent",
                    color: ok ? "#136B43" : "var(--muted-foreground)",
                  }}
                >
                  <Icon name={ok ? "check" : "clock"} size={11} />
                  {c.label}
                </span>
              );
            })}
          </div>
        )}

        {/* transport controls */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStep((s) => Math.max(0, s - 1));
            }}
            disabled={step === 0}
            className="h-8 w-8 grid place-items-center rounded-full border border-line transition-colors hover:bg-muted disabled:opacity-40"
            aria-label="Previous step"
          >
            <span className="rotate-180">
              <Icon name="arrow" size={14} />
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (step >= last) {
                setStep(0);
                setPlaying(true);
              } else {
                setPlaying((p) => !p);
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12.5px] font-semibold bg-foreground text-background hover:opacity-90 transition-opacity"
          >
            <Icon name={step >= last ? "refresh" : playing ? "halt" : "skip"} size={14} />
            {step >= last ? "Replay" : playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setStep((s) => Math.min(last, s + 1));
            }}
            disabled={step >= last}
            className="h-8 w-8 grid place-items-center rounded-full border border-line transition-colors hover:bg-muted disabled:opacity-40"
            aria-label="Next step"
          >
            <Icon name="arrow" size={14} />
          </button>
          <span className="ml-1 text-[11px] text-muted-foreground">
            {scenario.bundle ? "bundle scenario" : "no bundle contract"}
          </span>
        </div>
      </div>
    </div>
  );
}
