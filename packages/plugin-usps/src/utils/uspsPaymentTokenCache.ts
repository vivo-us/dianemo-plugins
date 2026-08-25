import { backend, pluginKey } from "@dianemo/plugin-kit";

/**
 * A token is only valid for the credentials it was minted under: rotating a
 * client secret, or correcting an account from EPS to PERMIT, produces a
 * different authorization. Without the fingerprint the rotation is invisible
 * here and the superseded token keeps being served for the rest of its TTL, even
 * after the client itself has been rebuilt.
 *
 * The fingerprint rides in the value rather than the key so that an entry stays
 * reachable by client and account alone — which is all a caller holding a token
 * USPS has just rejected knows about it.
 *
 * Keyed on the *account* client (`usps:_:main`), never one of its sub-clients:
 * USPS mints per account and credentials, so both sub-clients share one token.
 */
interface CachedPaymentToken {
  credsFingerprint: string;
  token: string;
}

// `pluginKey`, not a literal prefix: it folds in the handler's `keyPrefix`, and
// without that a staging and a production handler on one Redis read each other's
// cached tokens — /docs/core-behaviour.md#handlergetnamespace-is-the-only-public-read-of-keyprefix
const buildKey = (accountClientName: string, accountNumber: string): string =>
  pluginKey("usps", "paymentToken", accountClientName, accountNumber);

const parse = (raw: string): CachedPaymentToken | null => {
  try {
    return JSON.parse(raw) as CachedPaymentToken;
  } catch {
    return null;
  }
};

export const getCachedPaymentToken = async (
  accountClientName: string,
  accountNumber: string,
  credsFingerprint: string
): Promise<string | null> => {
  const raw = await backend().get(buildKey(accountClientName, accountNumber));
  if (!raw) return null;
  // A mismatch means the credentials rotated; an unreadable value means the
  // entry predates this layout. Either way there is nothing here to reuse.
  const cached = parse(raw);
  if (cached?.credsFingerprint !== credsFingerprint) return null;
  return cached.token;
};

export const setCachedPaymentToken = async (
  accountClientName: string,
  accountNumber: string,
  credsFingerprint: string,
  token: string,
  ttlSeconds: number
): Promise<void> => {
  const value: CachedPaymentToken = { credsFingerprint, token };
  await backend().set(
    buildKey(accountClientName, accountNumber),
    JSON.stringify(value),
    ttlSeconds
  );
};

/**
 * Drops the cached token so the next label request mints a fresh one.
 *
 * Nothing else evicts a token USPS has stopped accepting; the seven-hour TTL is
 * the only other way out, and every label request until then fails against a
 * token that is never going to work again. Call this when USPS rejects
 * `X-Payment-Authorization-Token`, then retry —
 * docs/usps-api.md#payment-token-ttl.
 *
 * Takes the account client name — the same one passed to `createLabel`, with no
 * sub-client segment appended.
 */
export const clearCachedPaymentToken = async (
  accountClientName: string,
  accountNumber: string
): Promise<void> => {
  await backend().del(buildKey(accountClientName, accountNumber));
};
