/**
 * Simple in-memory rate limiter for single-server deployments.
 * No external dependencies — uses a Map with auto-cleanup.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodically clean expired entries to prevent memory leaks
const CLEANUP_INTERVAL_MS = 60_000;
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function ensureCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now >= entry.resetAt) {
        store.delete(key);
      }
    }
    // Stop the timer when the store is empty
    if (store.size === 0 && cleanupTimer) {
      clearInterval(cleanupTimer);
      cleanupTimer = null;
    }
  }, CLEANUP_INTERVAL_MS);
  // Allow the process to exit even if the timer is running
  if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref();
  }
}

/**
 * Check and consume one request from the rate limit bucket.
 *
 * @param key       Unique identifier (e.g. "login:1.2.3.4")
 * @param limit     Max requests allowed in the window
 * @param windowMs  Window duration in milliseconds
 * @returns         `{ success, remaining }` — success=false when limit exceeded
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  ensureCleanup();

  const now = Date.now();
  const entry = store.get(key);

  // Window expired or first request — start fresh
  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  // Within window
  if (entry.count < limit) {
    entry.count++;
    return { success: true, remaining: limit - entry.count };
  }

  // Limit exceeded
  return { success: false, remaining: 0 };
}

/**
 * Extract a client IP from common proxy headers, with a fallback.
 */
function getClientIp(request: Request): string {
  const headers = new Headers(request.headers);
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; take the first
    return forwarded.split(",")[0].trim();
  }
  return headers.get("x-real-ip") ?? "unknown";
}

/**
 * Convenience wrapper: extracts IP, applies rate limit, and returns either
 * a success result or a 429 NextResponse you can return directly.
 *
 * @param request   Incoming Request object
 * @param limit     Max requests per window (default 10)
 * @param windowMs  Window in ms (default 60 000 = 1 minute)
 */
export function checkRateLimit(
  request: Request,
  limit: number = 10,
  windowMs: number = 60_000
): { success: true; remaining: number } | { success: false; remaining: 0 } {
  const ip = getClientIp(request);
  const url = new URL(request.url);
  const key = `${url.pathname}:${ip}`;
  return rateLimit(key, limit, windowMs) as
    | { success: true; remaining: number }
    | { success: false; remaining: 0 };
}
