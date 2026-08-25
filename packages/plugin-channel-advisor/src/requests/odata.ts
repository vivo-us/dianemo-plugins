/**
 * OData has no backslash escape: a single quote inside a literal is written as
 * two. Anything else ends the literal early and lets the rest of the value parse
 * as expression — which is how `O'Brien` became `BuyerName eq 'O'Brien'`, a
 * filter that a value from anywhere untrusted could rewrite.
 */
export const escapeODataString = (value: string) => value.replace(/'/g, "''");

/**
 * An entity key inside a URL path, as in `Attributes('Brand Name')`: doubled
 * *and* percent-encoded, because a key in the path has the URL's own grammar to
 * survive as well as OData's. ChannelAdvisor attribute names, image placements
 * and labels are free text that routinely contains spaces, and a bare space or
 * `#` truncates the path. `encodeURIComponent` leaves the doubled quotes alone
 * and axios passes a string `url` through untouched, so nothing is encoded
 * twice.
 */
export const odataKey = (value: string) =>
  encodeURIComponent(escapeODataString(value));
