#!/usr/bin/env node
/**
 * Generate each plugin's `exports` map from the files it actually ships.
 *
 * Enumerated rather than wildcarded, because no single wildcard can serve both
 * a flat `requests/types.ts` and a `requests/shipping/index.ts` — see
 * docs/package-exports.md. Enumeration is exact but goes stale silently when a
 * file is added, which is what `--check` is for; `verify:pack` runs it.
 *
 *   node scripts/generate-exports.mjs           # rewrite every exports map
 *   node scripts/generate-exports.mjs --check    # fail if any is stale
 */
import path from "node:path";
import fs from "node:fs";

const ROOT = path.resolve(import.meta.dirname, "..");
const CHECK = process.argv.includes("--check");
const PACKAGES = path.join(ROOT, "packages");

/** Every `.ts` module under a directory, as posix subpaths without extension. */
function modules(dir, prefix = "") {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))) {
    const sub = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory())
      out.push(...modules(path.join(dir, entry.name), sub));
    else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".d.ts")) {
      out.push(sub.replace(/\.ts$/, ""));
    }
  }
  return out;
}

const target = (p) => ({
  types: `./dist/${p}.d.ts`,
  default: `./dist/${p}.js`,
});

function buildExports(dir) {
  const src = path.join(PACKAGES, dir, "src");
  const exports = { ".": target("index") };

  for (const mod of modules(path.join(src, "requests"), "requests")) {
    // `requests/shipping/index` stays resolvable: it is what callers had to
    // write before this fix, and breaking it buys nothing.
    exports[`./${mod}`] = target(mod);
    if (mod.endsWith("/index")) {
      exports[`./${mod.replace(/\/index$/, "")}`] = target(mod);
    }
  }

  // Shallowest first, so the subpaths a caller reaches for are readable at the
  // top of the block rather than buried among the deep ones.
  const keys = Object.keys(exports).filter((k) => k !== ".");
  keys.sort(
    (a, b) => a.split("/").length - b.split("/").length || a.localeCompare(b)
  );
  return {
    ".": exports["."],
    ...Object.fromEntries(keys.map((k) => [k, exports[k]])),
  };
}

const dirs = fs
  .readdirSync(PACKAGES)
  .filter((d) => d.startsWith("plugin-"))
  .sort();
const stale = [];

for (const dir of dirs) {
  const file = path.join(PACKAGES, dir, "package.json");
  const manifest = JSON.parse(fs.readFileSync(file, "utf8"));

  // plugin-kit hand-maintains its map: the `./testing` subpath is deliberately
  // out of the root and no generator would know to keep it there.
  if (dir === "plugin-kit") continue;

  const generated = buildExports(dir);
  if (JSON.stringify(manifest.exports) === JSON.stringify(generated)) continue;

  stale.push(dir);
  if (!CHECK) {
    manifest.exports = generated;
    fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + "\n");
  }
}

if (CHECK && stale.length) {
  console.error(
    `\n✗ exports maps are stale for: ${stale.join(", ")}\n` +
      `  run \`node scripts/generate-exports.mjs\` and commit the result.`
  );
  process.exit(1);
}

console.log(
  CHECK
    ? `✓ every exports map matches the files on disk (${dirs.length - 1} packages)`
    : stale.length
      ? `Rewrote ${stale.length} exports map(s): ${stale.join(", ")}`
      : `Every exports map was already current.`
);
