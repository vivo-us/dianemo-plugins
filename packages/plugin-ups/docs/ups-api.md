# UPS REST API

Findings that took reading UPS's OpenAPI specs to establish. UPS publishes those
specs in a public repository — `github.com/UPS-API/api-documentation` — and it is
the only authoritative source for most of what follows: the developer portal's
prose pages disagree with the specs in places, and the specs are what the gateway
enforces.

Every citation below was checked on **2026-08-25**. UPS versions its REST APIs by
release date, so the version pins in particular go stale on UPS's schedule rather
than ours.

## No published rate limit

**UPS publishes no rate limit for its REST APIs.** Not a number, not a header, not
a tier table. What is known:

- Every operation in UPS's OpenAPI specs declares a `429 Rate Limit Exceeded`
  response, so a throttle exists and is enforced.
- UPS returns **no rate-limit headers** alongside the 429 — nothing to infer a
  budget or a reset window from.
- The question was asked on UPS's own documentation repository on **2023-08-31**
  and is still open and unanswered:
  <https://github.com/UPS-API/api-documentation/issues/8>
- The limit is reportedly assigned **per integration** and varies by tier (CIE,
  standard production, high-volume), so there is no single correct figure to look
  up even in principle.

`src/client.ts` therefore paces at **5 requests per second**, and that figure is
**unsourced** — it is a conservative placeholder chosen only to sit well under the
throttles integrators report hitting. The 30/s it replaced was invented in exactly
the same way, but in the unsafe direction.

**Calibrate against 429s on your own account.** That is the only real evidence
obtainable, and it needs credentials this repository does not have. Until then,
treat the number in the code as a guess that is labelled as one.

## The `transId` header

UPS documents `transId` as "An identifier unique to the request". Whether it is
_required_ depends on which API you are calling:

| API                | `transId`                                |
| ------------------ | ---------------------------------------- |
| Track              | `required: true` on all three operations |
| Shipping           | `required: false`                        |
| Pickup             | `required: false`                        |
| Address Validation | `required: false`                        |

Nothing in this plugin supplied it at all before, so tracking was calling a
required header short.

It is now set at the client, in `requestOptions.requestInterceptor`, rather than
in the one request function that strictly needs it: everywhere else it is the id
UPS support searches their logs by (alongside `transactionSrc`), and sending it
costs nothing.

**Shipping documents the length cap as 32.** dianemo's `requestId` is a
36-character UUID, so the hyphens are stripped before it goes on the wire — still
unique, and still the id in dianemo's own logs.

- <https://github.com/UPS-API/api-documentation/blob/main/Tracking.yaml>
- <https://github.com/UPS-API/api-documentation/blob/main/Shipping.yaml>

## `transactionSrc`

`transactionSrc` is free text naming the _application_ making the request. UPS
support searches their logs by it. It is not a per-merchant value, so it is set
once on the client from `UpsCredentials.transactionSrc` and defaults to naming
this plugin. Set it to your own application's name so your traffic is
distinguishable from anyone else's running the same package.

## `x-merchant-id`

On the OAuth token request, UPS documents this header as, verbatim, a **"6-digit
UPS account number"**, and marks it `required: false`.

`clientId` used to be sent here, which put a **32-character OAuth client key** in
a header documented as a 6-digit account number. Because the header is optional,
omitting it when no account number has been registered is strictly better than
filling it with something else — so `UpsCredentials.merchantId` is optional, and
absent means the header is not sent rather than sent wrong.

<https://github.com/UPS-API/api-documentation/blob/main/OAuthClientCredentials.yaml>

## Version pins

UPS versions its REST APIs by release date. The old version keeps answering until
UPS retires it, which is why a stale pin is silent rather than fatal — and why
these want revisiting whenever a newer dated version ships.

| API                | pinned  | was     | why                                                                                                                                                                                                                     |
| ------------------ | ------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pickup             | `v2409` | `v2403` | Every current Pickup operation — rate, cancel and creation — lists `v2409` as its only valid value and its default. `v2403` is not among them.                                                                          |
| Shipping           | `v2409` | `v1`    | Both operations list `v2409` as their default, and Ship lists it as its only valid value. Void additionally accepts `v3`, but only for Roadie shipments. The `v1` path is a separate path UPS marks `deprecated: true`. |
| Address Validation | `v2`    | `v1`    | Unlike the rest of UPS's catalogue this API is _not_ versioned by release date: `v2` is its only valid value and also its default. The `v1` path is separate and UPS marks it `deprecated: true`.                       |

- <https://github.com/UPS-API/api-documentation/blob/main/Pickup.yaml>
- <https://github.com/UPS-API/api-documentation/blob/main/Shipping.yaml>
- <https://github.com/UPS-API/api-documentation/blob/main/AddressValidation.yaml>

## Address Validation query parameters

**UPS ignores a query parameter it does not recognise.** It does not 400. So the
request succeeded while silently doing neither of the two things it was asked to
do:

