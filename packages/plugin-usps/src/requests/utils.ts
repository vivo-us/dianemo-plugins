export type UspsRateGroup = "default" | "labels";

/**
 * Names the sub-client carrying an endpoint's rate limit — see
 * docs/usps-api.md#rate-limits for why there are two.
 *
 * Each request appends its own segment rather than the caller doing it: which
 * group an endpoint belongs to is USPS's business, and appending the wrong one
 * would silently meter a label purchase against the 60/hour bucket.
 */
export const uspsSubClient = (clientName: string, group: UspsRateGroup) =>
  `${clientName}:${group}`;
