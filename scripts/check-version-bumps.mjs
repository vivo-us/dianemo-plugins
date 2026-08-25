#!/usr/bin/env node
/**
 * Fail when a branch changes what a package publishes but leaves its version
 * alone.
 *
 * Every package here is published independently, so the version in its own
 * package.json is the only thing telling a consumer that its code moved.
 * Nothing in npm enforces the pairing: `npm publish` on an unchanged version
 * is rejected by the registry, but only at publish time, long after review —
 * and a branch that reworks plugin-fedex/src and ships no bump looks entirely
 * clean to every other check in this repo.
 *
 * What counts as consumer-visible is deliberately narrower than what the
 * tarball contains. `src/**` and `tsconfig.json` change the emitted dist, and
 * package.json carries the exports map and the dependency ranges. Docs, READMEs
 * and tests ship (or do not) without altering a single byte a consumer runs, so
 * requiring a bump for a typo fix would train everyone to bump reflexively —
 * which is the same as not checking at all.
 *
 *   node scripts/check-version-bumps.mjs                       # vs origin/master
 *   node scripts/check-version-bumps.mjs --base=<ref-or-sha>   # vs anything else
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PACKAGES = path.join(ROOT, "packages");

const baseArg = process.argv.find((a) => a.startsWith("--base="));
const BASE = baseArg ? baseArg.slice("--base=".length) : "origin/master";

/** Paths within a package that change what a consumer actually runs. */
const TRIGGERS = [/^src\//, /^tsconfig\.json$/, /^package\.json$/];

function fail(message) {
  console.error(`\n✗ ${message}`);
  process.exit(1);
}

const git = (...args) =>
  execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();

// ---------------------------------------------------------------------------
// Compare against the merge base, not the base tip. Commits that landed on
// master after this branch started are not this branch's changes, and diffing
// against the tip would demand bumps for all of them.
// ---------------------------------------------------------------------------

let mergeBase;
try {
  mergeBase = git("merge-base", BASE, "HEAD");
} catch {
  fail(
    `cannot resolve '${BASE}' — in CI the checkout needs fetch-depth: 0, and ` +
      `locally you may need 'git fetch origin'`
  );
}

const changed = git("diff", "--name-only", mergeBase, "HEAD")
  .split("\n")
  .filter(Boolean);

if (!changed.length) {
  console.log(`No changes against ${BASE} — nothing to check.`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Semver comparison, enough for the shapes this repo publishes: x.y.z with an
// optional prerelease tag, where a prerelease sorts before its own release.
// ---------------------------------------------------------------------------

function compare(a, b) {
  const parse = (v) => {
    const [core, ...pre] = String(v).split("-");
    return {
      nums: core.split(".").map((n) => Number.parseInt(n, 10) || 0),
      pre: pre.join("-"),
    };
  };
  const left = parse(a);
  const right = parse(b);
  for (let i = 0; i < 3; i++) {
    if (left.nums[i] !== right.nums[i]) return left.nums[i] - right.nums[i];
  }
  if (left.pre === right.pre) return 0;
  if (!left.pre) return 1;
  if (!right.pre) return -1;
  return left.pre < right.pre ? -1 : 1;
}

/** A package.json as it stood at the merge base, or null if it is new. */
function manifestAtBase(dir) {
  try {
    // stderr is discarded: a package added on this branch is a normal outcome
    // here, and git reports it as a fatal error.
    return JSON.parse(
      execFileSync(
        "git",
        ["show", `${mergeBase}:packages/${dir}/package.json`],
        { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
      )
    );
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Walk the packages the diff actually touches.
// ---------------------------------------------------------------------------

const stale = [];
const bumped = [];
const exempt = [];

const touched = new Set(
  changed
    .filter((file) => file.startsWith("packages/"))
    .map((file) => file.split("/")[1])
);

for (const dir of [...touched].sort()) {
  const manifest = path.join(PACKAGES, dir, "package.json");
  if (!fs.existsSync(manifest)) continue; // deleted in this branch

  const head = JSON.parse(fs.readFileSync(manifest, "utf8"));
  if (head.private) continue;

  const files = changed
    .filter((file) => file.startsWith(`packages/${dir}/`))
    .map((file) => file.slice(`packages/${dir}/`.length));

  const triggering = files.filter((file) =>
    TRIGGERS.some((pattern) => pattern.test(file))
  );

  const base = manifestAtBase(dir);
  if (!base) {
    exempt.push([head.name, "new package"]);
    continue;
  }

  // A package.json whose only edit is the version field is the bump itself,
  // not a change demanding one.
  const manifestOnly =
    triggering.length === 1 && triggering[0] === "package.json";
  if (manifestOnly) {
    const strip = ({ version, ...rest }) => JSON.stringify(rest);
    if (strip(head) === strip(base)) {
      if (compare(head.version, base.version) > 0)
        bumped.push([head.name, base.version, head.version]);
      else exempt.push([head.name, "version-only edit"]);
      continue;
    }
  }

  if (!triggering.length) {
    exempt.push([head.name, `${files.length} file(s), none consumer-visible`]);
    continue;
  }

  const direction = compare(head.version, base.version);
  if (direction > 0) bumped.push([head.name, base.version, head.version]);
  else
    stale.push({
      name: head.name,
      version: head.version,
      baseVersion: base.version,
      reason: direction === 0 ? "unchanged" : "lower than base",
      triggering,
    });
}

// ---------------------------------------------------------------------------
// Report.
// ---------------------------------------------------------------------------

console.log(
  `Comparing against ${BASE} (merge base ${mergeBase.slice(0, 9)}).\n`
);

for (const [name, from, to] of bumped)
  console.log(`  ✓ ${name}  ${from} → ${to}`);
for (const [name, why] of exempt) console.log(`  – ${name}  (${why})`);

if (!stale.length) {
  const total = bumped.length + exempt.length;
  console.log(
    total
      ? `\n✓ Every package with consumer-visible changes is bumped.`
      : `\n✓ No published package was touched.`
  );
  process.exit(0);
}

console.error("\nPackages changed without a version bump:\n");
for (const entry of stale) {
  console.error(`  ${entry.name}  (${entry.version}, ${entry.reason})`);
  for (const file of entry.triggering.slice(0, 6)) {
    console.error(`      ${file}`);
  }
  if (entry.triggering.length > 6) {
    console.error(`      …and ${entry.triggering.length - 6} more`);
  }
}

console.error(
  `\nBump each one, for example:\n` +
    stale
      .map((e) => `  npm version patch --no-git-tag-version -w ${e.name}`)
      .join("\n")
);

fail(
  `${stale.length} package(s) change what they publish without a higher version`
);
