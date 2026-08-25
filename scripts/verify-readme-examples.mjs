#!/usr/bin/env node
/**
 * Type-check the TypeScript example in every README against the built packages.
 *
 * A setup example is documentation that claims to compile, so it should have to.
 * The first pass over these READMEs found examples calling `new RequestHandler({
 * redis })` — an option that does not exist — plus a dozen payloads that did not
 * match their request types. Nothing caught it, because nothing compiled them.
 *
 * Each README's first ```ts block is extracted to its own module and compiled
 * with the same NodeNext resolution a consumer uses, so an example that drifts
 * from a request signature fails here rather than in someone's editor.
 *
 * Zero-dependency: no commander, so it runs without an install step.
 *
 *   node scripts/verify-readme-examples.mjs         # check every README
 *   node scripts/verify-readme-examples.mjs --keep  # leave the extracted files
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const ROOT = path.resolve(import.meta.dirname, "..");
const KEEP = process.argv.includes("--keep");
const OUT = path.join(ROOT, ".readme-examples");

const readmes = [
  ["_root", path.join(ROOT, "README.md")],
  ...fs
    .readdirSync(path.join(ROOT, "packages"))
    .filter((d) => d.startsWith("plugin-"))
    .sort()
    .map((d) => [
      d.replace(/-/g, "_"),
      path.join(ROOT, "packages", d, "README.md"),
    ]),
];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);

let extracted = 0;
const skipped = [];
for (const [name, file] of readmes) {
  if (!fs.existsSync(file)) continue;
  const match = /```ts\n([\s\S]*?)```/.exec(fs.readFileSync(file, "utf8"));
  if (!match) {
    skipped.push(path.relative(ROOT, file));
    continue;
  }
  fs.writeFileSync(path.join(OUT, `${name}.ts`), match[1]);
  extracted++;
}

fs.writeFileSync(
  path.join(OUT, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        lib: ["ES2022"],
        module: "NodeNext",
        moduleResolution: "NodeNext",
        strict: true,
        noEmit: true,
        skipLibCheck: true,
        types: ["node"],
      },
      include: ["*.ts"],
    },
    null,
    2
  ) + "\n"
);

// A README example imports the package by name, so the packages must be built.
if (!fs.existsSync(path.join(ROOT, "packages", "plugin-kit", "dist"))) {
  console.error("\n✗ packages are not built — run `npm run build` first");
  process.exit(1);
}

console.log(`Type-checking ${extracted} README examples…`);
if (skipped.length) console.log(`  (no ts block: ${skipped.join(", ")})`);

let failed = false;
try {
  execFileSync(
    path.join(ROOT, "node_modules", ".bin", "tsc"),
    ["-p", path.join(OUT, "tsconfig.json")],
    { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
  );
} catch (error) {
  process.stdout.write(error.stdout ?? "");
  process.stderr.write(error.stderr ?? "");
  failed = true;
}

if (KEEP)
  console.log(`\nExtracted examples kept in ${path.relative(ROOT, OUT)}`);
else fs.rmSync(OUT, { recursive: true, force: true });

if (failed) {
  console.error(
    "\n✗ a README example does not compile against the built packages"
  );
  process.exit(1);
}
console.log("\n✓ Every README example compiles.");
