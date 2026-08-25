---
name: typescript-conventions
description: TypeScript conventions for dianemo-plugins — file and function size, section order, where types and helpers live, named signature types, assigning awaits, error-code rules, why-only comments and when a finding belongs in docs/ instead. Applies to .ts in every package. Use when writing or refactoring any TypeScript here — adding a request function, splitting a long file, tidying code, reviewing a diff for style, or deciding whether a helper is worth extracting. For adding a whole new plugin see writing-a-plugin; for the checks before committing see pre-commit-checks.
---

# TypeScript conventions

House rules for a TypeScript file in this repo. Apply them to any file you create or
meaningfully change. Do not reformat untouched files as a side errand.

This is a **library of API clients**, not an application. Almost every file is one of
four kinds, and several rules below depend on which:

| Kind                  | Example                                                            |
| --------------------- | ------------------------------------------------------------------ |
| Template registration | `src/client.ts` — one per plugin, builds `CreateClientData[]`      |
| Request functions     | `src/requests/<family>/index.ts` — flat siblings, one per endpoint |
| Wire types            | `src/requests/<family>/types.ts` — the vendor's shapes             |
| Barrel                | `src/index.ts`, `src/requests/index.ts` — re-exports only          |

## Function size

- **Target: under 50 lines.** Most request functions are 15–30.
- A function much over that is usually several jobs. Name the seams.
- Split by extracting named helpers, **never** by deleting comments that explain
  measured behaviour or a vendor quirk — those move with the code they describe.

## File size

- **Target: under 300 lines** for template registration, request functions and helpers.
- **Wire-type files are exempt.** A vendor's request/response shapes are as long as the
  vendor made them, and splitting them buys nothing:
  `plugin-fedex/src/requests/ratesAndTransitTimes/types.ts` is 1,555 lines and should
  stay one file. The same goes for generated-shaped data such as
  `plugin-amazon-spapi/src/utils/amazonSpapiData.ts`.
- A _code_ file over 300 lines is usually doing two jobs — a transport layer, a mapping
  layer, and the orchestration using both are three files.

Splitting a file promotes whatever the halves now share, so re-check the stacking rule
below.

## Barrels are barrels

`src/index.ts` and `src/requests/index.ts` are re-export lists. They hold:

- `src/index.ts` — the `definePlugin` call, the template registrar re-export, and the
  type re-exports that make payload types nameable by a caller.
- `src/requests/index.ts` — `export * from "./<family>/index.js"`, nothing else.

Do not put logic in either, and do not write a flow narrative above them. There is no
pipeline here to narrate: a plugin is a set of independent request functions, not a
sequence of stages.

## Request functions are flat siblings

