# Stripe API

Findings behind `@dianemo/plugin-stripe`. Every page cited here is Stripe's own
documentation, checked 2026-08-25.

## The `Stripe-Version` pin, and why it is `2022-11-15`

Without a `Stripe-Version` header the wire version is per-account and mutable:
"requests made with curl use your Stripe account's default API version
(controlled in Workbench) unless you override it by setting the `Stripe-Version`
header". So an account owner clicking upgrade in the dashboard changes the shape
of the responses this plugin parses, while `src/requests/types.ts` stays where it
is. The header removes that.

`2022-11-15` is not a conservative guess — it is the version those response types
actually describe. Two pieces of evidence:

- The `2022-11-15` release is the one that "Removes the `charges` property on the
  PaymentIntent object. Use the `latest_charge` property instead." A
  `latest_charge` string and no `charges` list is exactly what
  `StripePaymentIntent` models.
- Stripe's asynchronous-capture page documents `capture_method:
"automatic_async"` together with a `latest_charge` string under the heading
  "API version 2022-11-15 or later". `StripePaymentIntent.capture_method`
  includes `"automatic_async"`.

**The current Stripe release is `2026-07-29.dahlia`.** Moving to it means walking
the breaking changes of every major release since — Acacia, Basil, Clover,
Dahlia — against `src/requests/types.ts`. Bump the constant only together with
those types, never on its own.

Sources, checked 2026-08-25:

- <https://docs.stripe.com/api/versioning>
- <https://docs.stripe.com/changelog/2022-11-15/removes-charges-attribute-paymentintent>
- <https://docs.stripe.com/payments/payment-intents/asynchronous-capture>

## Accounts, not Connect

The plugin sends no `Stripe-Account` header. One registered credential is one
Stripe account's own secret key, and `instanceId` selects which key a request
uses, so a call always acts as the account that owns that `apiKey`.

**Why `instanceId` cannot double as a `Stripe-Account` value.** Stripe documents
the header as the platform's own secret key plus the connected account's
`acct_…` id — a Stripe-issued identifier the platform has an established Connect
relationship with. An `instanceId` here is a free-form alias chosen by whoever
registered the credential, and it is paired with that account's _own_ key, not a
platform key. Synthesising the header from it would route a charge by a string
Stripe never validated, on a path that moves money. Supporting Connect properly
means a second credential shape (platform key + connected `acct_…`), not a reuse
of this one.

Source, checked 2026-08-25: <https://docs.stripe.com/connect/authentication>

## Rate limits

Stripe's live-mode defaults are roughly 100 reads/sec, 100 writes/sec and 25
searches/sec, applied separately per subsystem. The client models a single token
bucket at 100/sec (`interval: 1000`, 100 tokens) rather than per-endpoint
sub-buckets.

The reason that is enough: Stripe answers a subsystem limit with a 429 carrying a
back-off hint, and core arms a fleet freeze on 429 (see
[/docs/core-behaviour.md](../../../docs/core-behaviour.md#only-429-5xx-and-connection-resets-freeze-the-fleet)).
The bucket keeps ordinary traffic under the ceiling; the freeze handles the case
where a search-heavy caller trips the lower search limit. Sub-buckets would only
buy a slightly earlier stop.

## Form encoding

The v1 REST API does not accept JSON on write paths — it requires
`application/x-www-form-urlencoded`, with nested values in bracket notation:

    metadata[order_id]=123
    payment_method_options[card][request_three_d_secure]=any
    expand[0]=charges

`URLSearchParams` does not do the nesting, which is why `stripeFormEncode`
exists: it flattens objects and arrays into that shape and drops `null` /
`undefined` rather than sending empty values.
