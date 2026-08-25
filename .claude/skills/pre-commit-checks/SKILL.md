---
name: pre-commit-checks
description: The checks to run before committing or opening a PR in dianemo-plugins — format, sort imports, regenerate exports maps, typecheck, build, test, and the three verify scripts that exercise the packages as published. Use before a git commit or push, when opening or updating a PR, and when asked whether a change is finished, ready, or safe to publish.
---

# Pre-commit checks

Run these in order. The order is load-bearing twice over, and both traps have bitten
in this repo:

- **`format:fix` runs before `sort-imports`.** The sorter orders imports by descending
  line length, so Prettier changing a line's width changes where it sorts.
- **`build` runs before `verify:pack` and `verify:readme`.** Both read `dist/`. Run them
  against stale output and they report failures that do not exist — a previous session
  chased five phantom errors from exactly this.

Nothing here is enforced by a git hook. There is no husky or lint-staged, so a skipped
step is not caught before review.

## 1. Format

```bash
npm run format:fix        # write
npm run format            # check only
```

Covers `packages/*/{src,test}/**/*.ts`, `test/**/*.ts`, `scripts/*.mjs`, both `docs/`
trees (`docs/*.md` and `packages/*/docs/*.md`), every README, and `CLAUDE.md`.

Config is `.prettierrc` at the root — **not** a `prettier` key in `package.json`.

**Prettier is on a caret range (`^3.8.4`), not pinned.** A minor bump can change
formatting, so a `format:fix` on a machine that resolved a newer 3.x will reformat files
you did not touch. If you see unrelated formatting churn in your diff, check
`npx prettier --version` against what CI resolved before committing it.

**Do not hand-write how a union breaks.** Prettier picks the least-broken form that
fits, and adding one member legitimately flips a union to a different form. Run it and
take what it gives you.

**Re-run `npm run format` immediately before committing**, not when you finish editing.
A later edit — yours or a parallel agent's — undoes the pass, and `git add -A` commits
it without complaint.

## 2. Sort imports

```bash
npm run sort-imports         # write
npm run sort-imports:check   # exit 1 if anything is unsorted
```

Descending line length, single-line statements first, multi-line `{ … }` imports last.
The script is authoritative — do not hand-order.

For a subset, call it directly. Flags are double-dashed, and paths are relative to the
repo root:

```bash
node scripts/sort-imports.mjs --dir packages/plugin-fedex/src
node scripts/sort-imports.mjs --file packages/plugin-fedex/src/client.ts
node scripts/sort-imports.mjs --dry-run --dir packages
```

## 3. Regenerate the exports maps

```bash
npm run exports         # rewrite
npm run exports:check   # exit 1 if any is stale
```

**Required whenever you add, delete, move or rename anything under a package's
`src/requests/`.** Each package's `exports` map is enumerated from the files on disk,
because no single wildcard can serve both a flat `requests/types.ts` and a
`requests/shipping/index.ts` — see `docs/package-exports.md`.

A stale map fails silently in the worst way: every in-repo test keeps passing, because
tests import by filesystem path and never consult `package.json`, while the new module
is unreachable to a consumer. `verify:pack` runs this check, so it is caught — but only
at step 7.

## 4. Typecheck

```bash
npm run check                              # every workspace, --noEmit
npm run check -w @dianemo/plugin-fedex     # one package
```

Workspace names are `@dianemo/plugin-<name>`.

`tsconfig.base.json` does not set `noUnusedLocals` or `noUnusedParameters`, so the
normal check does not catch an import left behind when you move a function. Add them
explicitly:

```bash
npx tsc --noEmit --noUnusedLocals --noUnusedParameters -p packages/<pkg>/tsconfig.json
```

The repo is currently clean under those flags across all 22 packages, so **any hit is
yours** — there is no pre-existing noise to filter out.

## 5. Build

```bash
npm run build        # kit first, then all 21 plugins
```

The dependency graph is one level deep: **`@dianemo/plugin-kit` → every plugin.**
`build` is `build:kit && build:plugins` for that reason. If you changed only one plugin,
`npm run build -w @dianemo/plugin-<name>` is enough; if you changed `plugin-kit`,
everything downstream needs rebuilding and `npm run build` is the safe call.

`@dianemo/core` is a peer dependency resolved from the registry, not built here.

## 6. Test

```bash
npm test        # vitest run --typecheck
```

264 tests. Four of the suites are repo-wide and are the ones most likely to catch a
mistake you did not expect:

| Suite                             | What it guards                                                                                                                                                                                      |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `test/auth.test.ts`               | Every plugin can actually obtain a token — no unresolved `{{…}}`, no client-level `{{refreshToken}}`, a doc-cited `grant_type`, and every leaf client having a `baseURL` and a declared `rateLimit` |
| `test/requestClientNames.test.ts` | Every request function targets a client its template registered, and that client is _usable_                                                                                                        |
| `test/allPlugins.test.ts`         | Every plugin composes onto a handler and registers its own template name                                                                                                                            |
| `test/composition.test-d.ts`      | Multi-plugin namespace inference, type-level (needs `--typecheck`)                                                                                                                                  |

`--typecheck` is why `npm test` and a bare `npx vitest run` report different totals.

## 7. Verify as published

These three exercise what a consumer actually gets, which nothing above does. **All
three need a fresh `npm run build` first.**

```bash
npm run verify:pack     # packs tarballs, installs them, imports by bare specifier
npm run verify:readme   # compiles the first TypeScript block of every README
```

`verify:pack` also checks that every declared runtime dependency is imported and every
import declared — see `docs/dependency-hygiene.md`. A types-only dependency reads as
phantom here and belongs in `devDependencies`.

`verify:readme` compiles each README example. A setup example is documentation that
claims to compile, so it has to.

## 8. Lint

```bash
npm run lint
```

## 9. Check what you are actually committing

```bash
git status --short
git diff --staged
```

Note `git status --short` distinguishes staged (`M `) from unstaged (` M`) — a plain
`git diff` hides staged work, which has caused a review to miss a whole file here.

Never commit `.env`. Do not sweep unrelated files into a feature commit; a formatting
pass over a file you did not otherwise touch belongs in its own commit.

## 10. Self-review against the conventions

Load the `typescript-conventions` skill and read the change against it. Read it rather
than working from memory — nothing from it is restated here on purpose, because a second
copy of the rules drifts from the first the moment either moves.

If you added a plugin, load `writing-a-plugin` instead: it has a checklist of the things
a new package must do that no amount of local correctness will catch.

## Commit messages

This repo has one commit in its history, so there is no established convention to
follow. Until the owner sets one, describe **why** in the body rather than what the
diff already shows, and wrap at ~80 columns. Do not import a convention from another
repo and present it as this one's.