A family's `index.ts` holds several exported request functions that **do not call each
other** — `cancelShipment`, `createShipment`, `trackPackages`. Order them the way a
reader would look for them (the vendor's own grouping, or alphabetical), and keep any
shared helper in the family's `utils.ts`.

Do not try to sort them into a call graph. There isn't one.

Every request function takes `clientName` **first**. This is repo-wide and non-negotiable
— it was broken in 25 of amazon-spapi's 33 functions and cost a release. A function that
needs a grant takes it as a named options object, not a bare positional string:

```ts
export const getOrders = async (
  clientName: string,
  { grantId }: EbayRequestOptions,
  data?: GetEbayOrdersData
) => { … };
```

Two adjacent bare `string` parameters are invisible to TypeScript when swapped. If a
function needs two, one of them gets a named type.

## Sub-clients are the plugin's business, not the caller's

If a plugin registers sub-clients, its request functions append the segment themselves
via a small helper, and the helper's `group` parameter is a **union, not `string`**:

```ts
export type UspsRateGroup = "default" | "labels";

export const uspsSubClient = (clientName: string, group: UspsRateGroup) =>
  `${clientName}:${group}`;
```

Never make the caller write `account + ":labels"`. `plugin-google` did, and passing
`:profile` to `validateAddress` silently sent the request to the wrong host — a 404
rather than the misconfiguration it was.

## Error codes

One code per **distinct failure**, never per function and never shared across two
failures that a caller would handle differently. A caller matching on the code cannot
tell what failed otherwise, which is the entire reason the codes exist.

- Prefix is three uppercase letters, unique per package (`FDX`, `WMT`, `SHO`, `USP`…).
  No prefix collides across the catalogue and none should.
- Number is four digits. **Gaps are fine; reuse is not** — a code retired with its
  function stays retired rather than being back-filled, which is why several packages
  are not contiguous.
- A transport failure and a business-logic failure in the same function are **two
  codes**.
- The check that matters: the count of distinct codes in a package equals the number of
  distinct failures. `grep -rhoE '"<PREFIX>_[0-9]{4}"' packages/<pkg>/src | sort -u | wc -l`

Nine packages shipped codes reused across three to seven call sites. Renumbering a
package wholesale is fine and often cleaner than patching the duplicates.

## Assign an `await` before using it

Applies everywhere, tests included.

**Never reach into an awaited call** — not `(await x).prop`, `(await x)[0]`, nor
`(await x).length`. The parenthesised form buries the fact that the line does IO, throws
away the name of what was fetched, and leaves nothing to log or break on.

Unguarded `[0]` on a response is how `plugin-unis` threw a raw `TypeError` straight past
its own `RequestError` contract. Assign it, then guard it.

**Never await inside a condition.** Assign, then branch.

## Name the types in a signature

A structural type written inline buries the signature. Declare it in the file's types
block and refer to it by name, so the function reads in one line. Applies to return
types and to any parameter whose type is more than a field or two.

Name them for what they are, not for the function they serve: `EbayRequestOptions`, not
`GetOrdersOptions`.

Inferred return types need no annotation. This is about types written out by hand.

## Extract only when it buys something

The size targets are not a mandate to shred. A 40-line function that reads straight
through beats four 10-line functions the reader has to reassemble.

Extract when:

- **Two or more genuine call sites.** Any size.
- **The name replaces a comment.** `neweggSucceeded(body)` beats a casing check plus a
  paragraph about why the flag is sometimes a string.
- **The caller would otherwise be doing two jobs.**

A **single-use helper under about 15 lines is not pulling its weight**. Two call sites
are not reuse if both are arguments to the same call.

## Section order within a file

1. `import` statements
2. `declare module "@dianemo/core"` augmentation, if any
3. types and interfaces
4. constants
5. functions
6. `export default`, if any

Constants live in one block **above** the functions, even when only one function uses
them.

## Where shared code lives: `utils.ts` and `types.ts` stack

Each thing lives at the **lowest level that contains all of its users**:

| used by                             | lives in                              |
| ----------------------------------- | ------------------------------------- |
| several files in one request family | that family's `utils.ts` / `types.ts` |
| files in two or more families       | `src/requests/utils.ts` / `types.ts`  |
| the client and the requests         | `src/utils/`                          |

Push things down as far as they go; promote only when a second family reaches for them.
A module's own primary export being imported by its one caller is not "shared".

Note that the exports generator walks every `.ts` under `src/requests/`, so a helper
there becomes a public subpath. That is harmless, but do not put anything there you
would be unhappy to see imported.

## Comments

The bar is **why-only**: a comment must say something the code and its names cannot.
If a reader could recover the comment by reading the function it sits on, delete it.

Measured baseline: the repo runs 3–8% comment lines by package. A folder sitting well
above that is a signal to re-read its comments, not a badge.

### Three things earn a comment

1. **A rejected alternative.** "A plain `Error`, not a `BaseError`: BullMQ stores
   `err.message` as `failedReason`, and `BaseError` replaces it with its error-code
   text, which reads as a malformed job rather than a delivery failure."
2. **External behaviour a reader cannot see from here.** An API that returns null
   where it looks complete, a field that persists across a print job, a header whose
   absence is a 428.
3. **A consequence that is not local.** "Record before reporting the failure, so
   whatever landed is never re-sent." The next line looks harmless; the ordering is
   load-bearing.

### Delete on sight

- **Doc comments that restate the name.** `/** By fulfillment, each group in shipment
id order. */` on `groupShipments`; `/** Destinations still outstanding. */` on
  `DeliveryLegs`. The name is the comment.
- **`@param` / `@returns` / `@throws`.** TypeScript already states every one of these,
  and the prose invariably drifts from the signature. Strip tag-only JSDoc blocks from
  any file you are already editing — keep any real prose in the block. Do not open
  unrelated files to do this.
- **Narration of the next line.** If the comment and the statement say the same thing
  in two languages, keep the statement.
- **Commented-out code.** Git has it.

### Parameter comments go in the JSDoc

A comment interleaved in a parameter list breaks the signature apart, and the reader
loses the shape of the call — the same cost as an inline structural type. When a
parameter needs explaining, explain it in the function's JSDoc block.

This is not a licence to reintroduce `@param {string} id - the id of the thing`. The
why-only bar still applies: a parameter gets a line only when there is something to
say that its name and type cannot, which for most parameters is nothing. The rule
above about stripping tag-only JSDoc is about exactly that restatement — a `@param`
carrying a real reason is prose, and stays.

### Measured findings go to `docs/`

A finding that took a query, a sample, or a support ticket to establish is worth
keeping — but it is documentation, not a comment. Write it up and leave the code a
one-line pointer. Keep the numbers in the doc — "measured over 445 orders: 0 without,
525 with" is the whole value; a finding with the evidence stripped out is just an
assertion.

Add a section to an existing file rather than starting a new one when the area is
already covered.

### Which `docs/` a write-up goes to

**A vendor finding goes in the package it describes**, at
`packages/plugin-<name>/docs/<name>-api.md`: rate-limit evidence, wire quirks, and the
open questions that need a real account. That directory is in the package's `files`
array, so it ships in the tarball and a pointer left in `src/` still resolves for a
consumer reading the published source.

**A finding that outlives one package goes in the repo's `docs/`** — `core-behaviour.md`
for `@dianemo/core` behaviour more than one plugin is built around, `oauth-grants.md`
for the evidence behind `ACCEPTED_GRANTS`, `package-exports.md` and
`dependency-hygiene.md` for the cross-cutting mechanisms, `open-questions.md` for the
countable list of what is unresolved.

### A pointer says which `docs/` it means

Both directories are called `docs/`, so the leading character disambiguates:

```ts
/** Not `_embedded`: see docs/extensiv-api.md#collections-arrive-as-resourcelist */
/** Core deep-copies this — see /docs/core-behaviour.md#refreshconfig-is-deep-copied-so-it-cannot-hold-a-function */
```

- **No prefix** — the package's own `docs/`, relative to the package root. This is the
  common case, and what a vendor pointer always uses.
- **A leading `/`** — the repo-wide `docs/`, from the repository root.

In Markdown the same two targets are ordinary relative links: a sibling file inside the
package, or `../../../docs/<file>.md` up to the repo root.

The one case where a package points into another is `plugin-google-vertex-ai` →
`plugin-google`, which share a vendor and therefore an auth flow. It is written as a
single explicit link in the doc rather than repeated in each code comment.

### Two rules specific to this repo

**A rate-limit calibration always carries its source.** URL and the date checked, in the
comment or in the package's `docs/<name>-api.md` section it points at. An uncommented number
reads as verified. If the vendor publishes nothing, say _that_ — several limits here are
explicitly this repo's own politeness ceilings and each says so.

**Never flatten "inferred" into "documented".** Vendor documentation, an observed
response, a vendor's own published client, a third party's schema dump, and an inference
are five different strengths of claim, and several findings here rest on the weaker ones.
A comment or doc that flattens them is worse than none, because the next reader cannot
tell what still needs checking. This distinction is the single most valuable thing in
several of these files — preserve it through any edit or move.

### Shape

- One line where one line does. A block comment is for something genuinely subtle.
- Put it on the declaration it explains, not floating above a blank line.
- Write what is true, not what changed. No "changed this to…", no dates, no initials —
  that is what `git blame` is for. (A "checked YYYY-MM-DD" stamp on a vendor citation is
  the exception: it dates the _claim_, not the edit.)

## Verifying a re-layout

Moving declarations is type-neutral, so anything that breaks is a real mistake. Run the
`pre-commit-checks` skill — it owns the command sequence and the order.
