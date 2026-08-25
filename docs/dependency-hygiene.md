# Declared dependencies must be imported

`verify:pack` fails if a package declares a runtime `dependency` or
`peerDependency` that its built output never imports, or imports a bare specifier
it never declared.

## The bug this came from

`@dianemo/plugin-kit` shipped `ioredis` as a **non-optional `peerDependency` that
nothing imported**. Verified at the time: the only `ioredis` strings anywhere in
`@dianemo/core` were code comments, plugin-kit imported only `@dianemo/core` and
`node:crypto`, and `backend()` returns core's own abstraction rather than a Redis
client.

npm 7+ auto-installs non-optional peers. So every consumer of _any_ plugin in this
catalogue installed a Redis client it never used, and anyone already on ioredis v4
or on node-redis got an `ERESOLVE` conflict over a package that was never called.

## Two more the check found immediately

Both the same shape, neither in the original validation report:

- **`axios` was a runtime `dependency` of `plugin-amazon-spapi`.** Every import of
  it is type-only (`AxiosResponse`, `Method`), so TypeScript elides them and no
  `import "axios"` survives into `dist/`. Confirmed by grepping the built output.
  Moved to `devDependencies`.
- **`@types/luxon` was a runtime `dependency` of `plugin-channel-advisor`.** A
  types-only package can never be a runtime dependency. `luxon` itself stays, since
  `DateTime` is used as a value. Moved to `devDependencies`.

## Reading a failure

The check parses bare specifiers out of each package's `dist/**/*.js`, so it sees
what a consumer would actually load.

- **"declares X but never imports it"** — either the dependency is dead, or it is
  needed only for types and belongs in `devDependencies`. Type-only imports are
  elided at build, so this is the expected report for a types-only need.
- **"imports X without declaring it"** — the package works in this monorepo only
  because hoisting happens to satisfy it, and will fail for a consumer. The tarball
  install later in the same script catches most of these, but only when hoisting
  does not mask them, which is why the static check runs first.

## The one exemption

`@dianemo/core` is exempt for `plugin-kit`. Kit's entire public surface is typed in
core's types and it is meaningless without a core handler, but it imports no core
_value_, so it reads as phantom. Every other package genuinely imports core at
runtime.
