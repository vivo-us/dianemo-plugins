# Mainfreight API

Findings behind `@dianemo/plugin-mainfreight`. Everything quoted here was checked
against Mainfreight's published developer documentation on **2026-08-25**.

## Regions

Every endpoint in this package — warehousing and tracking alike — carries
`region` in the query string, and Mainfreight fails the request outright when it
is missing. There are six codes and these are all of them. Mainfreight publishes
the country-to-region table:

| Warehouse country                | Region |
| -------------------------------- | ------ |
| New Zealand                      | `NZ`   |
| Australia                        | `AU`   |
| United States of America, Canada | `US`   |
| Netherlands, Belgium             | `EU`   |
| United Kingdom                   | `UK`   |
| Hong Kong, Japan, China          | `AS`   |

Source:
<https://developer.mainfreight.com/global/en/developer/warehousing-api-updates-required.aspx>
Checked 2026-08-25.

Two of the names are narrower than they sound: `EU` covers the Netherlands and
Belgium only, and `AS` covers Hong Kong, Japan and China only. A warehouse in,
say, Germany or Singapore is not addressable by any of these codes.

### Canada has no code of its own

Canada is grouped with the USA under `US`, so `MainfreightRegion.UNITED_STATES`
is what a Canadian site passes. Before 1.0.0 the enum carried a second member for
it:

```ts
UNITED_STATES = "US",
CANADA = "US", // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
```

The wire value was right; the API surface was promising a distinction Mainfreight
does not make. Two members with one value are indistinguishable at runtime _and_
in the type system, so `MainfreightRegion.CANADA === MainfreightRegion.UNITED_STATES`
is `true`, a `switch` over the enum silently makes one of the two branches dead
code, and a `Record<MainfreightRegion, T>` collapses the two into a single entry —
whichever key was written second wins. The lint suppression was the tell.

`resolveRegion` in `src/requests/utils.ts` names `UNITED_STATES` in its error
metadata for exactly this reason: a caller who reaches for a Canadian code has to
be told where Canada went, and the type no longer says it.

## Reference types by service type

`MainfreightReferenceType` is a flat union of every reference type the tracking
endpoint accepts. Mainfreight constrains which ones are valid for each service
type, and that relationship is deliberately not modelled — an invalid pairing is
caught by the API rather than the compiler.

| Service type                                      | Valid reference types                                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `TransportNZ`, `TransportAU`                      | `ContainerNumber`, `ContainerJobNumber`, `ConsignmentNumber`                                           |
| `TransportUS`                                     | `HousebillNumber`                                                                                      |
| `TransportEU`                                     | `BarcodeNumber`, `CustomerReference`, `ShipmentNumber`                                                 |
| `WarehousingAU`, `WarehousingNZ`, `WarehousingUS` | `InboundReference`, `OutboundReference`, `Reference`                                                   |
| `WarehousingEU`                                   | `InboundReference`, `OutboundReference`                                                                |
| `ContainersNZ`, `ContainersAU`                    | `CustomerReference`, `ContainerJobNumber`, `ContainerNumber`                                           |
| `AirAndOcean`                                     | `ContainerNumber`, `HousebillNumber`, `JobNumber`, `MasterbillNumber`, `OrderNumber`, `OrderReference` |

`WarehousingUK` appears in `MainfreightServiceType` but not in the published
reference-type table, so which reference types it accepts is unknown. The
warehousing request functions pass `InboundReference` / `OutboundReference`, which
is what the other warehousing service types take.

## `DELETE` has been reported to 500

`deleteOutboundOrder` calls `DELETE /Warehousing/1.1/Customers/Order/{orderId}`.

**Source strength: hearsay carried in a code comment.** The repo has carried the
claim "Mainfreight has returned 500s for this endpoint in some configurations"
since the code was written, with no ticket, no captured response and no account
named. Nothing here corroborates it and nothing here refutes it.

What is not established:

- whether the 500 is a permission failure surfacing as a 500, a state failure
  (an order already picked or despatched cannot be withdrawn), or neither
- whether it depends on the region, the customer code, or the order type
- whether Mainfreight considers it a bug

What would settle it: one `DELETE` against a real account for an order in a
known state, with the response body kept. A 500 carrying a message names the
real cause; a 200 retires this section.

Until then callers should treat a failed delete as possible rather than
exceptional, and not assume the order is gone because the call was made.

## Rate limit: unpublished, and 100/min is this repo's own ceiling

**Negative result, confirmed 2026-08-25: Mainfreight states no rate limit.**

The template declares `100 / 60 s`. That figure is **not Mainfreight's** — it is
this repository's politeness ceiling, chosen as a round number and never verified
against them. Nothing on Mainfreight's side corroborates it, and nothing
contradicts it either.

What this means in practice:

- A 429 from Mainfreight would be new information. Nothing here has observed one,
  which is weak evidence — the accounts this has run against may simply never have
  pushed it.
- The number should not be read as a measurement. If you need more throughput,
  the honest move is to ask Mainfreight and then set it per client with the
  `rateLimitOverrides` argument to `addTemplateClient`, rather than editing the
  template and making an unverified figure look agreed.

Recorded in the repo's countable list at
[`open-questions.md`](../../../docs/open-questions.md#unsourced-calibrations).