| sent                        | correct                    | problem                                                  |
| --------------------------- | -------------------------- | -------------------------------------------------------- |
| `maximumcandidatelimitsize` | `maximumcandidatelistsize` | not a UPS parameter at all — `limit` for `list`          |
| `regionalrequestIndicator`  | `regionalrequestindicator` | camelCased; UPS's parameter names here are all lowercase |

Two other constants in the same URL are deliberate rather than default:

- The request-option path segment is **`3`**, which asks for validation _and_
  classification in one call — the candidate list plus whether the address is
  residential or commercial. `1` is validation only, `2` classification only.
- `maximumcandidatelistsize` is **10**. UPS documents "Valid values: 0 - 50 ... If
  not provided, the default size of 15 is returned", so 10 is a narrowing we
  chose, not the API's default.

### `regionalrequestindicator` cannot be combined with classification

**Removed 2026-08-25.** Correcting the spelling above is what made this parameter
reach UPS for the first time, and UPS rejects it outright whenever the request
option asks for classification:

```
400  Address classification is not valid for a regional request.
```

The misspelling had been masking a conflict, not merely wasting a parameter. The
pre-1.0.0 implementation sent `regionalrequestIndicator` (camelCased) against
`v1/3` for years and never had a regional request honoured — which is why it
worked.

Established by trying nine URL variants against the live API. The
discriminating rows:

| URL                                                              | Result               |
| ---------------------------------------------------------------- | -------------------- |
| `v2/3?regionalrequestindicator=true&maximumcandidatelistsize=10` | **400**              |
| `v2/3?regionalrequestindicator=true`                             | **400**              |
| `v2/3?maximumcandidatelistsize=10`                               | 200, real candidates |
| `v2/3`                                                           | 200                  |
| `v2/1?regionalrequestindicator=true&maximumcandidatelistsize=10` | 200                  |
| `v1/3` with the old misspelled names                             | 200                  |

The fifth row isolates it: the parameter is fine on option `1`, so the conflict
is with **classification**, not with the parameter itself or with the API
version. Both `v1` and `v2` answer, so the version pin is not implicated either.

**Source: observed responses, 2026-08-25.** UPS's published
`AddressValidation.yaml` states no such constraint — this is enforced at the
gateway and documented nowhere, so it is exactly the kind of finding that
disappears if it is not written down here.

<https://github.com/UPS-API/api-documentation/blob/main/AddressValidation.yaml>

## Pickup path segments

Three Pickup operations share a `/pickup/{…}` shape and the final segment means
something different in each. Conflating them is the bug this section exists to
prevent.

**Cancel** — the segment is `CancelBy`, whose documented values are `01` =
AccountNumber and `02` = PRN. The `Prn` header is documented "Required if CancelBy
= prn". `cancelPickup` sends a PRN, so `02` is correct.

**Rate** — the segment is `pickuptype`, and it is **not a numeric code**. UPS
documents it as "Type of pickup. Valid values: oncall / smart / both. Length 6".
`oncall` is a scheduled one-off collection, `smart` a UPS Smart Pickup, and `both`
asks for the two side by side.

`getPickupRate` used to send **`/pickup/01`** — a value lifted from _Cancel's_
`CancelBy` enum, which means nothing on the Rate path. **The call had therefore
never worked.** This is why the fix looks arbitrary: swapping a `01` for the
string `oncall` is not a tuning change, it is the difference between an endpoint
that answers and one that never did. `UpsPickupRateRequest` describes an on-call
pickup, which is why `oncall` is the default of the new `pickupType` parameter.

<https://github.com/UPS-API/api-documentation/blob/main/Pickup.yaml>

## Void takes the shipment id, not the tracking number

UPS's path parameter is `shipmentidentificationnumber` ("The shipment's
identification number"). The package-level narrowing is a _separate_, optional
`trackingnumber` **query** parameter ("The package's tracking number"). Both were
being fed the same argument.

The conflation is easy to make and hard to notice, because **for a single-package
shipment UPS uses the same 1Z value for both.** On a multi-package shipment they
are different values, the path takes the shipment's, and passing a package
tracking number in the path is what fails.

`requestShipment` returns the right value as `ShipmentIdentificationNumber`.

<https://github.com/UPS-API/api-documentation/blob/main/Shipping.yaml>

## Rating and billable-weight enums were inverted

Both enums had the wire code as the **member name** and UPS's human description as
the **value**:

```ts
// wrong
enum UpsRatingMethod {
  "01" = "Shipment Level",
  "02" = "Package Level",
}
```

So `res.RatingMethod === UpsRatingMethod.ShipmentLevel` compared `"01"` against
`"Shipment Level"` and was **never true** — a comparison that type-checks, reads
correctly, and silently always takes the else branch.

UPS documents both fields as two-character strings: `01` = Shipment level, `02` =
Package level. That is now the value, and the description is the member name.

**Neither field is returned unless `RatingMethodRequestedIndicator` is present in
the request**, so treat both as optional even on an otherwise successful rate —
absence means "you did not ask", not "shipment level".

<https://github.com/UPS-API/api-documentation/blob/main/Shipping.yaml>
