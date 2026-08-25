import { backend, pluginKey } from "./binding.js";
import crypto from "node:crypto";

/**
 * Exported so a caller can size its own deadline against it: a plugin waiting
 * for another replica's mint must wait longer than a holder can possibly hold,
 * and a matching literal in the plugin drifts from this one silently.
 */
export const LOCK_TTL_MS = 30_000;

/**
 * How far "once" reaches is the host's choice of backend: fleet-wide under a
 * distributed one, process-wide under the memory backend. A plugin assuming the
 * former under the latter repeats the work per process, which is wasteful
 * rather than wrong.
 *
 * Keep `ttlMs` as short as the work allows — it is how long a dead holder blocks
 * everyone else.
 */
export async function acquireLock(
  plugin: string,
  key: string,
  ttlMs: number = LOCK_TTL_MS
): Promise<string | null> {
  const token = crypto.randomUUID();
  const acquired = await backend().acquireLock(
    pluginKey(plugin, "lock", key),
    token,
    ttlMs
  );
  return acquired ? token : null;
}

/**
 * Releases only if `token` still matches the current holder, in one atomic
 * backend operation — a read-then-delete could drop a lock that had already
 * expired and been re-taken by someone else.
 */
export async function releaseLock(
  plugin: string,
  key: string,
  token: string
): Promise<boolean> {
  return backend().releaseLock(pluginKey(plugin, "lock", key), token);
}
