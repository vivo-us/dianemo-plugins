# Newegg Marketplace API

Findings behind `@dianemo/plugin-newegg`. Everything quoted here was checked
against Newegg's published JSON samples on **2026-08-25**.

## `IsSuccess`: the casing, and the value type

The success flag on a Newegg response envelope is `IsSuccess` — capital `I`,
capital `S`. Before 1.0.0 the feed types spelled it `isSuccess` and the feed
guards compared it to the string `"False"`:

```ts
if (!feedData || resData.isSuccess === "False") {
  /* throw */
}
```

`resData.isSuccess` is `undefined` on every real response, so the comparison was
never true. A rejected feed read as an accepted submission and the seller's
catalogue then stopped updating with nothing logged — the failure mode with no
signal at all.

The **value** genuinely varies by endpoint, which is why `neweggSucceeded` in
`src/requests/utils.ts` is a helper rather than a comparison. Both spellings are
published:

- Inventory update feed — a JSON boolean:
  <https://developer.newegg.com/newegg_marketplace_api/datafeed_management/submit_feed/inventory_update_feed/>
  ```json
  "IsSuccess": true
  ```
- Order confirmation — the string:
  <https://developer.newegg.com/newegg_marketplace_api/order_management/order_confirmation/>
  ```json
  "IsSuccess": "true"
  ```

`neweggSucceeded` normalises the value across both. It does not normalise the
key — `IsSuccess` is the only spelling Newegg publishes, and reading a second one
would only re-hide a genuinely absent flag. An absent flag reads as a **failure**:
a noisy false alarm is recoverable, a silently dropped feed is not.

## `RequestID` on the way in, `RequestId` on the way out

Newegg spells the same key differently by direction on the Get Feed Status
endpoint:

- request body: `RequestBody.GetRequestStatus.RequestIDList[].RequestID`
- response body: `ResponseBody.ResponseList[].RequestId`

<https://developer.newegg.com/newegg_marketplace_api/datafeed_management/get_feed_status/>

Both spellings are in the published samples and both are correct as written. The
asymmetry looks like a typo from either side, so `NeweggFeedResponse.RequestId`
carries a comment saying not to "fix" it.

### Open question: is `RequestIDList` an object or an array?

`NeweggGetFeedStatusData` types it as an array of `{ RequestID: string }`, which
is what a multi-id query needs. The published request sample shows it as a bare
object with one `RequestID` inside:

```json
"RequestIDList": { "RequestID": "..." }
```

Newegg's JSON surface is derived from its XML one, where a repeated element and a
single element are written identically, and such endpoints commonly accept either
form. The array typing was left as it is on that basis — but it is untested
against a real account for the single-id case, and one call with one id settles
it. If Newegg rejects the array, the type has to become
`{ RequestID: string } | { RequestID: string }[]`.

## The business marketplace has its own inventory endpoint

`neweggBusiness` **404s** on the international inventory path that serves the
consumer marketplace. The two are different endpoints, with a different verb and
an explicit API version:

| template         | request                                                |
| ---------------- | ------------------------------------------------------ |
| `newegg`         | `PUT /contentmgmt/item/international/inventory`        |
| `neweggBusiness` | `POST /contentmgmt/item/inventory` with `?version=304` |

**Established by a live call, 2026-08-25.** The international path returned 404
for a real business SKU; the business path returned real stock for the same one.
Source: **observed responses**, plus the pre-1.0.0 implementation, which shipped
both as separate functions (`getItemInventory` and `getB2BCAItemInventory`) and
whose split this restores — the 1.0.0 port carried only the consumer one across
and pointed both templates at it.

**The response shapes differ, which is why these are two functions rather than
one branching on the client name.** The consumer endpoint nests an
`InventoryAllocation` array; the business endpoint answers a flat record. A
merged function could only switch on the `clientName` string, so its return type
would be a union no caller could narrow.

The flat record also sends two fields as **strings** where the rest of this
package models them as numeric enums — `FulfillmentOption: "0"` against
`NeweggItemFulfillmentOption.Seller = 0`, and `Active: "1"` against
`NeweggNumericBoolean.True = 1`. `NeweggBusinessInventoryResponse` types them as
the wire sends them. Coercing them to the enums would read as a documented
vendor guarantee, and this is one observed response from one seller.

## Rate limits: the mechanism is documented, the numbers are not

**Vendor documentation for the framework, nothing for the figures.** Checked
2026-08-25 against
[Throttling](https://developer.newegg.com/documents/newegg-marketplace-api/throttling/).

Newegg documents two mechanisms and no quantities:

> Rate limits are divided into minute intervals. This means you have a maximum
> number of requests you can submit to a specific function in a one-minute
> period.

> Datafeed related functions have the hourly limitation of request and the
> maximum size of each request.

Exceeding either returns HTTP 429 with `"Too many request."`. No per-function
table is published anywhere on the developer site.

### What this package declares, and why it is a guess

**Every figure below is this repo's own ceiling.** They are not Newegg's, and
nothing on the developer site corroborates them.

| Sub-client group                                                                                  | Declared      |
| ------------------------------------------------------------------------------------------------- | ------------- |
| `getItemInventory`, `updateItemInventory`, `getItemPricing`, `updateItemPricing`, `getFeedStatus` | 10,000 / hour |
| `getOrders`, `markOrderDownloaded`, `shipOrder`, `getRmaInfo`                                     | 1,000 / hour  |
| `submitFeed`                                                                                      | 10 / minute   |

There is also a **modelling mismatch worth knowing**: Newegg meters the
non-datafeed functions _per minute_, but these buckets are expressed per hour and
drip-fed (`interval: 360`, one token at a time, up to 10,000). That smooths an
hourly allowance into a steady trickle, which is safe against a per-minute limit
by construction — a drip can never burst — but it does mean the shape of the
budget does not match the shape of the limit, and a caller that could legitimately
burst 60 calls in a minute is instead paced at roughly 10 per second.

`submitFeed` is the one that matches its mechanism: it is a datafeed function, and
datafeed limits genuinely are hourly.

### How to get the real numbers without asking Newegg

Newegg returns them on every response:

- `X-RateLimit-Limit` / `X-RateLimit-Remaining` — the per-minute function limit
- `X-RecordCount-Limit` / `X-RecordCount-Remaining` — the datafeed record ceiling

Reading `X-RateLimit-Limit` off a single live call to each function would replace
this entire section with vendor-stated figures. That has not been done. Until it
is, set anything you learn per client with the `rateLimitOverrides` argument to
`addTemplateClient` rather than editing the template.
