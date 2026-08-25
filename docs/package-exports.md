# `exports` maps

Every plugin's `exports` map is generated from the files on disk by
`scripts/generate-exports.mjs`. `npm run exports` rewrites them;
`npm run exports:check` fails if any has gone stale, and `verify:pack` runs that
check.

## Why they are enumerated rather than wildcarded

Every plugin originally mapped one wildcard:

```json
"./requests/*": { "types": "./dist/requests/*.d.ts", "default": "./dist/requests/*.js" }
```

Under that map the documented `@dianemo/plugin-fedex/requests/shipping` throws
`ERR_MODULE_NOT_FOUND`, because `shipping` is a directory and the target resolves
to `dist/requests/shipping.js`. Only the awkward `.../shipping/index` worked. But
the same wildcard is the only thing that makes flat modules like
`requests/types.ts` resolvable, so it cannot simply be repointed at
`*/index.js` — both shapes exist under `requests/` across the catalogue.

The obvious fix is a fallback array, and it does not work:

```json
"./requests/*": ["./dist/requests/*.js", "./dist/requests/*/index.js"]
```

**Node does not existence-check fallback array targets.** Measured on Node
v22.22.2 against a package laying out exactly that map, with
`dist/requests/shipping/index.js` and `dist/requests/types.js` both present:

```
import 'pkg/requests/shipping'
→ Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/dist/requests/shipping.js'
```

Resolution takes the first entry and fails at load. Node's array fallback only
skips targets that are _invalid_ (a bad shape, an unsupported form), not targets
that are absent. TypeScript's resolver does check existence for these, which is
why a fallback array can typecheck and then fail at runtime — the worst available
outcome.

Two patterns with distinct specificity would work in principle
(`./requests/*/index` beats `./requests/*` on suffix length), but that only moves
the problem: a flat module nested inside a directory, such as
`requests/orders/types`, then resolves to `dist/requests/orders/types/index.js`.

So the subpaths are enumerated. Each package's map is 3–31 entries, generated, and
covers three forms:

| Subpath                     | Target                                                  |
| --------------------------- | ------------------------------------------------------- |
| `./requests/shipping`       | `dist/requests/shipping/index.js` — the documented form |
| `./requests/shipping/index` | same — kept resolvable for existing callers             |
| `./requests/types`          | `dist/requests/types.js` — flat modules at any depth    |

## The cost, and what pays for it

Enumeration is exact but goes stale silently: a new module is simply unreachable to
a consumer while every in-repo test keeps passing, because tests import by
filesystem path and never consult `package.json`. Two things catch that:

- `npm run exports:check` compares each map against the files on disk.
- `verify:pack` imports one directory-form subpath per package _from the installed
  tarball_, which is the only place resolution can actually be proven. It resolved
  23 subpaths before this change; it resolves 35 today.

## Not part of the public surface

The generator walks every `.ts` under `src/requests/`, so internal helpers get a
subpath too — `plugin-mainfreight`'s `requests/utils.ts` (`resolveRegion`),
`plugin-newegg`'s `requests/utils.ts`. Harmless to expose and nothing imports them
across packages. If they ever need to be genuinely private, the lever is the
generator's module walk, not the packages.
