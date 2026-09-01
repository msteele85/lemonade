import { supabase } from "./supabase";

/**
 * Profile fields the user types into freely. core_principles.md puts privacy
 * above everything else and requires that volunteered personal info stay out
 * of the database, so their contents must never be stored — a kid typing
 * their school or full name into a write-in box must not end up in analytics.
 *
 * We keep the analytical signal (did they write something, and roughly how
 * much) without keeping the text itself.
 */
const FREE_TEXT_KEYS = new Set(["customInterests", "customSkills", "custom"]);

function summarizeFreeText(value: unknown) {
  const text = typeof value === "string" ? value.trim() : "";
  return { provided: text.length > 0, length: text.length };
}

/**
 * Recursively replaces any free-text field with a non-identifying summary.
 * Applied to every event, so a new call site can't leak by forgetting to.
 */
function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) =>
        FREE_TEXT_KEYS.has(key)
          ? [key, summarizeFreeText(val)]
          : [key, redact(val)]
      )
    );
  }

  return value;
}

function getSessionId(): string {
  const key = "lemonade-session-id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export async function trackEvent(
  eventType: string,
  metadata: Record<string, unknown> = {}
) {
  try {
    const sessionId = getSessionId();
    await supabase.from("events").insert({
      session_id: sessionId,
      event_type: eventType,
      metadata: redact(metadata) as Record<string, unknown>,
    });
  } catch {
    // Silent fail — analytics should never break the app
  }
}
