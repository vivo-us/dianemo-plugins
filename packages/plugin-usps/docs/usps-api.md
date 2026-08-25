# USPS APIs (v3)

Findings behind `@dianemo/plugin-usps`. Everything cited here is USPS's own
developer portal, checked 2026-08-25.

## Rate limits

USPS **meters per API**, not per account and not per credential. That single fact
is why the client is split, and everything below is the evidence for how each
bucket was set.

### What USPS publishes

One quota, and it is small. `https://devs.usps.com/getting-started`, checked
**2026-08-25**, states verbatim:

> The default product includes OAuth, Addresses, Domestic Pricing, International
> Pricing, Locations, Service Standards, Service Standards Files, Shipping
> Options, and UserInfo, each with a quota of 60 calls per hour.

"each with a quota" — the 60/hour is **per API**, not shared across the nine. The
same page on raising it: _"To get started with APIs not included in the default or
to request a quota increase, please complete the Registration for API Access
form."_

And on Labels, from the same page — the reason Labels cannot inherit the figure
above: _"If you want to use the Labels APIs, it requires additional approval and
configuration. The Labels APIs require you to be enrolled in USPS Ship for both
outbound and return labels and have an Enterprise Payment Account."_

**This is USPS's own published default, not a third-party report.** Worth stating
plainly because the v1.0.0 validation report recorded the 60/hour as a
third-party figure and flagged it unverified; that was wrong, and it is the
reason a 600× discrepancy sat unresolved.

**The two devportal hosts disagree, and only one carries the number.**
`https://developers.usps.com/getting-started` does **not** contain the "quota of
60 calls per hour" sentence; `https://devs.usps.com/getting-started` does. Same
devportal, two hosts, two revisions. Anyone re-checking this on the
`developers.` host will conclude the number is unsourced — which is how a 10/s
label bucket came to look defensible.

The two hosts also disagree about **Tracking**: the `developers.` revision lists
Tracking in the default product, the `devs.` revision (the one with the number)
does not. `developers.usps.com/faq` also lists it. Tracking is therefore metered
here with the documented 60/hour group, on the strength of two of the three lists
— the conservative reading.

### What USPS does not publish — the negative results

Absences that were looked for and not found, each checked **2026-08-25**.
Recorded because "no quota is published" has to be falsifiable, and so the next
person to go looking does not repeat the search:

- **`https://developers.usps.com/faq`** — acknowledges a quota, publishes no
  number. The only rate-limit text on the page: _"If you have exceeded the quota
  limit of API calls per hour, please submit a service request on the Email Us
  page and a representative will assist."_
- **`https://developers.usps.com/terms-and-conditions`** — defers to the per-API
  description pages rather than stating limits: _"The Services have a limit on
  the number of requests that You may make in a given day. Such limits are
  dependent on the type of API used or the type of data requested. Such limits
  may be reviewed on the description pages associated with the APIs and data
  types."_ Followed by: _"The USPS reserves the right to modify, alter, or change
  these limits without notice for any given API."_
- **`https://developers.usps.com/paymentsv3`** (Payments 3.0) — no quota, and no
  payment-authorization token lifetime either.
- **`https://developers.usps.com/domesticlabelsv3`** (Domestic Labels 3.0) — no
  quota, no token lifetime.
- **`https://www.usps.com/business/web-tools-apis/onboarding-guide.pdf`** — no
  rate limit anywhere in it, and no payment-token lifetime.

So for Labels and Payments there is no figure to cite, and none is invented. Both
sit **outside the default product** — USPS Ship enrolment and an Enterprise
Payment Account, per the quote above — which is also why the documented 60/hour
cannot simply be stretched to cover them.

### Third-party figures — _not_ used for calibration

Recorded as context only. Neither of these set a number in the code, and neither
is a USPS statement:

- **`https://www.smarty.com/blog/usps-api-rate-limit`** — reports that USPS's
  initial documentation limited address verification to 60/hour, then reports
  _practical_ limits of roughly **20,000/day for Addresses** and **500,000/day
  for Pricing, Locations, Service Standards and Tracking**. Smarty attributes
  those to unnamed "sources familiar with how the rollout has functioned in
  practice" and to "USPS support conversations and follow-up testing at Smarty" —
  no official USPS publication. Kept here as evidence that a quota increase is a
  normal thing to be granted, not as a basis for a number.
