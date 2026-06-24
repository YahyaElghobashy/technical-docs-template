/* ============================================================================
 * Sample operations-scenario data for the ScenarioLanes swimlane component.
 * Generic placeholder: five system lanes and a few flows showing automatic vs
 * human steps. Replace SYSTEMS and SCENARIOS with your own domain. The shape is
 * what ScenarioLanes consumes, so keep the exported names.
 * ========================================================================== */

export type SK = "app" | "api" | "db" | "queue" | "admin";
export const SYSTEMS: Record<SK, { label: string; icon: string; color: string }> = {
  app: { label: "App", icon: "box", color: "#7C3AED" },
  api: { label: "API", icon: "plug", color: "#E8833A" },
  db: { label: "Database", icon: "database", color: "#FF7A59" },
  queue: { label: "Queue", icon: "refresh", color: "#188038" },
  admin: { label: "Admin", icon: "user", color: "#2563EB" },
};
export const SYSTEM_ORDER: SK[] = ["app", "api", "db", "queue", "admin"];

export type Kind = "auto" | "admin" | "attention" | "error";
export const KIND: Record<Kind, { label: string; color: string }> = {
  auto: { label: "Automatic", color: "#1F8A5B" },
  admin: { label: "Human action", color: "#2563EB" },
  attention: { label: "Attention", color: "#C8881A" },
  error: { label: "Problem", color: "#DC2626" },
};

export type Contract = { status?: boolean; count?: boolean; comp?: boolean };
export type Step = {
  actors: SK[];
  kind: Kind;
  title: string;
  body: string;
  contract?: Contract;
};
export type Scenario = {
  id: string;
  icon: string;
  title: string;
  summary: string;
  bundle: boolean;
  steps: Step[];
};

export const CONTRACT_LABELS: { key: keyof Contract; label: string }[] = [
  { key: "status", label: "input validated" },
  { key: "count", label: "record found" },
  { key: "comp", label: "checks passed" },
];

export const SCENARIOS: Scenario[] = [
  {
    id: "happy",
    icon: "check",
    title: "Happy path request",
    summary: "A request that passes validation and is processed end to end with no human step.",
    bundle: false,
    steps: [
      { actors: ["app"], kind: "auto", title: "Request received", body: "The app receives a request and forwards it to the API." },
      { actors: ["api"], kind: "auto", title: "Validate", body: "The API validates the input." },
      { actors: ["api", "db"], kind: "auto", title: "Persist", body: "A record is written to the database." },
      { actors: ["app"], kind: "auto", title: "Respond", body: "The app returns a success response. No human step needed." },
    ],
  },
  {
    id: "review",
    icon: "warn",
    title: "Held for review",
    summary: "A request that needs a human to approve it before it can complete.",
    bundle: true,
    steps: [
      { actors: ["app"], kind: "auto", title: "Request received", body: "The app receives the request." },
      { actors: ["api"], kind: "attention", title: "Flagged for review", body: "The API flags the request and parks it in the queue." },
      { actors: ["queue"], kind: "attention", title: "Queued", body: "The request waits in the queue until a human acts." },
      {
        actors: ["admin"],
        kind: "admin",
        title: "Human approves",
        body: "An admin reviews the request and approves it.",
        contract: { status: true, count: true, comp: true },
      },
      { actors: ["api", "db"], kind: "auto", title: "Process", body: "The approved request is processed and persisted." },
      { actors: ["app"], kind: "auto", title: "Done", body: "The request completes." },
    ],
  },
  {
    id: "retry",
    icon: "refresh",
    title: "Retry after failure",
    summary: "A downstream failure that the system recovers from automatically.",
    bundle: false,
    steps: [
      { actors: ["api", "db"], kind: "error", title: "Write fails", body: "The database write fails (timeout or rate limit)." },
      { actors: ["queue"], kind: "attention", title: "Re-queued", body: "The request is placed back on the queue for retry." },
      { actors: ["queue", "api"], kind: "auto", title: "Retry", body: "A later run retries the request." },
      { actors: ["db"], kind: "auto", title: "Succeeds", body: "The write succeeds on retry." },
      { actors: ["app"], kind: "auto", title: "Done", body: "The request completes with no human step." },
    ],
  },
];

/* How many human (admin) steps a scenario contains. */
export function humanStepCount(s: Scenario): number {
  return s.steps.filter((st) => st.kind === "admin").length;
}
