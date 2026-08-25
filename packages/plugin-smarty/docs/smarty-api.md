# Smarty API behaviour

Findings behind `@dianemo/plugin-smarty`, whose two address-validation surfaces
share a single rate-limit budget.

## The rate-limit budget is shared across both surfaces

`plugin-smarty` registers one parent client holding the only token bucket, and
two sub-clients — `us` (`https://us-street.api.smarty.com`) and `intl`
(`https://international-street.api.smarty.com`) — each declaring
`{ type: "sharedLimit", clientName: parentName }` rather than a bucket of its
own.

**Verified, not assumed.** With the parent bucket lowered to 2 requests per
second, 6 calls interleaved across the two sub-clients dispatched at **2 per
second combined** — three seconds for six calls — not 2 per second each. The
sub-clients draw from the parent's bucket; they do not clone it.

That is the property the wiring exists for. Smarty bills per lookup against a
single subscription quota, so two independent buckets would spend that one quota
twice as fast while each surface looked individually compliant. The sub-clients
exist only so that retry, fleet-freeze and metrics are scoped per endpoint.

**The shared bucket is a billing argument, not a rate-limit one.** An earlier
version of this section said two buckets "would run the account at twice its plan
rate", which reads as though the two surfaces share one throughput ceiling. They
do not — see the figures below. What they share is the subscription's lookup
count, which is what the shared bucket protects.

## The published rate limits are per surface, and are enormous

**Vendor figures**, checked 2026-08-25:

| Surface               | Limit           |
| --------------------- | --------------- |
| US address validation | 25,000 / second |
| International         | 3,500 / second  |

**Production is configured at 1,000/s, which is this repo's own operational
ceiling** — not an attempt to approximate either vendor figure, and it should not
be read as one. It exists so a runaway loop cannot spend a paid lookup quota at
wire speed.

The margin is deliberate and asymmetric, because the bucket is shared and the two
surfaces are not equal:

| Against               | Headroom at 1,000/s |
| --------------------- | ------------------- |
| US, 25,000/s          | 25x                 |
| International 3,500/s | 3.5x                |

**3.5x is the number that governs**, because a shared bucket admits the worst
case: all 1,000/s landing on the international surface. That still clears 3,500,
which is why one bucket at this setting is safe for both.

Three consequences worth stating plainly:

- **Nothing here will be throttled by Smarty at this setting.** A 429 from either
  surface means the subscription's lookup quota is exhausted or the credentials
  are wrong, not that the rate ceiling was reached.
- **The shared bucket still costs nothing in throughput**, since 1,000 is under
  the international 3,500. Past 3,500 the sharing would start to matter in the
  other direction — US calls held to the international surface's ceiling for no
  reason — so a ceiling raised beyond that should split the buckets and meter each
  surface against its own figure. 1,000/s is deliberately below that threshold.
- **The blast radius scales with the ceiling.** Smarty bills per lookup, so this
  ceiling is what bounds a runaway loop's spend: 1,000/s is 3.6M lookups an hour
  where the previous 100/s was 360k. The rate limit is not a budget guard and was
  never sized as one — cost control belongs upstream of it.

Raised from 100/s to 1,000/s deliberately, on the reasoning above. Lower it per
client with the `rateLimitOverrides` argument to `addTemplateClient` if a
particular account should be paced harder, rather than editing the template.
