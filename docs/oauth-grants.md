# OAuth grants each vendor accepts

The table `ACCEPTED_GRANTS` in `test/auth.test.ts` asserts that no plugin sends a
`grant_type` its vendor will not honour. This is the evidence behind each entry.

**Changing an entry there is a claim about a vendor's OAuth service.** Add the
citation here at the same time, and say plainly whether it is documentation, an
observed response, or an inference — the three are not interchangeable, and two of
the eight v1.0.0 blockers were grants that were well-formed and simply wrong.

An entry records only that the vendor _accepts_ the grant at its token endpoint. It
says nothing about which scopes each grant may request; that is a separate question
and conflating the two is what produced the eBay blocker.

## Google — `google`, `googleVertexAi`

`authorization_code`, `refresh_token`,
`urn:ietf:params:oauth:grant-type:jwt-bearer`.

Google's own discovery document enumerates the grants its token endpoint supports,
and `client_credentials` is **not** among them:
<https://accounts.google.com/.well-known/openid-configuration>

Confirmed against the live endpoint during validation, which is stronger than the
document alone:

| `grant_type` sent    | Response                                         |
| -------------------- | ------------------------------------------------ |
| `client_credentials` | `unsupported_grant_type: Invalid grant_type`     |
| `refresh_token`      | `invalid_client` — reached credential validation |

The control is what makes it conclusive: the second request got _past_ grant
checking and failed on the credentials, so the first was rejected for its grant and
not for its credentials.

Neither of these grants bootstraps from a client id and secret alone —
`authorization_code` and `device_code` need a user, `refresh_token` needs a stored
token, and `jwt-bearer` needs a service-account assertion. That is why a
server-to-server caller uses a service-account key or an API key instead, and why a
client-level `refreshConfig` here cannot be an ordinary OAuth grant. See
[the Google doc](../packages/plugin-google/docs/google-api.md).

## eBay — `ebay`

`client_credentials`, `authorization_code`, `refresh_token`.

<https://developer.ebay.com/develop/guides/sell/authorization> (checked
2026-08-25) tabulates all three at the token endpoint, each with its own daily
quota:

| Grant type           | Token type               | Rate limit          |
| -------------------- | ------------------------ | ------------------- |
| `client_credentials` | Application access token | 1,000 requests/day  |
| `authorization_code` | User access token        | 10,000 requests/day |
| `refresh_token`      | User access token        | 50,000 requests/day |

All three appear in the table because the client-level config uses the first,
`grantRefreshConfig` the third, and `exchangeAuthCodeForAccessToken` posts the
second directly.

**The scope question is separate and is what shipped broken.** From the same page:
"Client credentials grant flow mints a new Application access token that you can
use to access the resources owned by the application"; "Authorization code grant
flow mints a new User access token that you can use to access the resources owned
by the user"; and "If your application needs to access and modify resources owned
by the user, you must use the authorization code grant flow". Orders belong to the
seller, so `sell.fulfillment` needs a user token — which `client_credentials`
cannot carry even though it mints a perfectly valid token.

What eBay does **not** document is which error it returns for that wrong pairing. An
earlier draft of this repo asserted `invalid_scope`; that was an inference and has
been retracted.

## Wayfair — `wayfair`

`client_credentials` only. Auth0 client-credentials tokens are not refreshable, so
there is no refresh grant to accept — the plugin mints a new one.

**Source is vendor-published code, not vendor documentation.** Wayfair's developer
portal is a JavaScript application behind a supplier login and serves nothing to a
fetch. The citable artefact is Wayfair's own published integration,
`@copyright Wayfair LLC`:
<https://github.com/wayfair-contribs/plentymarkets-plugin> (checked 2026-08-25).
`src/Core/Api/Services/AuthService.php` posts
`{client_id, client_secret, audience, grant_type: 'client_credentials'}` as JSON.

That is a weaker class of source than a doc page and is recorded as such
deliberately. See [the Wayfair doc](../packages/plugin-wayfair/docs/wayfair-api.md).

## Observed at the wire — `fedex`, `extensiv`, `helpscout`, `ups`, `usps`, `walmart`

`client_credentials`.

Not a doc citation: during validation each of these was observed obtaining a token
against a local server standing in for the vendor, with every `{{…}}` placeholder
resolved. An empirical result rather than a documented one — and for "does this
grant work", a stronger one.

10 of the 11 OAuth plugins in the catalogue use `client_credentials` at the client
level. channel-advisor was the lone outlier, and it was a blocker.

## Deliberately absent — `channelAdvisor`

No entry. Its blocker was the _placement_ of `refresh_token`, not the grant itself —
see [`core-behaviour.md`](core-behaviour.md#refreshtoken-cannot-bootstrap-a-client-level-refresh),
which is the assertion that catches it. Adding a grants entry with no doc to cite
would dress a guess up as a check.
