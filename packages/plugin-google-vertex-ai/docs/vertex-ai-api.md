# Vertex AI Search (Discovery Engine)

Findings behind `@dianemo/plugin-google-vertex-ai`, which calls the Discovery
Engine API. Every URL below was checked on 2026-08-25.

## Authentication

This package authenticates with the RS256 JWT-bearer assertion described in
`@dianemo/plugin-google`'s doc, which is where that evidence lives because both
Google packages share it:

- [No grant bootstraps from a client id and secret](../../plugin-google/docs/google-api.md#no-grant-bootstraps-from-a-client-id-and-secret)
  — why `client_credentials` cannot work here at all.
- [Service-account (JWT-bearer) flow](../../plugin-google/docs/google-api.md#service-account-jwt-bearer-flow)
  — the assertion's shape, the one-hour `exp` ceiling, the escaped-newline trap
  in `private_key`, and the non-enumerable `requestInterceptor` this package
  uses to mint one per refresh.

Grant the service account `roles/discoveryengine.viewer` on the project that owns
the engine, or `roles/discoveryengine.editor` to write session state.

## Quotas

<https://docs.cloud.google.com/generative-ai-app-builder/quotas>

Discovery Engine meters per project, per method. Across what this package calls:

| method group                                                 | limit               |
| ------------------------------------------------------------ | ------------------- |
| LLM query requests (search summarization, multi-turn search) | 60/minute/project   |
| session reads and writes                                     | 300/minute          |
| regional search                                              | 300/minute/location |

`getAnswer` is an LLM query request, so **60/min is the binding limit** and the
one the client meters at.

Two consequences. Being a per-_project_ quota, two clients pointed at one project
each meter to 60 and overrun it together — split the budget with
`rateLimitOverrides` if more than one is registered. And under standard pricing
the search quota cannot be raised at all; that needs configurable pricing and a
QPM subscription threshold.
