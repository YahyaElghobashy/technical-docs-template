// Optional client error hook. By default this is a no-op — wire it up to your
// monitoring tool of choice (Sentry, Highlight, a custom endpoint, etc.) by
// implementing the body of `reportError`. Called from the root error boundary.

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  // Example: send to your own collector
  //   navigator.sendBeacon("/api/client-errors", JSON.stringify({ message: String(error), ...context }));
  if (import.meta.env.DEV) {
    console.error("[reportError]", error, {
      route: window.location.pathname,
      ...context,
    });
  }
}
