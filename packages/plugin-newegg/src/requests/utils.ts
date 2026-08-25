/**
 * Names the sub-client carrying an endpoint's rate limit.
 *
 * Newegg meters each endpoint separately, so the template registers one
 * sub-client per endpoint beneath the account's client. Callers pass the
 * account name from `buildClientName("newegg" | "neweggBusiness", creds)` —
 * which marketplace an account belongs to is already encoded there — and each
 * request appends the endpoint segment itself.
 */
export const neweggSubClient = (clientName: string, endpoint: string) =>
  `${clientName}:${endpoint}`;

/**
 * The *value* of `IsSuccess` varies by endpoint — the feed endpoints send a JSON
 * boolean, Order Confirmation sends the string `"true"` — which is why this is a
 * helper and not a comparison. An absent flag reads as a failure: a noisy false
 * alarm is recoverable, a silently dropped feed is not.
 *
 * Published samples: docs/newegg-api.md#issuccess-the-casing-and-the-value-type
 */
export const neweggSucceeded = (body: { IsSuccess?: boolean | string }) => {
  if (typeof body.IsSuccess === "boolean") return body.IsSuccess;
  if (typeof body.IsSuccess === "string")
    return body.IsSuccess.toLowerCase() === "true";
  return false;
};