- **~6,000 calls/minute absorbed by the retired Web Tools XML API.** Also
  third-party, and a different, discontinued API. It is the only
  order-of-magnitude anchor available for label throughput and it is a weak one;
  it appears in the `:labels` comment as a ceiling, not as a source.

The original flag was arithmetic: 10/s is 36,000/hour, roughly **600×** the
published 60/hour default. That ratio is what made a single shared bucket
indefensible — one of the two numbers had to be wrong for every endpoint it
covered.

### Why the client is split

Because USPS meters per API and publishes a quota for only one group of them,
**one budget per client cannot serve both groups honestly.** Setting it to 60/hour
would throttle label purchases to something no shipper can use; setting it to 10/s
would spend a documented hourly quota in six seconds. Neither number is wrong —
they belong to different meters.

So the account's client carries no budget of its own and registers two metered
sub-clients beneath it, mirroring how USPS actually meters:

| client                | paced at               | covers                                                                                                    |
| --------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------- |
| `usps:_:main`         | unmetered, no requests | owns the OAuth token both sub-clients draw on. A budget here would be a third bucket nothing spends from. |
| `usps:_:main:default` | 60/hour, one at a time | the documented default product, plus Tracking and Pickups                                                 |
| `usps:_:main:labels`  | 10/s                   | Labels and Payments — no published quota                                                                  |

Each sub-client carries its own calibration comment, because they are now
separate clients with separate quotas and only one of them has a citation.

**The `:default` arithmetic.** 3,600,000 ms ÷ 60 calls = one token every 60,000
ms, with `maxTokens: 1`. Paced one call at a time rather than allowed a burst of
60, so a cold replica cannot spend the whole hour in a second.

**Pickups is metered here too**, and it is _not_ in the published default product
— USPS publishes no quota for it either. It sits with the documented 60/hour
rather than with the label throughput because scheduling a pickup is a handful of
calls a day: the conservative bucket is the cheap mistake to make.

**The `:labels` 10/s is not derived from anything USPS published.** It is the
value this package has always paced label traffic at — enough for a shipper
buying labels in bulk, and comfortably under the retired Web Tools figure noted
above. It is a working default, and the code says so at the site rather than
implying a source it does not have. An account approved for labels has a quota
USPS will tell you and publishes nowhere.

**Confirm yours, then override rather than editing the number.**
`addTemplateClient` takes a `rateLimitOverrides` argument keyed by sub-client
name, so `{ labels: … }` retargets this bucket without forking the plugin. See the
package README for the call.

Request functions append their own sub-client segment (`requests/utils.ts`), so
callers keep passing the account name and never write `:labels` themselves —
which group an endpoint belongs to is USPS's business, not the caller's.

## Payment-token TTL

The cache holds a payment-authorization token for **7 hours**, described in code
as a margin under an 8-hour maximum. **That 8-hour figure is unsourced.** Checked
2026-08-25:

- **Payments 3.0** (`https://developers.usps.com/paymentsv3`) publishes no token
  lifetime.
- **Domestic Labels 3.0** (`https://developers.usps.com/domesticlabelsv3`)
  publishes none.
- The **onboarding PDF** has none.
- The only place the 8-hour figure was found at all is a third-party article.

The `7 * 60 * 60` predates this repository's validation pass and its comment read
as sourced; it is not. **Confirm the real lifetime against your own account before
trusting the margin.** If the true lifetime is 8 hours or longer, 7 is safe. If it
is shorter, the failure mode is every label request failing against a token that
will never work again — which is what `clearCachedPaymentToken` exists for, since
the TTL is otherwise the only eviction path and nothing detects a token USPS has
stopped accepting.

## `manifestMid`

`UspsCredentials.manifestMid` is optional and, when absent, **the field is omitted
from both the `PAYER` and `LABEL_OWNER` roles entirely** — USPS then applies
whatever the account defaults to.

This is a doc-vs-code resolution, recorded because the two disagreed: the JSDoc
claimed `manifestMid` "falls back to MID when absent", while the code omitted the
field. **The code won.** Repeating the MID as the manifest MID is a guess about
the account's setup that USPS is better placed to make, and a wrong manifest MID
is a mis-manifested label rather than an error. The JSDoc was corrected to match.
