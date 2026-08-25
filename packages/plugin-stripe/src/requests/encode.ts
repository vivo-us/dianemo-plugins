/**
 * Stripe's v1 API takes no JSON on write paths, and nests form keys in bracket
 * notation (`metadata[order_id]`, `expand[0]`) which `URLSearchParams` will not
 * build. `null`/`undefined` are dropped rather than sent empty. See
 * docs/stripe-api.md#form-encoding
 */
export function stripeFormEncode(data: object): URLSearchParams {
  const out = new URLSearchParams();
  walk(out, data, "");
  return out;
}

function walk(out: URLSearchParams, value: unknown, prefix: string): void {
  if (value === null || value === undefined) return;

  if (Array.isArray(value)) {
    value.forEach((entry, idx) => {
      walk(out, entry, `${prefix}[${idx}]`);
    });
    return;
  }

  if (typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const key = prefix === "" ? k : `${prefix}[${k}]`;
      walk(out, v, key);
    }
    return;
  }

  out.append(prefix, String(value));
}
