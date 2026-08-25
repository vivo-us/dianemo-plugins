#!/usr/bin/env node
/**
 * Build every workspace in dependency order.
 *
 * The graph is one level deep — @dianemo/plugin-kit, then the plugins that
 * import it — but `npm run build --workspaces` does not topologically sort.
 * It runs alphabetically, so every plugin sorting before `plugin-kit` fails
 * with TS2307 against a dist that does not exist yet, and npm presses on
 * through the rest before exiting 2. The old `build:kit && build:plugins`
 * pairing avoided that only by building the kit by hand first, which left
 * `--workspaces` to rebuild it a second time.
 *
 * Plugins never import each other, so once the kit is built they are
 * independent and run in parallel.
 *
 *   node scripts/build.mjs             # kit, then every plugin in parallel
 *   node scripts/build.mjs --serial    # one at a time, for readable errors
 */
import { execFile, execFileSync } from "node:child_process";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const ROOT = path.resolve(import.meta.dirname, "..");
const PACKAGES = path.join(ROOT, "packages");
const SERIAL = process.argv.includes("--serial");
const KIT = "@dianemo/plugin-kit";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function fail(message) {
  console.error(`\n✗ ${message}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Collect the workspaces that actually have a build to run.
// ---------------------------------------------------------------------------

const workspaces = fs
  .readdirSync(PACKAGES, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const dir = path.join(PACKAGES, entry.name);
    const manifest = path.join(dir, "package.json");
    if (!fs.existsSync(manifest)) return null;
    const { name, scripts } = JSON.parse(fs.readFileSync(manifest, "utf8"));
    return scripts?.build ? { name, dir } : null;
  })
  .filter(Boolean);

const kit = workspaces.find((w) => w.name === KIT);
if (!kit) fail(`${KIT} is not a workspace — nothing can be built against it`);

const plugins = workspaces.filter((w) => w.name !== KIT);

// ---------------------------------------------------------------------------
// The kit first, on its own. Every plugin resolves its types through the
// workspace symlink into this dist, so a plugin started before it finishes
// sees no types at all.
// ---------------------------------------------------------------------------

console.log(`Building ${KIT}…`);
try {
  execFileSync(npm, ["run", "build"], {
    cwd: kit.dir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch (error) {
  process.stdout.write(error.stdout ?? "");
  process.stderr.write(error.stderr ?? "");
  fail(`${KIT} failed to build — no plugin can compile, so nothing else ran`);
}

// ---------------------------------------------------------------------------
// Then the plugins, bounded by the machine rather than by the package count.
// ---------------------------------------------------------------------------

const build = (workspace) =>
  new Promise((resolve) => {
    execFile(npm, ["run", "build"], { cwd: workspace.dir }, (error, out, err) =>
      resolve({ workspace, error, output: `${out ?? ""}${err ?? ""}` })
    );
  });

const limit = SERIAL ? 1 : Math.max(1, os.availableParallelism() - 2);
console.log(
  `Building ${plugins.length} plugins${SERIAL ? " serially" : ` (${limit} at a time)`}…`
);

const queue = [...plugins];
const failures = [];

async function worker() {
  for (let next = queue.shift(); next; next = queue.shift()) {
    const { workspace, error, output } = await build(next);
    if (error) {
      failures.push({ name: workspace.name, output });
      console.log(`  ✗ ${workspace.name}`);
    } else {
      console.log(`  ✓ ${workspace.name}`);
    }
  }
}

await Promise.all(Array.from({ length: limit }, worker));

// Every failure is reported, not just the first: a kit change that breaks
// twelve plugins is one problem, and seeing one of them reads as twelve.
for (const { name, output } of failures) {
  console.error(`\n--- ${name} ---`);
  process.stderr.write(output);
}

if (failures.length) {
  fail(
    `${failures.length} of ${plugins.length} plugins failed to build: ` +
      failures.map((f) => f.name).join(", ")
  );
}

console.log(`\n✓ Built ${KIT} and ${plugins.length} plugins.`);
