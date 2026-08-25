# FedEx API behaviour

Findings behind `@dianemo/plugin-fedex`.

## Rate limit: 1,400 transactions per 10 seconds, per project

**Vendor documentation**, checked 2026-08-25:

> Each project has a transaction rate limit of 1,400 transactions in the span of
> 10 seconds. Throttling restrictions are applied if transactions exceed this
> limit during each 10-second timeframe.

The template declares exactly this — `interval: 10_000`, `tokensToAdd: 1400` — so
the figure is FedEx's own and not a smoothed or derived one.

### The quota is per project, and a client is not a project

This is the part a reader cannot see from the calibration. The budget is scoped to
the **FedEx project**, whereas a token bucket here is scoped to one registered set
of credentials. Two clients whose credentials belong to the same project each
meter to 1,400 per 10 s and overrun the project together at 2,800, while each one
looks individually compliant.

If several accounts here share a FedEx project, lower each client's budget with
the `rateLimitOverrides` argument to `addTemplateClient` so the sum stays under
1,400 — rather than editing the template, which would mis-state the vendor
figure for everyone.

`plugin-google-vertex-ai` and `plugin-google`'s Address Validation client have the
same shape of problem, recorded in their own docs.
