# Amazon SP-API

Findings behind the client structure and the query serialisation in
`@dianemo/plugin-amazon-spapi`. The endpoint figures are Amazon's published usage
plans, transcribed into `spapiEndpoints` in `src/utils/amazonSpapiData.ts`;
<https://developer-docs.amazon.com/sp-api/docs/usage-plans-and-rate-limits>,
checked **2026-08-25**.

## Rate limits are per operation, so there is one client per endpoint

Amazon meters SP-API per _operation_, not per application or per selling partner,
and it publishes a rate and a burst for each one. `spapiEndpoints` carries all 176
of them, and the spread is the argument for the structure:

- **13 distinct rates**, from `0.0083` requests/second (`feedsCreateFeed` — one
  call every two minutes) to `20` (`serviceGetAppointmentSlots`). That is a factor
  of about 2,400 between the slowest and the fastest.
- **27 distinct rate/burst pairs** across those 176 operations. Bursts run from 1
  to 40.

One bucket for the account would therefore be wrong in both directions at once: at
the floor it would throttle `serviceGetAppointmentSlots` by 2,400×, and at
anything above the floor it would overdraw `feedsCreateFeed` and collect 429s. So
`buildEndpointClient` in `src/client.ts` emits a leaf per endpoint per region,
each carrying its own endpoint's published pair.

The published figures are a default. Amazon returns the account's real limit in
`x-amzn-ratelimit-limit`, and `rateLimitChange` in `src/client.ts` replaces
`tokensToAdd` with it when the two disagree, so a transcription error or an
account-specific plan self-corrects after one response on that endpoint.

## List-valued query parameters are comma-separated, not repeated keys

SP-API models every list-valued query parameter — `marketplaceIds`,
`includedData`, `reportTypes`, the order status filters — as **one
comma-separated value**. `sortQueryData` in `src/requests/handleSpapiRequest.ts`
joins with `,` for that reason.

Repeating the key, which is the other common convention and what this package did
before, is not rejected: Amazon reads only the **last** occurrence and answers
normally. A two-marketplace `getOrders` query returned one marketplace's orders,
with nothing in the response to say the other had been dropped.

## Restricted data (PII)

A restricted operation withholds PII unless the call carries a restricted data
token in `x-amz-access-token` instead of the LWA token, and core merges the
client's own auth header _after_ `requestInterceptor` runs — so the leaf that
sends an RDT cannot be a leaf that authenticates. See
[`core-behaviour.md`](../../../docs/core-behaviour.md#the-auth-header-is-merged-after-requestinterceptor)
for the mechanism and for why `authentication: undefined` on the `:pii` sub-client
is what makes the RDT reachable.

The failure mode is the reason it is worth the structure: with an LWA token on a
restricted operation, Amazon answers `200` with the unrestricted view of the data
and nothing in the response says PII was withheld. There is no error to notice.

An RDT is scoped to one method, path and element list, so it is minted per request
rather than cached, through the account client's `tokensCreateRestrictedDataToken`
leaf (1 rps, burst 10). Amazon meters the _operation_, not the token, so a
restricted call spends the same quota as an unrestricted one — which is why the
`:pii` leaf takes a `sharedLimit` on its sibling rather than opening a second
bucket.
