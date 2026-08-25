# Open questions

Everything still unresolved after the v1.0.0 validation work, with what would
actually settle each. Ordered by consequence, not by effort.

Nothing here blocks publishing. Each item is either already handled defensively in
code or is a calibration that is conservative rather than wrong — and each says so
at the point a reader would meet it. This file exists so the list is countable
rather than scattered.

**Corrections to the v1.0.0 validation report are at the bottom.** Three of its
claims turned out to be wrong. The report itself is not tracked in this repo —
these are the corrections, so they survive it.

---

## Needs a real account

### UNIS token TTL — settled in part, 2026-08-25

**The response reports no lifetime. Settled.** A live `POST /user/login` against
the production account returned only `success`, `oAuthToken`, `idmUserId` and
`userView` — no `expires_in`, no `expiresIn`. Source: **observed response**, one
account, one date.

That answers the question this entry used to ask, and it answers it the unhelpful
way. The token is a **UUID, not a JWT**, so there is no `exp` claim either: both
branches ahead of `FALLBACK_TOKEN_LIFETIME_SECONDS` are dead for a real token,
and the fallback is not a last resort but the mechanism.

**What was done about it.** The fallback was cut from 10,800 seconds to **3,600**
— a chosen ceiling, not a UNIS figure. The failure is asymmetric: over-reporting
a lifetime is an outage, under-reporting one costs an extra login. One hour sits
far enough inside any plausible real TTL that the outage case stops being
reachable. [The UNIS doc](../packages/plugin-unis/docs/unis-api.md#token-lifetime)
carries the evidence.

**What remains open: UNIS's real TTL**, which nothing cheap can now reveal.
**Settled by:** an empirical test — mint one token, poll a cheap endpoint on an
interval, record where the first 401 lands relative to 3,600 seconds. Worth doing
only if the extra logins become a problem, or if a 401 is ever seen in
production. Until then the short ceiling makes the answer not matter, which is
why this sits here rather than in the section above.

### UNIS production base URL — settled, 2026-08-25

**Resolved: the two URLs are two environments, not a discrepancy.** A live call
against `https://wise.logisticsteam.com/v2/shared/bam/v1/public` authenticated
and reached UNIS's business-logic layer, so the production URL
`packages/plugin-unis/README.md` states is correct and is no longer "sourced by
nothing". Source: **observed response**, plus corroboration from this
organisation's own credential store, which holds that URL as `UNIS_BASE_URL` and
`https://preview.logisticsteam.com/shared/bam/v1/public` as
`UNIS_SANDBOX_BASE_URL`.

UNIS's reference examples use the `preview` subdomain because they are written
against sandbox — which is exactly what the README already documents as the
sandbox URL. Nothing to change.

### Wayfair `lessThanOrEqualTo`

The `toDate` upper bound on `purchaseOrders` rests on a **third party's schema
introspection**, not Wayfair's own words. The lower bound
(`greaterThanOrEqualTo` on `poDate`) is corroborated by Wayfair's own published
client; the upper bound is not.

If it is wrong the query now fails loudly with Wayfair's own GraphQL error rather
than silently returning an unbounded page, which is why this is a question and not
a defect.

**Settled by:** one introspection against `api.wayfair.com/v1/graphql` with
supplier credentials. See [the Wayfair doc](../packages/plugin-wayfair/docs/wayfair-api.md).

### USPS `:labels` throughput

The `:default` sub-client is calibrated to USPS's published 60/hour. The `:labels`
sub-client keeps the 10/s this package has always used, because **USPS publishes
no quota for Labels or Payments** — they sit outside the default product and need
USPS Ship enrolment plus an Enterprise Payment Account.

**Settled by:** checking the quota on a real enrolled account, then setting it per
client via `rateLimitOverrides` rather than editing the template. See
[the USPS doc](../packages/plugin-usps/docs/usps-api.md).

### Extensiv — three wire details

All three are the defensible reading rather than a confirmed one, and all three
are documented as such in [the Extensiv doc](../packages/plugin-extensiv/docs/extensiv-api.md):

- Whether characters other than `.` need the `~d~` path escape (a literal `~` in a
  file name would be ambiguous).
- Whether the update-item response really carries `ResourceList` — inferred from
  the `Accept: application/json` header and the package's own convention.
- Whether the cancel/delete endpoints accept `If-Match: *`.

**Settled by:** one call each.

---

## Needs a change in `@dianemo/core`

### A 403 cannot freeze the fleet

Core arms a fleet-wide freeze only for 429, 5xx and connection resets, and
documents both retry escape hatches as explicitly non-freezing. A vendor that
signals rate limiting with a 403 therefore cannot get a fleet-wide freeze from
plugin code: every replica keeps its own counsel.

No plugin in the catalogue currently signals this way, so nothing hits it today.
Kept because the limitation is a property of core, and it returns the moment such
a vendor is added.

This is not fixable from a plugin. See
[`core-behaviour.md`](core-behaviour.md#only-429-5xx-and-connection-resets-freeze-the-fleet).

---

## Unsourced calibrations

Each of these is this repo's own ceiling rather than a vendor figure, and each
says so in its own comment. Listed together so the set is countable.

Two are deliberately **not** in the table, because a guard chosen under a figure
the vendor _does_ publish is a different thing from a stand-in for one it
withholds: `plugin-open-exchange-rates`'s 60/min sits well under a published
1,000/month, and `plugin-smarty`'s 1,000/s sits 3.5x under the tighter of two
published per-surface limits — 25,000/s (US) and 3,500/s (international) — which
is the margin that governs, because the bucket is shared and could send all of it
to the international surface.

| Package                 | Value         | Status                                                                                                                                            |
| ----------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `plugin-extensiv`       | 20 / s        | Extensiv publishes nothing. The most permissive guess in the catalogue at 1,200/min, so the likeliest to be wrong in the dangerous direction      |
| `plugin-mainfreight`    | 100 / 60 s    | Mainfreight publishes nothing; a round number, never verified against them                                                                        |
| `plugin-newegg`         | three buckets | Newegg documents per-minute and hourly _mechanisms_ but publishes no figures; the real limit is readable from `X-RateLimit-Limit` on any response |
| `plugin-wayfair`        | 60 / 60 s     | Wayfair publishes nothing; not in their portal, and their own supplier client paces nothing                                                       |
| `plugin-usps` `:labels` | 10 / s        | See above                                                                                                                                         |
| `plugin-walmart`        | two endpoints | `GET /v3/returns` and `POST /v3/feeds?feedType=MP_INVENTORY` are absent from Walmart's published table; assumed to fit under the 60/min floor     |
| `plugin-ups`            | 5 / s         | UPS publishes no rate limit for its REST APIs; a placeholder to calibrate against your own 429s                                                   |
| `plugin-google` parent  | 600 / 60 s    | Google publishes no QPM for the OIDC userinfo endpoint; a self-imposed backstop                                                                   |

One inference worth keeping visible: **Google Address Validation's 6,000 QPM is
documented per _method group_, but what it is scoped to — project, API key, or
billing account — is not.** This plugin buckets per registered account, so if the
real scope is the project, two accounts on one project each meter to 6,000 and
overrun together. Marked as inferred in
[the Google doc](../packages/plugin-google/docs/google-api.md) rather than carried as
fact.

---

## Known limitations, not questions

Recorded because each looks like a bug from the outside.

- **`plugin-stripe` is accounts, not Connect.** Nothing sends `Stripe-Account`, so
  a call always acts as the account owning the `apiKey`. `instanceId` is a
  free-form alias, not an `acct_…` id, so synthesising the header from it would be
  wrong. Register each account's own key.
- **`plugin-helpscout` embedded threads are truncated by Help Scout**, not
  paginated, and say nothing about what was dropped. `getConversationThreads`
  exists for the complete list.
- **UNIS Basic Auth would remove the TTL question entirely** and is documented and
  natively supported by core — but it puts the account password on every request
  rather than once per refresh. The token flow is the more secure of the two, so
  the more secure design is the one carrying the uncertainty. See
  [the UNIS doc](../packages/plugin-unis/docs/unis-api.md).
- **`MaxListenersExceededWarning`** in the test suite: SIGTERM/SIGINT listeners
  exceeding Node's default of 10. Pre-existing, harmless, and the kind of noise
  that masks something real later.

---

## Corrections to the v1.0.0 validation report

The report that drove this work is not tracked here, so its errors are recorded
rather than edited. Three of its claims did not survive being checked:

1. **USPS's 60/hour is not a third-party report.** The report calls it
   "third-party reports of USPS's 60/hour v3 default" and flags it as unverified.
   It is USPS's own published figure, on `devs.usps.com/getting-started`. Note
   `developers.usps.com/getting-started` no longer carries the sentence while
   `devs.usps.com` does — same devportal, different host.
2. **Newegg's `isSuccess` casing is settled, not open.** The report says "confirm
   casing against Newegg's docs". Newegg's published JSON samples show
   `IsSuccess`. The _value_ genuinely varies by endpoint — a JSON boolean for
   feeds, the string `"true"` for Order Confirmation — which is what
   `neweggSucceeded()` normalises.
3. **UNIS's `Bearer` prefix is settled, not open.** The report lists "whether it
   wants a bare or `Bearer`-prefixed header" as needing a curl. UNIS's own
   Authentication page shows the request headers: `Authorization` carries a bare
   UUID with no prefix. `excludePrefix: true` is correct.

Two findings the report missed, both found by the checks added since:

- **`axios` was a runtime dependency of `plugin-amazon-spapi`** but every import
  of it is type-only and elided at build. **`@types/luxon` was a runtime
  dependency of `plugin-channel-advisor`** — a types-only package can never be
  one. Same family as the `ioredis` phantom peer the report did flag. See
  docs/dependency-hygiene.md.
- **`NeweggFeedResponse.RequestID` should be `RequestId`.** Newegg spells the key
  differently by direction — the request body takes `RequestIDList.RequestID`, the
  response returns `RequestId` — so `getFeedStatus(...).RequestID` was `undefined`
  for every caller.

---

## A per-IP quota no per-client budget can see

UNIS states two limits: **100 calls/minute per user** and **1,000 calls/minute per
IP** (supplied by UNIS, 2026-08-25). `plugin-unis` meters the per-user figure,
which is what a client corresponds to.

The per-IP figure is not expressible from a plugin. A budget is scoped to one set
of credentials, so ten UNIS clients on a single host each meter to 100/min and
together sit exactly on the 1,000/min IP ceiling while every one of them looks
compliant; eleven overrun it. A host running more than ten UNIS accounts has to
lower each client's budget with `rateLimitOverrides` so the sum stays under 1,000.

This is the same shape as FedEx's per-project quota and Google Address
Validation's possibly-per-project one: the vendor meters something wider than a
client, and nothing inside a client can observe the aggregate. See
[`packages/plugin-unis/docs/unis-api.md`](../packages/plugin-unis/docs/unis-api.md#rate-limit).
