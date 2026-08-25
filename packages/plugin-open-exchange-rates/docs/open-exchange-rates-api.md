# Open Exchange Rates

Source, checked 2026-08-25:
<https://docs.openexchangerates.org/reference/authentication>

## The App ID goes in the header, not the query string

OXR documents two ways to pass the App ID: an `Authorization: Token YOUR_APP_ID`
header, or an `app_id` URL parameter. `plugin-open-exchange-rates` uses the
header, via `authentication: { type: "token", customPrefix: "Token" }`.

**Why not the query parameter.** Core's log redaction matches credentials it can
recognise, and a query parameter named `app_id` matches none of its
credential-name tests. So with the parameter form — which is what this plugin
shipped before 1.0.0, injected by a `requestInterceptor` — every 4xx and 5xx
logged the App ID in plaintext, in the request URL, wherever those logs go.

**And nothing may put `app_id` back into `params`.** OXR: "If both HTTP header
and URL parameter are provided, we will use the value from the URL and ignore the
header." A caller or interceptor adding the parameter alongside the header would
not merely be redundant — it would silently take over as the credential actually
used, and reintroduce the plaintext logging.

## Rate limits

The free plan allows 1,000 requests/month; paid plans are higher. The client
meters a polite 60/min (`interval: 60_000`, 60 tokens) rather than deriving a
ceiling from the monthly quota — a typical daily-refresh consumer uses well under
one call per minute, so the monthly figure never binds, and 60/min is there only
to stop a runaway loop.

## Base currency is plan-gated

The free plan serves USD-base only; `base` on `/api/latest.json` and
`/api/historical/{date}.json` is accepted on paid plans.
