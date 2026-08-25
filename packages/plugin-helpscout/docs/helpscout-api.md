# Help Scout Mailbox API v2

Findings behind `@dianemo/plugin-helpscout` — the Mailbox API v2 behaviour the
package is shaped around.

## Embedded threads are truncated

`GET /v2/conversations/{id}?embed=threads` returns `_embedded.threads`, and that
array is **truncated by Help Scout and not paginated**. It carries only the most
recent threads, however many the conversation actually has, and the response
carries no marker, no `page` envelope and no link set to say that anything was
dropped.

That is the whole hazard: a caller auditing a 60-thread conversation gets a short
array that looks complete. There is nothing in the payload to check it against —
except `threads` on the conversation itself, which is the real count. Comparing
`_embedded.threads.length` against `threads` is the only local way to notice.

**The complete view is a separate endpoint.** `GET
/v2/conversations/{id}/threads` returns one page at a time, oldest first, with a
`page` envelope: keep requesting while `page.number < page.totalPages`. In this
plugin that is `getConversationThreads`, and it is what any code that must see
every thread has to use. `getConversationWithThreads` is for the cheap case where
the most recent few are enough.

## Rate limit: 200/min is the Standard plan, and the plan is the variable

**Vendor documentation, but split across two sites** — and the figure is on the
support site, not the developer one. Checked 2026-08-25.

The developer reference
([Inbox API rate limiting](https://developer.helpscout.com/mailbox-api/overview/rate-limiting/))
states the mechanics but no number, saying only "Your current rate limit depends
on your plan". The numbers are in the support article
([Inbox API](https://docs.helpscout.com/article/1140-mailbox-api)):

| Plan     | Limit               |
| -------- | ------------------- |
| Free     | no API access       |
| Standard | up to 200 calls/min |
| Plus     | up to 400 calls/min |
| Pro      | up to 800 calls/min |

The template declares 200/min: **the Standard-plan floor, deliberately.** It is a
documented figure, not a guess — but it is the lowest paid tier's, so a Plus or
Pro account is being held to a quarter or an eighth of what it pays for. Raise it
per client with the `rateLimitOverrides` argument to `addTemplateClient` rather
than editing the template, which would overrun a Standard account.

Two further documented properties:

- **The quota is per account.** "All users associated with the same account count
  against the same rate limit", so several clients for one Help Scout account
  share the real budget while each meters its own.
- **Writes count double.** `POST`, `PUT`, `DELETE` and `PATCH` each count as two
  requests. Every request function in this package is a `GET`, so nothing here is
  affected today — but a write added later consumes two tokens' worth of quota
  against a bucket that will only charge it one.

Help Scout returns 429 with `X-RateLimit-Limit-Minute`,
`X-RateLimit-Remaining-Minute` and `X-RateLimit-Retry-After`, so the real
per-account figure is readable from any response.

### Not to be confused with the Docs API

Help Scout publishes a separate **Docs API** (v1, knowledge-base content) whose
limit is stated plainly on the developer site as 2,000–4,000 requests per 10
minutes by number of Docs sites. That is a different product with a different
quota. This package calls `/v2/conversations/…` — Inbox/Mailbox API 2.0 — and the
Docs figures do not apply to it.
